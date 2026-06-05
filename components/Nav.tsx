"use client";
import { useState } from "react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";

const LANGS = ["EN", "FR", "DE", "ES", "BG", "IT", "PT"];
const LINKS = [
  { href: "/professionals", label: "Professionals" },
  { href: "/tools", label: "Tools" },
  { href: "/memberships", label: "Membership" },
  { href: "/lexicons", label: "Lexicons" },
  { href: "/analytics", label: "Intelligence" },
];
const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("EN");

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[rgba(248,245,240,0.18)] bg-[rgba(13,28,54,0.88)] shadow-[0_12px_40px_rgba(8,18,35,0.22)] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(13,28,54,0.78)]">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-3 md:h-[68px]">
          <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="MindReply home">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm" style={{ background: "hsl(220 45% 13%)" }}>
              <span className="font-serif text-lg font-bold" style={{ color: "hsl(43 80% 60%)" }}>M</span>
            </div>
            <div className="min-w-0">
              <span className="block truncate font-serif text-base font-bold leading-tight text-[hsl(43_70%_88%)] sm:text-lg">MindReply</span>
              <p className="hidden truncate text-[10px] leading-none text-[rgba(248,245,240,0.55)] sm:block">Behavioral Intelligence</p>
            </div>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex lg:gap-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-md px-2.5 py-2 text-sm font-medium transition-colors lg:px-3 ${
                  pathname === l.href ? "bg-white/10 text-[hsl(43_80%_60%)]" : "text-[rgba(248,245,240,0.68)] hover:bg-white/5 hover:text-[hsl(43_70%_88%)]"
                } ${l.href === "/analytics" ? "hidden xl:inline-flex" : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <label className="relative hidden lg:block">
              <span className="sr-only">Language</span>
              <select value={lang} onChange={(e) => setLang(e.target.value)} className="h-9 appearance-none rounded-lg border border-white/20 bg-transparent pl-3 pr-8 text-xs font-semibold text-[rgba(248,245,240,0.7)] outline-none transition focus:border-[hsl(43_80%_60%)]">
              {LANGS.map((l) => <option key={l}>{l}</option>)}
            </select>
              <ChevronDown aria-hidden="true" size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[rgba(248,245,240,0.55)]" />
            </label>
            {clerkEnabled ? (
              <>
                <Show when="signed-in">
                  <Link href="/bookings" prefetch={false} className="hidden rounded-md px-3 py-2 text-sm font-medium text-[rgba(248,245,240,0.68)] transition-colors hover:bg-white/5 hover:text-[hsl(43_70%_88%)] lg:inline-flex">My Bookings</Link>
                  <UserButton />
                </Show>
                <Show when="signed-out">
                  <SignInButton mode="redirect">
                    <button type="button" className="hidden rounded-md px-3 py-2 text-sm font-medium text-[rgba(248,245,240,0.68)] transition-colors hover:bg-white/5 hover:text-[hsl(43_70%_88%)] lg:inline-flex">Member Login</button>
                  </SignInButton>
                  <SignUpButton mode="redirect">
                    <button type="button" className="hidden rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 xl:inline-flex" style={{ background: "hsl(43 80% 60%)", color: "hsl(220 45% 13%)" }}>Create Account</button>
                  </SignUpButton>
                </Show>
              </>
            ) : (
              <>
                <Link href="/bookings" className="hidden rounded-md px-3 py-2 text-sm font-medium text-[rgba(248,245,240,0.68)] transition-colors hover:bg-white/5 hover:text-[hsl(43_70%_88%)] lg:inline-flex">My Bookings</Link>
                <Link href="/login" className="hidden rounded-md px-3 py-2 text-sm font-medium text-[rgba(248,245,240,0.68)] transition-colors hover:bg-white/5 hover:text-[hsl(43_70%_88%)] lg:inline-flex">Member Login</Link>
              </>
            )}
            <Link href="/professionals" className="rounded-lg px-3.5 py-2 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90 lg:px-4" style={{ background: "hsl(43 80% 60%)", color: "hsl(220 45% 13%)" }}>
              Book a Session
            </Link>
          </div>

          <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-[hsl(43_70%_88%)] md:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-white/15 bg-[hsl(220_55%_20%)] px-4 py-4 shadow-2xl md:hidden">
          <div className="grid gap-1">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg px-3 py-3 text-sm font-medium text-[rgba(248,245,240,0.78)] hover:bg-white/5" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Link href="/bookings" prefetch={false} className="rounded-lg px-3 py-3 text-sm font-medium text-[rgba(248,245,240,0.78)] hover:bg-white/5" onClick={() => setOpen(false)}>My Bookings</Link>
          <Link href="/login" className="rounded-lg px-3 py-3 text-sm font-medium text-[rgba(248,245,240,0.78)] hover:bg-white/5" onClick={() => setOpen(false)}>Member Login</Link>
          <Link href="/sign-up" className="rounded-lg px-3 py-3 text-sm font-medium text-[rgba(248,245,240,0.78)] hover:bg-white/5" onClick={() => setOpen(false)}>Create Account</Link>
          </div>
          <Link href="/professionals" className="mt-4 block rounded-lg px-4 py-3 text-center text-sm font-semibold" style={{ background: "hsl(43 80% 60%)", color: "hsl(220 45% 13%)" }} onClick={() => setOpen(false)}>
            Book a Session
          </Link>
        </div>
      )}
    </nav>
  );
}
