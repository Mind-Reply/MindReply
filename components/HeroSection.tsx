'use client';

import React, { useState } from 'react';

interface HeroSectionProps {
  onConciergeClick?: () => void;
}

export default function HeroSection({ onConciergeClick }: HeroSectionProps) {
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'agent',
      content: 'Good afternoon. I am MRagent, your executive communication intelligence partner. How may I assist your communication objectives today?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setChatMessages([...chatMessages, { role: 'user', content: inputValue }]);
    setInputValue('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'agent',
          content: 'An exquisite inquiry. For this context, I recommend framing with transparent intention and validating perspective. Would you like me to refine a draft?',
        },
      ]);
    }, 500);
  };

  return (
    <section id="agent" className="pt-32 pb-20 bg-gradient-to-b from-mr-cream to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 mb-6 shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-gray-600">MRagent is online and ready to assist</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-mr-navy mb-6 leading-tight">
              Your Subconscious Communication <span className="text-mr-gold italic">Intelligence Partner</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              MindReply empowers professionals with behavioral intelligence for email composition, expression refinement, and strategic dialogue—curated for psychologists, legal counsel, financial advisors, and C-suite executives worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-mr-navy hover:bg-mr-accent text-white px-8 py-4 rounded-xl font-medium text-lg">
                Begin Conversation
              </button>
              <button className="bg-white hover:bg-gray-50 text-mr-navy border-2 border-mr-navy px-8 py-4 rounded-xl font-medium text-lg">
                Explore Micro-Tools
              </button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 fade-in-up delay-1">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-mr-navy rounded-full flex items-center justify-center text-white">
                  🤖
                </div>
                <div>
                  <h3 className="font-bold text-mr-navy">MRagent</h3>
                  <p className="text-xs text-green-500">● Online • Subconscious Intelligence Active</p>
                </div>
              </div>
              <div className="text-xs text-gray-500 bg-mr-cream px-3 py-1 rounded-full">
                Credits: <span className="font-bold text-mr-gold">5</span>
              </div>
            </div>

            <div className="h-80 overflow-y-auto space-y-4 pr-2 no-scrollbar">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`px-5 py-3 max-w-[85%] shadow-sm text-sm leading-relaxed rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-mr-cream text-gray-700 rounded-br-none'
                        : 'bg-gradient-to-r from-mr-navy to-mr-accent text-white rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Describe your communication need..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-mr-gold outline-none"
                />
                <button
                  type="submit"
                  className="bg-mr-navy hover:bg-mr-accent text-white w-12 h-12 rounded-xl flex items-center justify-center"
                >
                  ✈️
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
