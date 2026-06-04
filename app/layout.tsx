import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "MindReply | Executive Communication Intelligence Ecosystem",
  description: "Subconscious Communication Intelligence for Elite Professionals",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="antialiased bg-mr-cream-light text-gray-900" style={{ fontFamily: "var(--font-inter)" }}>
        {children}
      </body>
    </html>
  );
}

// ============================================================================
// FILE: app/globals.css
// ============================================================================
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-inter: 'Inter', sans-serif;
  --font-playfair: 'Playfair Display', serif;
}

.font-serif { font-family: var(--font-playfair); }

.glass-card {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(201, 169, 97, 0.15);
  box-shadow: 0 8px 32px rgba(10, 22, 40, 0.08);
}

.agent-bubble {
  background: linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%);
  border-radius: 24px 24px 8px 24px;
  color: white;
}

.user-bubble {
  background: #F8F5F0;
  border-radius: 24px 24px 24px 8px;
  color: #1a202c;
}

.fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  to { opacity: 1; transform: translateY(0); }
}

.subconscious-highlight {
  position: relative;
}
.subconscious-highlight::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #C9A961;
  border-radius: 2px;
}

// ============================================================================
// FILE: tailwind.config.ts
// ============================================================================
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        serif: ["var(--font-playfair)"],
      },
      colors: {
        'mr-navy': '#0A1628',
        'mr-gold': '#C9A961',
        'mr-cream': '#F8F5F0',
        'mr-cream-light': '#FCFAF7',
        'mr-slate': '#2D3748',
        'mr-accent': '#1E3A5F',
      }
    },
  },
  plugins: [],
};
export default config;

// ============================================================================
// FILE: components/ProfessionalCard.tsx
// ============================================================================
import Link from "next/link";
import { Star, Clock, Video } from "lucide-react";

type Professional = {
  id: number; name: string; role: string; niche: string;
  rating: number; reviewCount: number; priceVideo: number;
  availabilityStatus: string; photoUrl: string;
};

export default function ProfessionalCard({ p }: { p: Professional }) {
  return (
    <div className="bg-white border rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group border-gray-100">
      <div className="relative h-56 overflow-hidden bg-mr-navy">
        <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg ${p.availabilityStatus === 'Available' ? 'bg-emerald-500' : 'bg-red-500'} text-white`}>
          <Clock size={10} /> {p.availabilityStatus}
        </div>
        {p.availabilityStatus === 'Available' && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <span className="text-xs text-white font-medium flex items-center gap-1">
              <Video size={12} /> Video Session Ready
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl font-bold mb-1 text-mr-navy">{p.name}</h3>
        <p className="text-xs font-semibold mb-3 text-mr-gold">{p.role} • {p.niche}</p>
        <div className="flex items-center gap-1.5 mb-4">
          <Star size={14} fill="#C9A961" className="text-mr-gold" />
          <span className="text-sm font-bold text-mr-navy">{p.rating.toFixed(1)}</span>
          <span className="text-xs text-mr-slate">({p.reviewCount} reviews)</span>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-xl font-bold text-mr-navy">£{p.priceVideo}</span>
            <span className="text-xs ml-1 text-mr-slate">/session</span>
          </div>
          <Link href={`/booking/${p.id}`} className="px-4 py-2.5 rounded-lg text-xs font-bold transition-all hover:opacity-90 flex items-center gap-1.5 shadow-md bg-mr-gold text-mr-navy">
            <Video size={12} /> Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FILE: app/api/professionals/featured/route.ts
// ============================================================================
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 1, name: "Dr. Sarah Jenkins", role: "Clinical Psychologist", niche: "CBT & Trauma", rating: 4.9, reviewCount: 124, priceVideo: 150, availabilityStatus: "Available", photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop" },
    { id: 2, name: "Mark Thompson", role: "Executive Coach", niche: "Leadership", rating: 4.8, reviewCount: 89, priceVideo: 200, availabilityStatus: "Available", photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" },
    { id: 3, name: "Elena Rodriguez", role: "Mediator", niche: "Conflict Resolution", rating: 5.0, reviewCount: 56, priceVideo: 180, availabilityStatus: "Busy", photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop" },
    { id: 4, name: "James Chen", role: "Financial Advisor", niche: "Wealth Strategy", rating: 4.7, reviewCount: 210, priceVideo: 250, availabilityStatus: "Available", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" },
    { id: 5, name: "Aisha Khan", role: "Legal Counsel", niche: "Corporate Law", rating: 4.9, reviewCount: 145, priceVideo: 300, availabilityStatus: "Available", photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop" },
    { id: 6, name: "David Miller", role: "PR Specialist", niche: "Crisis Comms", rating: 4.8, reviewCount: 78, priceVideo: 175, availabilityStatus: "Available", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" }
  ]);
}

// ============================================================================
// FILE: app/page.tsx
// ============================================================================
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Shield, Globe, Users, Zap, BookOpen, BarChart3, Brain, Target, CheckCircle2, Bot, Clock, Star, Video, Mail, Phone, TrendingUp, Award, ChevronRight } from "lucide-react";
import ProfessionalCard from "@/components/ProfessionalCard";

const LEXICONS = ["Clinical Psychologist", "Legal Counsel", "Financial Advisor", "HR Director", "Event Strategist", "Compliance Officer", "PR Specialist", "Executive Coach", "Mediator", "Recruitment Lead", "Training Facilitator", "Risk Analyst", "Brand Strategist", "Negotiation Expert", "Organisational Developer", "Crisis Communicator", "Stakeholder Manager", "Ethics Advisor", "Innovation Lead", "Executive Assistant"];

const MICRO_TOOLS = [
  { name: "Text Refiner", credits: 1, desc: "Instantly refine casual messages for professional contexts with subconscious tone calibration." },
  { name: "Email Polisher", credits: 2, desc: "Transform draft emails into executive-grade correspondence with behavioral intent optimization." },
  { name: "Call Scripter", credits: 2, desc: "Generate persuasive call scripts with subconscious persuasion frameworks for sales, support, or negotiations." },
  { name: "Planning Assistant", credits: 1, desc: "Structure project communications with subconscious clarity frameworks that align team expectations." },
  { name: "Correction Engine", credits: 1, desc: "Identify and correct subconscious linguistic patterns that undermine authority or clarity in professional contexts." },
  { name: "Teaching Optimizer", credits: 2, desc: "Refine instructional content with subconscious learning frameworks that enhance comprehension and retention." },
  { name: "Lexicon Refiner", credits: 3, desc: "Discipline-specific vocabulary optimization with contextual appropriateness scoring for subconscious resonance." },
  { name: "Tone Calibrator", credits: 2, desc: "Adjust emotional valence, formality register, and persuasive intensity with subconscious precision sliders." },
  { name: "Structure Architect", credits: 3, desc: "Optimise message flow for specific outcomes: decision acceleration, consensus building, or conflict resolution." },
  { name: "Cultural Adapter", credits: 2, desc: "Automatically adjust phrasing, formality, and indirectness for cross-cultural professional communication with subconscious cultural intelligence." }
];

export default function Home() {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/professionals/featured")
      .then((res) => res.json())
      .then((data) => { setProfessionals(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-mr-cream-light">
      {/* Navigation */}
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
              <a href="#agent" className="text-sm font-medium text-gray-700 hover:text-mr-navy transition-colors">MRagent</a>
              <a href="#subconscious" className="text-sm font-medium text-gray-700 hover:text-mr-navy transition-colors">Subconscious Behavior</a>
              <a href="#professionals" className="text-sm font-medium text-gray-700 hover:text-mr-navy transition-colors">Professional Lexicons</a>
              <a href="#tools" className="text-sm font-medium text-gray-700 hover:text-mr-navy transition-colors">Micro-Tools</a>
              <a href="#memberships" className="text-sm font-medium text-gray-700 hover:text-mr-navy transition-colors">Exclusive Access</a>
              <a href="#growth" className="text-sm font-medium text-gray-700 hover:text-mr-navy transition-colors">Business Growth</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-mr-navy transition-colors px-4 py-2 rounded-lg hover:bg-gray-50">
                Login
              </Link>
              <Link href="/login" className="hidden sm:flex items-center gap-2 text-sm font-medium text-mr-navy border border-mr-navy px-4 py-2 rounded-lg hover:bg-mr-navy hover:text-white transition-colors">
                Sign Up
              </Link>
              <Link href="/premium" className="bg-mr-navy hover:bg-mr-accent text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md">
                Request Premium
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 1. Hero / MRagent Section */}
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
                <Link href="/agent" className="bg-mr-navy hover:bg-mr-accent text-white px-8 py-4 rounded-xl font-medium text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  Begin Conversation <ArrowRight size={18} />
                </Link>
                <Link href="/tools" className="bg-white hover:bg-gray-50 text-mr-navy border-2 border-mr-navy px-8 py-4 rounded-xl font-medium text-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                  Explore Micro-Tools
                </Link>
              </div>
              <div className="mt-12 flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2"><Shield size={16} className="text-mr-gold" /><span>Enterprise-grade security</span></div>
                <div className="flex items-center gap-2"><Globe size={16} className="text-mr-gold" /><span>Global professional network</span></div>
              </div>
            </div>
            
            <div className="glass-card rounded-2xl p-6 border border-gray-100 fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-mr-navy rounded-full flex items-center justify-center text-white"><Bot size={20} /></div>
                  <div>
                    <h3 className="font-bold text-mr-navy">MRagent</h3>
                    <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Online • Subconscious Intelligence Active</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 bg-mr-cream px-3 py-1 rounded-full border border-gray-200">
                  Credits: <span className="font-bold text-mr-gold">5</span>
                </div>
              </div>
              <div className="h-80 overflow-y-auto space-y-4 pr-2 mb-4">
                <div className="flex justify-start"><div className="agent-bubble px-5 py-3 max-w-[85%] shadow-sm text-sm leading-relaxed">Good afternoon. I am MRagent, your executive communication intelligence partner. I observe you seek to refine professional correspondence with subconscious behavioral precision. How may I assist your communication objectives today?</div></div>
                <div className="flex justify-end"><div className="user-bubble px-5 py-3 max-w-[85%] shadow-sm text-sm leading-relaxed">I need to send a sensitive email to my team about restructuring. How should I phrase it?</div></div>
                <div className="flex justify-start"><div className="agent-bubble px-5 py-3 max-w-[85%] shadow-sm text-sm leading-relaxed">An exquisite question. For restructuring communications, I recommend a framework of <span className="underline decoration-mr-gold decoration-2 cursor-help" title="Clarity reduces anxiety during organizational change">transparent intention</span>, <span className="underline decoration-mr-gold decoration-2 cursor-help" title="Acknowledging emotions builds trust">empathetic validation</span>, and <span className="underline decoration-mr-gold decoration-2 cursor-help" title="Forward focus reduces uncertainty">future-oriented reassurance</span>. Would you like me to refine a draft with these principles?</div></div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex gap-3">
                  <input type="text" placeholder="Describe your communication need..." className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-mr-gold focus:border-transparent outline-none" />
                  <button className="bg-mr-navy hover:bg-mr-accent text-white w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-md">
                    <ArrowRight size={18} />
                  </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">MRagent learns from your preferences • Subconscious behavior analysis active</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Subconscious Behavior Section */}
      <section id="subconscious" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl font-serif font-bold text-mr-navy mb-4">Subconscious Communication Intelligence</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our proprietary framework decodes the subconscious behavioral patterns in professional correspondence, enabling intentional expression that aligns with your strategic objectives while resonating authentically with recipients.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: <Brain size={28} />, title: "Behavioral Intent Mapping", desc: "Decodes underlying subconscious drivers in written communication—identifying opportunities for enhanced clarity, trust-building, and persuasive impact without conscious effort from the writer.", points: ["Emotional valence trajectory analysis", "Power-distance subconscious calibration", "Cultural register intuitive adaptation"] },
              { icon: <BookOpen size={28} />, title: "Lexical Precision Engine", desc: "Curates discipline-specific vocabulary repositories that align with professional standards while enhancing rhetorical effectiveness—automatically selecting words that resonate subconsciously with your audience.", points: ["Context-aware synonym refinement", "Jargon appropriateness subconscious scoring", "Conciseness optimization for cognitive ease"] },
              { icon: <Target size={28} />, title: "Strategic Dialogue Architecture", desc: "Structures communication flows to achieve specific behavioral outcomes—negotiation leverage, stakeholder alignment, or conflict de-escalation—by aligning with the recipient's subconscious expectations.", points: ["Persuasion pathway subconscious modeling", "Objection anticipation intuitive frameworks", "Closure optimization for decision acceleration"] }
            ].map((item, i) => (
              <div key={i} className="glass-card rounded-2xl p-8 border border-gray-100 hover:border-mr-gold/30 transition-all fade-in-up subconscious-highlight" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-14 h-14 bg-mr-navy rounded-xl flex items-center justify-center mb-6">
                  <span className="text-mr-gold">{item.icon}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-mr-navy mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.desc}</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {item.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-2"><CheckCircle2 size={14} className="text-mr-gold mt-1 flex-shrink-0" /> {p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="glass-card rounded-2xl p-8 border border-gray-100 fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-bold text-mr-navy">Subconscious Communication Metrics</h3>
              <button className="text-sm text-mr-gold font-medium hover:underline">View Full Analytics</button>
            </div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[
                { label: "Subconscious Clarity", value: "96" },
                { label: "Trust Resonance", value: "92" },
                { label: "Persuasive Subtext", value: "89" },
                { label: "Professional Intuition", value: "98" }
              ].map((m, i) => (
                <div key={i} className="p-5 rounded-xl bg-gradient-to-br from-mr-navy/5 to-mr-accent/5">
                  <p className="text-sm text-gray-500 mb-1">{m.label}</p>
                  <p className="text-3xl font-bold text-mr-navy">{m.value}<span className="text-lg text-gray-400">/100</span></p>
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-mr-gold rounded-full" style={{ width: `${m.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {["Email Composition", "Client Correspondence", "Internal Memos", "Proposal Drafting", "Conflict Mediation", "Team Alignment"].map((tag) => (
                <span key={tag} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Professional Lexicons Toolkit */}
      <section id="professionals" className="py-20 bg-mr-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl font-serif font-bold text-mr-navy mb-4">Specialised Professional Lexicons Toolkit</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Subconscious communication frameworks for twenty+ professional categories—each with curated vocabulary, behavioral protocols, and expression standards that resonate intuitively with your audience.
              <span className="block mt-2 text-mr-gold font-medium italic">(All modified by your desires)</span>
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
            {LEXICONS.map((name, i) => (
              <div key={name} className="glass-card rounded-xl p-5 border border-gray-100 hover:border-mr-gold/40 transition-all cursor-pointer fade-in-up" style={{ animationDelay: `${(i % 5) * 0.05}s` }}>
                <h4 className="font-medium text-mr-navy text-sm text-center">{name}</h4>
              </div>
            ))}
          </div>
          <div className="glass-card rounded-2xl p-8 border border-gray-100 fade-in-up">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3">
                <div className="w-24 h-24 bg-mr-navy rounded-2xl flex items-center justify-center mb-6">
                  <Brain size={40} className="text-mr-gold" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-mr-navy mb-2">Clinical Psychologist Lexicon</h3>
                <p className="text-gray-600 mb-4">Specialised vocabulary for therapeutic correspondence, boundary-setting communications, and interdisciplinary collaboration that resonates subconsciously with clients and colleagues.</p>
                <Link href="/lexicons/clinical-psychologist" className="text-mr-gold font-medium text-sm hover:underline flex items-center gap-1">
                  Explore Full Lexicon <ArrowRight size={14} />
                </Link>
              </div>
              <div className="md:w-2/3 grid grid-cols-2 gap-4">
                {[
                  { title: "Therapeutic Register", items: ["\"I notice you're describing...\"", "\"Would you be willing to explore...\"", "\"That sounds like a significant...\""] },
                  { title: "Boundary Language", items: ["\"My professional scope includes...\"", "\"I'm available for consultation during...\"", "\"For matters outside our agreement...\""] },
                  { title: "Collaborative Framing", items: ["\"In partnership with your care team...\"", "\"Building on our previous discussion...\"", "\"Integrating your insights with...\""] },
                  { title: "Crisis Communication", items: ["\"I'm here to support you through...\"", "\"Let's prioritise immediate safety by...\"", "\"Would it help to connect you with...\""] }
                ].map((cat, i) => (
                  <div key={i} className="p-4 bg-white rounded-xl border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-2">{cat.title}</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {cat.items.map((item, j) => <li key={j}>• {item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. One-Click Micro-Tools */}
      <section id="tools" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl font-serif font-bold text-mr-navy mb-4">One-Click Micro-Tools</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ten specialised instruments for instantaneous linguistic calibration—each designed for immediate application in professional contexts with subconscious behavioral intelligence.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {MICRO_TOOLS.map((t, i) => (
              <div key={t.name} className="glass-card rounded-2xl p-6 border border-gray-100 hover:border-mr-gold/30 transition-all fade-in-up cursor-pointer hover:-translate-y-1" style={{ animationDelay: `${(i % 3) * 0.1}s` }}>
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-mr-navy to-mr-accent w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap size={20} className="text-mr-gold" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif font-bold text-mr-navy mb-1">{t.name}</h4>
                      <span className="bg-gradient-to-br from-mr-gold to-[#B8964E] text-mr-navy px-2 py-0.5 rounded-full text-xs font-bold">{t.credits} Credit{t.credits > 1 ? 's' : ''}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{t.desc}</p>
                    <Link href={`/tools/${t.name.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs font-medium text-mr-gold hover:underline flex items-center gap-1">
                      Use Now <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="glass-card rounded-2xl p-6 border border-gray-100 fade-in-up bg-gradient-to-r from-mr-navy to-mr-accent text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-serif font-bold mb-1">Expand Your Communication Intelligence</h3>
                <p className="text-mr-cream/90">Purchase credit packs for unlimited access to micro-tools and premium features.</p>
              </div>
              <div className="flex gap-3">
                <button className="bg-white text-mr-navy px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">5 Credits • $9</button>
                <button className="bg-mr-gold text-mr-navy px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-colors shadow-md">20 Credits • $29 <span className="text-xs block font-normal">Best Value</span></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Exclusive Memberships */}
      <section id="memberships" className="py-20 bg-gradient-to-b from-white to-mr-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl font-serif font-bold text-mr-navy mb-4">Exclusive Membership Tiers</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Invitation-only access to premium communication intelligence, curated professional networks, and behavioral analytics unavailable elsewhere.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { name: "Curator", price: "$49", desc: "For emerging professionals refining their communicative presence", features: ["Access to 5 professional lexicons", "3 micro-tools (Text Refiner, Email Polisher, Planning Assistant)", "Monthly subconscious behavioral insights report", "Community forum access", "50 micro-tool credits monthly"] },
              { name: "Strategist", price: "$149", desc: "For established professionals leading teams and client relationships", features: ["All 20+ professional lexicons", "Full micro-tool suite access (10 instruments)", "Advanced subconscious behavioral analytics dashboard", "Priority concierge support", "Unlimited micro-tool credits", "Quarterly strategy consultation", "Exclusive webinar series access"], highlighted: true },
              { name: "Sovereign", price: "Custom", desc: "For executive leadership and organisational transformation", features: ["Everything in Strategist, plus:", "Dedicated communication architect", "Organisation-wide lexicon customisation", "Predictive subconscious behavioral modelling", "Crisis communication protocol development", "Executive coaching integration", "Board-level reporting suite"] }
            ].map((tier, i) => (
              <div key={tier.name} className={`rounded-2xl p-8 border fade-in-up ${tier.highlighted ? 'bg-gradient-to-br from-mr-navy via-[#1a2a4a] to-mr-navy border-mr-gold relative scale-105 shadow-2xl' : 'glass-card border-gray-100'}`} style={{ animationDelay: `${i * 0.1}s` }}>
                {tier.highlighted && <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-mr-gold text-mr-navy text-xs font-bold rounded-full">MOST SELECTED</span>}
                <div className="mb-6">
                  <h3 className={`text-2xl font-serif font-bold mb-2 ${tier.highlighted ? 'text-white' : 'text-mr-navy'}`}>{tier.name}</h3>
                  <p className={tier.highlighted ? 'text-gray-300' : 'text-gray-600'}>{tier.desc}</p>
                </div>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${tier.highlighted ? 'text-white' : 'text-mr-navy'}`}>{tier.price}</span>
                  <span className={tier.highlighted ? 'text-gray-400' : 'text-gray-500'}>/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-sm">
                  {tier.features.map((f, j) => (
                    <li key={j} className={`flex items-start gap-3 ${tier.highlighted ? 'text-gray-200' : 'text-gray-600'}`}>
                      <CheckCircle2 size={16} className="text-mr-gold mt-1 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/memberships" className={`w-full py-3 rounded-xl font-medium transition-colors text-center block ${tier.highlighted ? 'bg-mr-gold hover:bg-yellow-600 text-mr-navy font-bold shadow-lg' : 'border-2 border-mr-navy text-mr-navy hover:bg-mr-navy hover:text-white'}`}>
                  {tier.name === 'Sovereign' ? 'Schedule Sovereign Consultation' : tier.name === 'Strategist' ? 'Request Strategist Invitation' : 'Apply for Curator Access'}
                </Link>
              </div>
            ))}
          </div>
          <div className="glass-card rounded-2xl p-8 border border-gray-100 fade-in-up">
            <h3 className="text-xl font-serif font-bold text-mr-navy mb-6 text-center">What Makes MindReply Memberships Exclusively Valuable</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: <Shield size={20} />, title: "Proprietary Subconscious Frameworks", desc: "Our communication intelligence models are developed through longitudinal research with executive professionals—unavailable in any other platform." },
                { icon: <Users size={20} />, title: "Curated Professional Networks", desc: "Members gain access to vetted communities of practice where communication excellence is the shared standard." },
                { icon: <BarChart3 size={20} />, title: "Predictive Impact Analytics", desc: "Anticipate how your communications will be received and adjust proactively—based on behavioral science, not guesswork." },
                { icon: <Shield size={20} />, title: "Enterprise-Grade Confidentiality", desc: "All communications are processed with end-to-end encryption and zero data retention policies—critical for legal, financial, and clinical professionals." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-mr-navy rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-mr-gold">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-mr-navy mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Business Growth */}
      <section id="growth" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-4xl font-serif font-bold text-mr-navy mb-4">Accelerate Professional Growth</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Transform subconscious communication excellence into tangible business outcomes: client retention, deal velocity, team cohesion, and reputational capital.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="fade-in-up">
              <h3 className="text-2xl font-serif font-bold text-mr-navy mb-4">The Subconscious Communication Growth Multiplier</h3>
              <p className="text-gray-600 mb-6">Organisations leveraging MindReply's behavioral intelligence report measurable improvements across key performance indicators:</p>
              <div className="space-y-4">
                {[
                  { icon: <TrendingUp size={20} />, color: "text-green-600", bg: "bg-green-100", title: "Client Retention", desc: "+34% average increase through enhanced relationship communication" },
                  { icon: <Clock size={20} />, color: "text-blue-600", bg: "bg-blue-100", title: "Deal Velocity", desc: "22% faster negotiation cycles with precision persuasion frameworks" },
                  { icon: <Users size={20} />, color: "text-purple-600", bg: "bg-purple-100", title: "Team Alignment", desc: "41% reduction in miscommunication-related project delays" },
                  { icon: <Shield size={20} />, color: "text-amber-600", bg: "bg-amber-100", title: "Risk Mitigation", desc: "67% fewer compliance incidents through proactive language screening" }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <span className={stat.color}>{stat.icon}</span>
                    </div>
                    <div>
                      <p className="font-medium text-mr-navy">{stat.title}</p>
                      <p className="text-sm text-gray-600">{stat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-b from-mr-gold/10 to-transparent rounded-2xl p-8 border border-gray-100 fade-in-up">
              <h4 className="font-serif font-bold text-mr-navy mb-6 text-center">Subconscious Communication Impact Trajectory</h4>
              <div className="h-64 flex items-end justify-around px-4 pb-4 border-b border-gray-200">
                {[
                  { month: "Month 1", h: "h-24", color: "bg-gray-200" },
                  { month: "Month 3", h: "h-36", color: "bg-gray-300" },
                  { month: "Month 6", h: "h-48", color: "bg-mr-gold/20 border-t-2 border-mr-gold" },
                  { month: "Month 12", h: "h-60", color: "bg-mr-gold" }
                ].map((bar, i) => (
                  <div key={i} className="text-center">
                    <div className={`w-16 ${bar.h} ${bar.color} rounded-t-lg mb-2 transition-all duration-1000`}></div>
                    <p className="text-xs text-gray-500">{bar.month}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600"><span className="font-bold text-mr-navy">+187%</span> average growth in communication-derived business value within first year</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-8 border border-gray-100 fade-in-up">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <h3 className="text-xl font-serif font-bold text-mr-navy mb-4">Growth Acceleration Toolkit</h3>
                <p className="text-gray-600 mb-6">Integrated instruments that connect subconscious communication excellence to business outcomes:</p>
                <ul className="space-y-3">
                  {[
                    "Client Journey Mapper: Align communication touchpoints with conversion milestones",
                    "Stakeholder Influence Matrix: Optimise messaging for key decision-makers",
                    "Feedback Integration Loop: Transform client responses into communication refinements",
                    "Reputational Capital Tracker: Quantify how communication quality enhances professional standing"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Target size={16} className="text-mr-gold mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700"><span className="font-medium">{item.split(':')[0]}:</span> {item.split(':')[1]}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/2">
                <div className="bg-mr-cream/50 rounded-xl p-6 border border-mr-gold/20">
                  <h4 className="font-serif font-bold text-mr-navy mb-4">Success Snapshot: Legal Firm</h4>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p><span className="font-medium">Challenge:</span> Client complaints about "cold" or "confusing" correspondence</p>
                    <p><span className="font-medium">Solution:</span> Implemented Lexicon Refiner + Empathy Amplifier for client communications</p>
                    <p><span className="font-medium">Result:</span> 92% client satisfaction score (+41 pts), 28% increase in referral business within 6 months</p>
                  </div>
                  <Link href="/case-studies" className="mt-6 w-full py-3 bg-mr-navy hover:bg-mr-accent text-white rounded-xl font-medium transition-colors text-sm text-center block">
                    View Case Study Library
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-mr-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-mr-gold rounded-lg flex items-center justify-center">
                  <span className="text-mr-navy font-serif font-bold text-xl">M</span>
                </div>
                <span className="font-serif font-bold text-xl">MindReply</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">Executive communication intelligence for professionals who understand that subconscious expression shapes outcomes.</p>
              <a href="mailto:info@mind-reply.com" className="text-gray-400 hover:text-mr-gold transition-colors text-sm flex items-center gap-2">
                <Mail size={14} /> info@mind-reply.com
              </a>
            </div>
            <div>
              <h4 className="font-serif font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#agent" className="hover:text-white transition-colors">MRagent</a></li>
                <li><a href="#subconscious" className="hover:text-white transition-colors">Subconscious Intelligence</a></li>
                <li><a href="#professionals" className="hover:text-white transition-colors">Professional Lexicons</a></li>
                <li><a href="#tools" className="hover:text-white transition-colors">Micro-Tools</a></li>
                <li><a href="#memberships" className="hover:text-white transition-colors">Exclusive Access</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-bold mb-4">Professionals</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Psychologists & Therapists</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Legal & Compliance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Financial Advisors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">HR & Talent Leaders</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Executive Coaches</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-bold mb-4">Access</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/signup" className="hover:text-white transition-colors">Create Account</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Member Login</Link></li>
                <li><Link href="/premium" className="hover:text-white transition-colors">Request Premium Access</Link></li>
                <li><a href="mailto:info@mind-reply.com" className="hover:text-white transition-colors">Contact: info@mind-reply.com</a></li>
                <li><Link href="/enterprise" className="hover:text-white transition-colors">Enterprise Solutions</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© 2026 MindReply. All rights reserved. Confidentiality assured.</p>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Protocol</Link>
              <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Engagement</Link>
              <Link href="/ethics" className="hover:text-gray-300 transition-colors">Ethical Framework</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// FILE: app/tools/text-refiner/page.tsx
// ============================================================================
"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wand2, Copy, Check } from "lucide-react";

export default function TextRefinerTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRefine = () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setOutput("Thank you for your message. I have reviewed your request and would like to propose a refined approach that aligns with our strategic objectives. Please let me know if this revised direction meets your expectations, and I will be happy to proceed accordingly.");
      setIsProcessing(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-mr-cream-light">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:opacity-70 transition-opacity text-mr-navy">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-mr-navy">Text Refiner</h1>
            <p className="text-sm mt-1 text-mr-slate">Instantly refine casual messages for professional contexts. (Costs 1 Credit)</p>
          </div>
          <div className="px-4 py-2 rounded-lg text-sm font-bold bg-mr-gold/20 text-mr-gold">Credits Remaining: 4</div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border rounded-xl p-6 shadow-sm border-gray-200">
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block text-mr-slate">Original Draft</label>
            <textarea 
              value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., hey, just checking in on that thing we talked about, let me know when you can chat."
              className="w-full h-64 p-4 rounded-lg border text-sm outline-none focus:ring-2 resize-none border-gray-200 text-mr-navy focus:ring-mr-gold"
            />
            <button onClick={handleRefine} disabled={isProcessing || !input.trim()} className="w-full mt-4 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 bg-mr-navy text-white">
              {isProcessing ? "Analyzing Subconscious Tone..." : <><Wand2 size={16} /> Refine Text</>}
            </button>
          </div>
          <div className="bg-white border rounded-xl p-6 shadow-sm relative border-gray-200">
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block text-mr-slate">Refined Output</label>
            <div className="w-full h-64 p-4 rounded-lg border text-sm overflow-y-auto bg-mr-cream text-mr-navy border-gray-200">
              {isProcessing ? (
                <div className="flex items-center justify-center h-full"><div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-mr-gold border-t-transparent"></div></div>
              ) : output ? output : <span className="opacity-50 italic">Refined professional text will appear here...</span>}
            </div>
            {output && !isProcessing && (
              <button onClick={copyToClipboard} className="absolute bottom-10 right-10 p-2 rounded-lg border shadow-sm hover:bg-gray-50 transition-colors bg-white border-gray-200">
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-mr-navy" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
