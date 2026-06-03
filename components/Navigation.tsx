'use client';

import React from 'react';
import Link from 'next/link';

interface NavigationProps {
  onAuthClick?: () => void;
  onSignUpClick?: () => void;
  onConciergeClick?: () => void;
}

export default function Navigation({
  onAuthClick,
  onSignUpClick,
  onConciergeClick,
}: NavigationProps) {
  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-mr-navy rounded-lg flex items-center justify-center">
              <span className="text-mr-gold font-serif font-bold text-xl">M</span>
            </div>
            <div>
              <span className="font-serif font-bold text-xl text-mr-navy">MindReply</span>
              <p className="text-xs text-gray-500 -mt-1">Subconscious Communication Intelligence</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#agent" className="nav-link text-sm font-medium text-gray-700 hover:text-mr-navy">
              MRagent
            </a>
            <a href="#subconscious" className="nav-link text-sm font-medium text-gray-700 hover:text-mr-navy">
              Subconscious Behavior
            </a>
            <a href="#professionals" className="nav-link text-sm font-medium text-gray-700 hover:text-mr-navy">
              Professional Lexicons
            </a>
            <a href="#tools" className="nav-link text-sm font-medium text-gray-700 hover:text-mr-navy">
              Micro-Tools
            </a>
            <a href="#memberships" className="nav-link text-sm font-medium text-gray-700 hover:text-mr-navy">
              Exclusive Access
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onAuthClick}
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-mr-navy px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Login
            </button>
            <button
              onClick={onSignUpClick}
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-mr-navy border border-mr-navy px-4 py-2 rounded-lg hover:bg-mr-navy hover:text-white"
            >
              Sign Up
            </button>
            <button
              onClick={onConciergeClick}
              className="bg-mr-navy hover:bg-mr-accent text-white px-5 py-2.5 rounded-lg text-sm font-medium"
            >
              Request Premium
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
