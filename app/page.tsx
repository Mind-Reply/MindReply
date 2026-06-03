'use client';

import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import SubconciousSection from '@/components/SubconciousSection';
import ProfessionalLexicons from '@/components/ProfessionalLexicons';
import MicroTools from '@/components/MicroTools';
import Memberships from '@/components/Memberships';
import BusinessGrowth from '@/components/BusinessGrowth';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import ConciergeModal from '@/components/ConciergeModal';

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showConciergeModal, setShowConciergeModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  return (
    <>
      <Navigation
        onAuthClick={() => {
          setAuthMode('login');
          setShowAuthModal(true);
        }}
        onSignUpClick={() => {
          setAuthMode('signup');
          setShowAuthModal(true);
        }}
        onConciergeClick={() => setShowConciergeModal(true)}
      />
      <HeroSection onConciergeClick={() => setShowConciergeModal(true)} />
      <SubconciousSection />
      <ProfessionalLexicons />
      <MicroTools />
      <Memberships onConciergeClick={() => setShowConciergeModal(true)} />
      <BusinessGrowth />
      <Footer onAuthClick={() => setShowAuthModal(true)} onConciergeClick={() => setShowConciergeModal(true)} />
      <AuthModal open={showAuthModal} mode={authMode} onClose={() => setShowAuthModal(false)} />
      <ConciergeModal open={showConciergeModal} onClose={() => setShowConciergeModal(false)} />
    </>
  );
}
