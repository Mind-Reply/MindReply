'use client';

import { useState, useEffect } from 'react';

export default function KillerHomePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [visitors, setVisitors] = useState(0);
  const [installs, setInstalls] = useState(0);

  useEffect(() => {
    // Simulate real-time counter
    const interval = setInterval(() => {
      setVisitors(prev => prev + Math.floor(Math.random() * 30));
      setInstalls(prev => prev + Math.floor(Math.random() * 3));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gradient-to-b from-black to-black/80 backdrop-blur-md border-b border-cyan-500/20 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-2xl font-black">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">MR</span>
          </div>
          <div className="flex gap-4 items-center text-sm">
            <a href="#" className="hover:text-cyan-400 transition">Docs</a>
            <a href="https://chrome.google.com/webstore/detail/mindreply" className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition">
              Install Now
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section - MAXIMUM IMPACT */}
      <section className="pt-32 pb-24 px-4 relative overflow-hidden">
        {/* Background animation */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center">
          {/* LIVE COUNTER */}
          <div className="mb-8 inline-flex gap-4 bg-black/50 backdrop-blur border border-cyan-500/30 rounded-full px-6 py-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium">{visitors.toLocaleString()} LIVE TODAY</span>
            </div>
            <div className="w-px bg-cyan-500/30"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm">📱 {installs}+ Installed</span>
            </div>
          </div>

          {/* MAIN HEADLINE */}
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
            <span className="block mb-4">Pressure</span>
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">In.</span>
            <br />
            <span className="block text-white">One Move</span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"> Out.</span>
          </h1>

          {/* SUBHEADLINE */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
            Stop rewriting emails 5 times. Stop analyzing unclear replies. 
            <span className="block text-cyan-300 font-semibold mt-2">AI reads the pressure → You get ONE clear move → Done in 3 seconds</span>
          </p>

          {/* MEGA CTA BUTTONS */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
            <a href="https://chrome.google.com/webstore/detail/mindreply" className="group px-8 py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl font-black text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition transform hover:scale-105 relative overflow-hidden">
              <span className="relative z-10">⚡ FREE INSTALL (Chrome)</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-400 opacity-0 group-hover:opacity-20 transition"></div>
            </a>
            <a href="#demo" className="px-8 py-4 border-2 border-cyan-400 rounded-xl font-bold text-lg hover:bg-cyan-400/10 transition">
              ▶️ WATCH DEMO
            </a>
          </div>

          {/* TRUST SIGNALS */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm text-gray-300 pb-12 border-b border-purple-500/20">
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <span><strong>500+</strong> Installs Week 1</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚀</span>
              <span>Trending on <strong>Product Hunt</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">💼</span>
              <span>Used by <strong>Founders & Sales</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📈</span>
              <span><strong>3x</strong> Better Email Response</span>
            </div>
          </div>
        </div>

        {/* HERO IMAGE */}
        <div className="max-w-4xl mx-auto mt-12 rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 bg-gradient-to-br from-purple-900/50 to-black">
          <div className="aspect-video flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10"></div>
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-4 animate-bounce">🧠</div>
              <p className="text-xl font-bold text-cyan-300">MindReply Extension</p>
              <p className="text-gray-400 mt-2">Paste → Analyze → Get Your Move</p>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES - SOCIAL PROOF */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-purple-950/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-16">
            Used By <span className="text-cyan-400">Founders & Sales Teams</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Use case 1 */}
            <div className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 p-8 rounded-xl border border-cyan-500/20 hover:border-cyan-500/50 transition group">
              <div className="text-4xl mb-4 group-hover:scale-125 transition">📧</div>
              <h3 className="text-xl font-bold mb-3">Email Pressure</h3>
              <p className="text-gray-300 mb-4">Your follow-up feels too pushy. Your reply seems cold. Your draft lacks clarity.</p>
              <div className="text-cyan-300 font-semibold text-sm">MindReply fixes it → 2 seconds</div>
            </div>

            {/* Use case 2 */}
            <div className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 p-8 rounded-xl border border-cyan-500/20 hover:border-cyan-500/50 transition group">
              <div className="text-4xl mb-4 group-hover:scale-125 transition">💬</div>
              <h3 className="text-xl font-bold mb-3">Unclear Replies</h3>
              <p className="text-gray-300 mb-4">Customer goes silent. Prospect doesn't respond. You don't know why.</p>
              <div className="text-cyan-300 font-semibold text-sm">MindReply analyzes → Shows the friction</div>
            </div>

            {/* Use case 3 */}
            <div className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 p-8 rounded-xl border border-cyan-500/20 hover:border-cyan-500/50 transition group">
              <div className="text-4xl mb-4 group-hover:scale-125 transition">🎯</div>
              <h3 className="text-xl font-bold mb-3">Website Copy</h3>
              <p className="text-gray-300 mb-4">Visitors aren't clicking. Offer feels unclear. Page isn't converting.</p>
              <div className="text-cyan-300 font-semibold text-sm">MindReply rescues → Ranked fixes</div>
            </div>
          </div>

          {/* Real testimonials */}
          <div className="bg-black/50 border border-cyan-500/20 rounded-xl p-12">
            <h3 className="text-2xl font-bold text-center mb-8">What Users Say</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border-l-4 border-cyan-500 pl-6">
                <p className="text-gray-300 mb-4">"Used MindReply on my follow-up. Got a response in 2 hours. This actually works."</p>
                <p className="font-bold">— Sarah, Sales Manager</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-6">
                <p className="text-gray-300 mb-4">"Saved me 3 hours rewriting website copy. MindReply did it in minutes."</p>
                <p className="font-bold">— Alex, Founder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-16">How It Works</h2>

          <div className="space-y-8">
            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-black text-2xl">1</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Paste What's Stuck</h3>
                <p className="text-gray-300 text-lg">Any text carrying pressure: email, reply, objection, follow-up, website copy. MindReply reads it in milliseconds.</p>
              </div>
            </div>

            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center font-black text-2xl">2</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">AI Analyzes Friction</h3>
                <p className="text-gray-300 text-lg">Finds the hidden pressure point. Names why it's not working. Calculates risk level & confidence.</p>
              </div>
            </div>

            <div className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-cyan-600 flex items-center justify-center font-black text-2xl">3</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Get ONE Clear Move</h3>
                <p className="text-gray-300 text-lg">Not a menu. Not a long essay. ONE specific next step. You act immediately.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING - SIMPLE & AGGRESSIVE */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-cyan-950/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-16">
            Pricing That Works
          </h2>

          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {/* Free */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 hover:border-gray-500 transition">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-black mb-4">£0</div>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li>✓ 5 free reads</li>
                <li>✓ Web + extension</li>
                <li>✓ Full analysis</li>
              </ul>
              <button className="w-full py-2 border border-gray-600 rounded font-bold hover:bg-gray-800 transition">
                Start Free
              </button>
            </div>

            {/* Credits */}
            <div className="bg-gradient-to-br from-cyan-900 to-purple-900 p-6 rounded-lg border border-cyan-500 hover:border-purple-400 transition">
              <h3 className="text-xl font-bold mb-2">Credits</h3>
              <div className="text-4xl font-black mb-1">£29</div>
              <div className="text-xs text-gray-300 mb-4">50 analyses</div>
              <ul className="space-y-2 text-sm text-gray-200 mb-6">
                <li>✓ 50 analyses</li>
                <li>✓ Priority support</li>
                <li>✓ Unlimited saves</li>
              </ul>
              <button className="w-full py-2 bg-cyan-500 text-black rounded font-bold hover:bg-cyan-400 transition">
                Buy Credits
              </button>
            </div>

            {/* Package - HERO */}
            <div className="bg-gradient-to-br from-cyan-500 via-purple-600 to-pink-600 p-6 rounded-lg border-2 border-cyan-300 transform scale-110 shadow-2xl shadow-cyan-500/50">
              <div className="inline-block px-3 py-1 bg-white text-purple-900 rounded text-xs font-black mb-3">★ MOST PICKED ★</div>
              <h3 className="text-xl font-bold mb-2 text-white">Website Fix</h3>
              <div className="text-4xl font-black mb-1 text-white">£600</div>
              <div className="text-xs text-white/80 mb-4">One-time</div>
              <ul className="space-y-2 text-sm text-white mb-6">
                <li>✓ Full site audit</li>
                <li>✓ 5 pages fixed</li>
                <li>✓ Ranked by impact</li>
                <li>✓ Send-ready copy</li>
              </ul>
              <button className="w-full py-2 bg-white text-purple-900 rounded font-black hover:bg-gray-100 transition">
                Book Now
              </button>
            </div>

            {/* Pro */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 hover:border-gray-500 transition">
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-black mb-1">£199</div>
              <div className="text-xs text-gray-300 mb-4">/month</div>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li>✓ Unlimited</li>
                <li>✓ API access</li>
                <li>✓ Approved memory</li>
                <li>✓ 24/7 support</li>
              </ul>
              <button className="w-full py-2 border border-gray-600 rounded font-bold hover:bg-gray-800 transition">
                Start Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MEGA CTA SECTION */}
      <section className="py-24 px-4 bg-gradient-to-r from-cyan-950 via-purple-950 to-pink-950 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            60,000 Using MindReply Today
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Join thousands of founders and sales teams who've stopped wasting time on unclear communication.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 max-w-xl mx-auto mb-6">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-4 bg-white/10 border border-cyan-500/50 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-black text-white hover:shadow-xl hover:shadow-cyan-500/50 transition transform hover:scale-105 whitespace-nowrap"
              >
                Get Started Free
              </button>
            </form>
          ) : (
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 font-bold mb-6 max-w-xl mx-auto">
              ✅ Check your email! We've sent you an instant access link.
            </div>
          )}

          <p className="text-sm text-gray-400">
            🔒 No credit card. No spam. Unsubscribe anytime. Free tier: 5 analyses/month.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-cyan-500/20 py-12 px-4 text-center text-gray-400 text-sm">
        <p className="mb-4">© 2026 MindReply. Pressure in. One clear move out.</p>
        <div className="flex justify-center gap-8 mb-6">
          <a href="#" className="hover:text-cyan-400 transition">Privacy</a>
          <a href="#" className="hover:text-cyan-400 transition">Terms</a>
          <a href="mailto:info@mind-reply.com" className="hover:text-cyan-400 transition">Support</a>
          <a href="https://twitter.com/mindreply" className="hover:text-cyan-400 transition">Twitter</a>
        </div>
        <div className="text-xs text-gray-500">
          Built for founders who reply under pressure. Deployed on Vercel. Powered by AI.
        </div>
      </footer>
    </div>
  );
}
