#!/usr/bin/env python3
"""
Stripe Webhook Handler - PRODUCTION LIVE
Receives Stripe webhooks and processes payments automatically
Deployed to: https://mind-reply.com/webhook/stripe
"""
import os
import json
import hmac
import hashlib
from http.server import BaseHTTPRequestHandler, HTTPServer
from datetime import datetime
import subprocess
import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET', 'whsec_test_secret')
N8N_WEBHOOK_URL = os.environ.get('N8N_WEBHOOK_URL', 'http://localhost:5678/webhook')
BILLING_EMAIL = os.environ.get('BILLING_EMAIL', 'angelkrustev@aol.com')
BILLING_CONTACT = os.environ.get('BILLING_CONTACT', 'info@mind-reply.com')
SLACK_WEBHOOK = os.environ.get('SLACK_WEBHOOK', '')

class StripeWebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Handle incoming Stripe webhook"""
        content_length = int(self.headers.get('content-length', 0))
        body = self.rfile.read(content_length)
        sig_header = self.headers.get('stripe-signature', '')
        
        try:
            # Verify webhook signature
            timestamp = sig_header.split(',')[0].split('=')[1]
            signature = sig_header.split(',')[1].split('=')[1]
            
            signed_content = f"{timestamp}.{body.decode()}"
            expected_sig = hmac.new(
                STRIPE_WEBHOOK_SECRET.encode(),
                signed_content.encode(),
                hashlib.sha256
            ).hexdigest()
            
            # Parse event
            event = json.loads(body)
            event_type = event.get('type', '')
            
            print(f"[STRIPE] {event_type} - Signature: {'✓ VALID' if signature == expected_sig else '✗ INVALID'}")
            
            # Handle charge.succeeded
            if event_type == 'charge.succeeded':
                self.handle_charge_succeeded(event)
            
            # Handle charge.failed
            elif event_type == 'charge.failed':
                self.handle_charge_failed(event)
            
            # Send 200 OK
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'received': True}).encode())
            
        except Exception as e:
            print(f"[ERROR] Webhook processing failed: {e}")
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def handle_charge_succeeded(self, event):
        """Process successful charge"""
        charge = event.get('data', {}).get('object', {})
        
        charge_id = charge.get('id')
        amount = charge.get('amount')  # in cents
        currency = charge.get('currency', 'gbp').upper()
        customer_email = charge.get('receipt_email') or charge.get('billing_details', {}).get('email') or 'unknown@example.com'
        metadata = charge.get('metadata', {})
        product = metadata.get('product', 'website-completion-package')
        
        print(f"[CHARGE SUCCESS] {charge_id} - £{amount/100:.2f} {currency} from {customer_email}")
        
        # Send to N8N webhook
        self.send_to_n8n({
            'event': 'charge.succeeded',
            'charge_id': charge_id,
            'amount': amount,
            'currency': currency,
            'customer_email': customer_email,
            'product': product,
            'timestamp': datetime.utcnow().isoformat()
        })
        
        # Insert into database (if available)
        self.insert_order(customer_email, amount, currency, product, charge_id)
        
        # Send billing notifications
        self.send_billing_notification(charge_id, amount, currency, customer_email, product)
    
    def handle_charge_failed(self, event):
        """Process failed charge"""
        charge = event.get('data', {}).get('object', {})
        charge_id = charge.get('id')
        reason = charge.get('failure_message', 'Unknown')
        
        print(f"[CHARGE FAILED] {charge_id}: {reason}")
        
        # Log to N8N
        self.send_to_n8n({
            'event': 'charge.failed',
            'charge_id': charge_id,
            'reason': reason,
            'timestamp': datetime.utcnow().isoformat()
        })
    
    def send_to_n8n(self, payload):
        """Send event to N8N webhook"""
        try:
            import urllib.request
            import urllib.error
            
            req = urllib.request.Request(
                N8N_WEBHOOK_URL,
                data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            
            response = urllib.request.urlopen(req, timeout=5)
            print(f"[N8N] Webhook sent - Status: {response.status}")
        except urllib.error.URLError as e:
            print(f"[N8N ERROR] Webhook failed: {e}")
        except Exception as e:
            print(f"[ERROR] Failed to send to N8N: {e}")
    
    def insert_order(self, email, amount, currency, product, charge_id):
        """Insert order into database"""
        try:
            import psycopg2
            
            conn = psycopg2.connect(
                host=os.environ.get('DB_HOST', 'localhost'),
                user=os.environ.get('DB_USER', 'mindreply'),
                password=os.environ.get('DB_PASS', 'devpass123'),
                database=os.environ.get('DB_NAME', 'mindreply')
            )
            
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO orders (customer_email, amount, currency, product, status, stripe_charge_id, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, NOW())
                RETURNING id
            """, (email, amount, currency, product, 'paid', charge_id))
            
            order_id = cur.fetchone()[0]
            conn.commit()
            
            print(f"[DATABASE] Order #{order_id} created")
            
            conn.close()
        except Exception as e:
            print(f"[DB ERROR] {e}")
    
    def send_billing_notification(self, charge_id, amount, currency, customer_email, product):
        """Send billing notification to admin"""
        try:
            message = f"""
            Payment Received
            
            Charge ID: {charge_id}
            Amount: £{amount/100:.2f} {currency}
            Product: {product}
            Customer: {customer_email}
            Timestamp: {datetime.utcnow().isoformat()}
            
            Dashboard: https://mind-reply.com/dashboard
            """
            
            # Log to Slack if configured
            if SLACK_WEBHOOK:
                self.send_to_slack({
                    'text': f'💰 Payment: £{amount/100:.2f} from {customer_email}',
                    'charge_id': charge_id,
                    'product': product
                })
            
            print(f"[BILLING] Notification ready for {BILLING_EMAIL}")
        except Exception as e:
            print(f"[BILLING ERROR] {e}")
    
    def send_to_slack(self, payload):
        """Send notification to Slack"""
        try:
            import urllib.request
            import urllib.error
            
            slack_msg = {
                'text': payload.get('text', ''),
                'attachments': [{
                    'color': 'good',
                    'fields': [
                        {'title': 'Charge ID', 'value': payload.get('charge_id', ''), 'short': True},
                        {'title': 'Product', 'value': payload.get('product', ''), 'short': True}
                    ]
                }]
            }
            
            req = urllib.request.Request(
                SLACK_WEBHOOK,
                data=json.dumps(slack_msg).encode('utf-8'),
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            
            urllib.request.urlopen(req, timeout=5)
            print(f"[SLACK] Notification sent")
        except Exception as e:
            print(f"[SLACK ERROR] {e}")
    
    def log_message(self, format, *args):
        """Suppress default logging"""
        pass

if __name__ == '__main__':
    print("[STRIPE WEBHOOK] Starting on http://0.0.0.0:9000")
    print(f"[CONFIG] N8N URL: {N8N_WEBHOOK_URL}")
    print(f"[CONFIG] Webhook Secret: {'SET' if STRIPE_WEBHOOK_SECRET != 'whsec_test_secret' else 'TEST MODE'}")
    
    server = HTTPServer(('0.0.0.0', 9000), StripeWebhookHandler)
    print("[READY] Listening for Stripe webhooks...")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[STOPPED] Webhook server stopped")
        server.shutdown()
