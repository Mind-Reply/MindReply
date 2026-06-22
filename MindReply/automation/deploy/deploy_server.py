#!/usr/bin/env python3
"""MR Deploy Server - Vercel deployment trigger"""
import os
import subprocess
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs

RUN_REAL = int(os.environ.get('RUN_REAL_DEPLOYS', '0'))
VERCEL_TOKEN = os.environ.get('VERCEL_TOKEN', '')

class DeployHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Handle deployment requests"""
        content_length = int(self.headers.get('content-length', 0))
        body = self.rfile.read(content_length).decode()
        data = parse_qs(body)
        
        site = data.get('site', ['site_1'])[0]
        
        # Preview mode: just echo the command
        cmd = ['vercel', '--prod', '--confirm', '--token', VERCEL_TOKEN or 'MOCK_TOKEN', '--cwd', f'./sites/{site}']
        
        response = {
            'status': 'ok',
            'message': f'Deploy triggered for {site}',
            'preview': ' '.join(cmd),
            'real_run': bool(RUN_REAL and VERCEL_TOKEN)
        }
        
        # Real deploy only if explicitly enabled AND token exists
        if RUN_REAL and VERCEL_TOKEN:
            try:
                result = subprocess.run(cmd, capture_output=True, text=True, check=True)
                response['deployed'] = True
                response['output'] = result.stdout
            except subprocess.CalledProcessError as e:
                response['deployed'] = False
                response['error'] = e.stderr
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode())
    
    def log_message(self, format, *args):
        """Suppress default logging"""
        pass

if __name__ == '__main__':
    print("[Deploy Server] Starting on http://127.0.0.1:8000")
    print(f"[Deploy Server] Real deploys: {'ENABLED' if RUN_REAL else 'DISABLED'}")
    HTTPServer(('127.0.0.1', 8000), DeployHandler).serve_forever()
