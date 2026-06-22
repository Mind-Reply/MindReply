'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    emails: 100,
    features: ['100 emails/month', 'Basic analytics', 'Email support'],
    cta: 'Start Free Trial',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    emails: 1000,
    features: ['1000 emails/month', 'Advanced analytics', 'Priority support', 'API access'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    emails: 10000,
    features: ['10000 emails/month', 'Custom analytics', '24/7 support', 'Dedicated account manager'],
    cta: 'Contact Sales',
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (planId: string, price: number) => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, price }),
      });

      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      alert('Payment system is being set up. Check back soon!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            🧠 MindReply
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-blue-400">Home</Link>
            <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">💳 Start Making Revenue Today</h1>
          <p className="text-xl text-gray-300">
            Choose the perfect plan for your email automation needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-8 transition-all ${
                plan.popular
                  ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-900 to-blue-800 scale-105'
                  : 'bg-gray-800 hover:bg-gray-750'
              }`}
            >
              {plan.popular && (
                <div className="mb-4 inline-block">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    ⭐ MOST POPULAR
                  </span>
                </div>
              )}

              <h2 className="text-3xl font-bold mb-2">{plan.name}</h2>
              
              <div className="mb-6">
                <span className="text-5xl font-bold">${plan.price}</span>
                <span className="text-gray-300 ml-2">/month</span>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-700">
                <p className="text-sm text-gray-300">Up to {plan.emails} emails per month</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-green-400 text-xl mt-0.5">✓</span>
                    <span className="text-gray-200">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.id, plan.price)}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold transition-all text-lg ${
                  plan.popular
                    ? 'bg-white text-blue-900 hover:bg-gray-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-50`}
              >
                {loading ? '⏳ Processing...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">🚀 Ready to Get Started?</h2>
          <p className="text-lg text-blue-100 mb-6">
            Try any plan free for 14 days. No credit card required to get started.
          </p>
          <button
            onClick={() => handleCheckout('pro', 99)}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all"
          >
            Start Free Trial Now
          </button>
        </div>
      </main>
    </div>
  );
}
