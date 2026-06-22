'use client';

import React from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            🧠 MindReply
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/pricing" className="hover:text-blue-600">Pricing</Link>
            <Link href="/revenue" className="hover:text-blue-600">Revenue</Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">💼 Your Dashboard</h1>

        {/* Subscription Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">💳 Your Subscription</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Plan</p>
              <p className="text-2xl font-bold">Pro</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="text-2xl font-bold text-green-600">Active</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Cost</p>
              <p className="text-2xl font-bold">$99</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Next Billing</p>
              <p className="text-2xl font-bold">Jul 17, 2026</p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Link
              href="/pricing"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Upgrade Plan
            </Link>
            <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
              Cancel Subscription
            </button>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">📊 Usage This Month</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
              <p className="text-sm opacity-90 mb-2">Emails Processed</p>
              <p className="text-3xl font-bold">2,547</p>
              <p className="text-sm opacity-90 mt-2">/ 1,000 limit</p>
              <div className="w-full bg-blue-400 rounded-full h-2 mt-4">
                <div className="bg-blue-300 h-2 rounded-full" style={{ width: '254%' }}></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
              <p className="text-sm opacity-90 mb-2">API Calls</p>
              <p className="text-3xl font-bold">1,203</p>
              <p className="text-sm opacity-90 mt-2">Unlimited</p>
              <div className="w-full bg-green-400 rounded-full h-2 mt-4">
                <div className="bg-green-300 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
              <p className="text-sm opacity-90 mb-2">Storage Used</p>
              <p className="text-3xl font-bold">2.3 GB</p>
              <p className="text-sm opacity-90 mt-2">/ 50 GB</p>
              <div className="w-full bg-purple-400 rounded-full h-2 mt-4">
                <div className="bg-purple-300 h-2 rounded-full" style={{ width: '4.6%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">📝 Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <p className="font-semibold">Invoice - Pro Plan</p>
                <p className="text-sm text-gray-600">June 17, 2026</p>
              </div>
              <p className="font-bold">$99.00</p>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <p className="font-semibold">Upgrade to Pro</p>
                <p className="text-sm text-gray-600">May 17, 2026</p>
              </div>
              <p className="text-green-600">+Pro Plan</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Account Created</p>
                <p className="text-sm text-gray-600">May 1, 2026</p>
              </div>
              <p className="text-blue-600">Started</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
