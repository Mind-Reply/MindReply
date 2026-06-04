"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen pt-28 pb-16 px-4 flex items-center justify-center" style={{ background: "hsl(220 55% 20%)" }}>
      <div className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-bold mb-2" style={{ color: "hsl(220 45% 13%)" }}>Create Your MindReply Account</h1>
          <p className="text-sm" style={{ color: "hsl(220 25% 45%)" }}>Start with the Strategist workspace and communication tools.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); router.push("/dashboard"); }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-1 block" style={{ color: "hsl(220 25% 45%)" }}>First Name</label>
              <input required className="w-full px-4 py-3 rounded-lg border text-sm outline-none focus:ring-2" style={{ borderColor: "hsl(40 25% 88%)", color: "hsl(220 45% 13%)" }} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-1 block" style={{ color: "hsl(220 25% 45%)" }}>Last Name</label>
              <input required className="w-full px-4 py-3 rounded-lg border text-sm outline-none focus:ring-2" style={{ borderColor: "hsl(40 25% 88%)", color: "hsl(220 45% 13%)" }} />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider mb-1 block" style={{ color: "hsl(220 25% 45%)" }}>Email Address</label>
            <input type="email" required className="w-full px-4 py-3 rounded-lg border text-sm outline-none focus:ring-2" style={{ borderColor: "hsl(40 25% 88%)", color: "hsl(220 45% 13%)" }} placeholder="you@organisation.com" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider mb-1 block" style={{ color: "hsl(220 25% 45%)" }}>Password</label>
            <input type="password" required minLength={8} className="w-full px-4 py-3 rounded-lg border text-sm outline-none focus:ring-2" style={{ borderColor: "hsl(40 25% 88%)", color: "hsl(220 45% 13%)" }} />
          </div>
          <button type="submit" className="w-full py-3.5 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90" style={{ background: "hsl(220 55% 20%)", color: "hsl(43 70% 88%)" }}>
            Create Account
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: "hsl(220 25% 45%)" }}>
          Already have an account? <Link href="/login" className="font-semibold hover:underline" style={{ color: "hsl(43 80% 45%)" }}>Sign in</Link>
        </p>
      </div>
    </main>
  );
}
