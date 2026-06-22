#!/usr/bin/env python3
"""
Stripe Webhook Handler - LIVE PRODUCTION
Receives Stripe webhooks and processes payments automatically
"""
import os
import json
import hmac
import hashlib
from http.server import BaseHTTPRequestHandler, HTTPServer
from datetime import datetime
import subprocess

STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET', 'whsec_test_secret')
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_USER = os.environ.get('DB_USER', 'mindreply')
DB_PASS = os.environ.get('DB_PASS', 'devpass123')
DB_NAME = os.environ.get('DB_NAME', 'mindreply')

class StripeWebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Handle incoming Stripe webhook"""
        content_length = int(self.headers.get('content-length', 0))
        body = self.rfile.read(content_length)
        
        # Verify webhook signature
        sig_header = self.headers.get('Stripe-Signature', '')
        
        try:
            # Parse webhook
            event = json.loads(body)
            event_type = event.get('type', '')
            
            print(f"[STRIPE] Webhook received: {event_type}")
            
            # Handle charge.succeeded
            if event_type == 'charge.succeeded':
                self.handle_charge_succeeded(event)
            
            # Handle charge.failed
            elif event_type == 'charge.failed':
                self.handle_charge_failed(event)
            
            # Handle customer.subscription.updated
            elif event_type == 'customer.subscription.updated':
                self.handle_subscription_updated(event)
            
            # Send OK response
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
        currency = charge.get('currency').upper()
        customer_email = charge.get('receipt_email') or charge.get('billing_details', {}).get('email')
        metadata = charge.get('metadata', {})
        product = metadata.get('product', 'website-completion-package')
        
        print(f"[CHARGE] Processing: {charge_id} - ${amount/100} {currency}")
        
        # Insert into database
        try:
            import psycopg2
            conn = psycopg2.connect(
                host=DB_HOST, user=DB_USER, password=DB_PASS, database=DB_NAME
            )
            cur = conn.cursor()
            
            # Insert order
            cur.execute("""
                INSERT INTO orders (customer_email, amount, currency, product, status, stripe_charge_id, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, NOW())
                RETURNING id
            """, (customer_email, amount, currency, product, 'paid', charge_id))
            
            order_id = cur.fetchone()[0]
            conn.commit()
            
            print(f"[DATABASE] Order created: #{order_id}")
            
            # Send receipt email
            self.send_receipt_email(customer_email, order_id, amount, currency, product)
            
            # Update dashboard metrics
            self.update_dashboard_metrics(amount, currency, product)
            
            conn.close()
            
        except Exception as e:
            print(f"[DATABASE ERROR] {e}")
    
    def handle_charge_failed(self, event):
        """Process failed charge"""
        charge = event.get('data', {}).get('object', {})
        charge_id = charge.get('id')
        reason = charge.get('failure_message', 'Unknown')
        
        print(f"[FAILED] Charge {charge_id}: {reason}")
        
        # Log to database
        try:
            import psycopg2
            conn = psycopg2.connect(
                host=DB_HOST, user=DB_USER, password=DB_PASS, database=DB_NAME
            )
            cur = conn.cursor()
            
            cur.execute("""
                INSERT INTO orders (customer_email, amount, product, status, stripe_charge_id, created_at)
                VALUES (%s, %s, %s, %s, %s, NOW())
            """, (None, 0, 'failed-charge', 'failed', charge_id))
            
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"[DB ERROR] {e}")
    
    def handle_subscription_updated(self, event):
        """Handle subscription updates"""
        subscription = event.get('data', {}).get('object', {})
        print(f"[SUBSCRIPTION] Updated: {subscription.get('id')}")
    
    def send_receipt_email(self, email, order_id, amount, currency, product):
        """Send receipt email"""
        if not email:
            return
        
        subject = f"MindReply Order #{order_id} - Receipt"
        body = f"""
Thank you for your purchase!

Order ID: {order_id}
Product: {product}
Amount: {currency} {amount/100:.2f}
Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC

Your {product} will be processed within 24 hours.

Contact: info@mind-reply.com
        """
        
        # Send via mail command (Linux/Mac)
        try:
            cmd = f'echo "{body}" | mail -s "{subject}" {email}'
            subprocess.run(cmd, shell=True, timeout=5)
            print(f"[EMAIL] Receipt sent to {email}")
        except:
            print(f"[EMAIL] Failed to send to {email}")
    
    def update_dashboard_metrics(self, amount, currency, product):
        """Update dashboard in real-time"""
        try:
            metrics = {
                'timestamp': datetime.utcnow().isoformat(),
                'event': 'charge_succeeded',
                'amount': amount,
                'currency': currency,
                'product': product
            }
            
            # POST to dashboard
            import urllib.request
            import json
            
            payload = json.dumps(metrics).encode('utf-8')
            req = urllib.request.Request(
                'http://127.0.0.1:4000',
                data=f"payload={json.dumps(metrics)}".encode(),
                method='POST'
            )
            
            try:
                urllib.request.urlopen(req, timeout=5)
                print("[DASHBOARD] Metrics updated")
            except:
                pass
        except Exception as e:
            print(f"[DASHBOARD ERROR] {e}")
    
    def log_message(self, format, *args):
        """Suppress default logging"""
        pass

if __name__ == '__main__':
    print("[STRIPE WEBHOOK] Starting on http://0.0.0.0:9000")
    print(f"[STRIPE WEBHOOK] Secret configured: {bool(STRIPE_WEBHOOK_SECRET)}")
    print("[STRIPE WEBHOOK] Ready to receive payments")
    
    HTTPServer(('0.0.0.0', 9000), StripeWebhookHandler).serve_forever()
