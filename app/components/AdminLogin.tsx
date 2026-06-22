'use client';

import { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (token: string) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('admin_token', data.token);
        onLogin(data.token);
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Authentication failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-xl border border-emerald-500/20 mb-4">
            <Lock className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-slate-400">Secure Dashboard - Private Access Only</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center">
              🔒 All data encrypted • 🚫 No third-party access • ⚡ No limitations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
