#!/usr/bin/env python3
"""MR Dashboard Writer - Real-time metrics receiver"""
import os
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs
from datetime import datetime

class DashboardHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Receive and write dashboard updates"""
        content_length = int(self.headers.get('content-length', 0))
        body = self.rfile.read(content_length).decode()
        
        try:
            data = parse_qs(body)
            payload_str = data.get('payload', ['{}'])[0]
            payload = json.loads(payload_str)
        except:
            payload = json.loads(body) if body.startswith('{') else {}
        
        # Add metadata
        payload['timestamp'] = datetime.utcnow().isoformat()
        payload['source'] = 'dashboard_writer'
        
        # Write to file
        report_path = os.path.join('dashboard', 'data', 'report.json')
        os.makedirs(os.path.dirname(report_path), exist_ok=True)
        
        with open(report_path, 'w') as f:
            json.dump(payload, f, indent=2)
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({'status': 'ok', 'wrote': report_path}).encode())
    
    def log_message(self, format, *args):
        """Suppress default logging"""
        pass

if __name__ == '__main__':
    print("[Dashboard Writer] Starting on http://127.0.0.1:4000")
    HTTPServer(('127.0.0.1', 4000), DashboardHandler).serve_forever()
