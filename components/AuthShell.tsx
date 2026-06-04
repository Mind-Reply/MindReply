import Link from "next/link";

const clerkAppearance = {
  variables: {
    colorBackground: "hsl(220 45% 13%)",
    colorText: "hsl(43 70% 88%)",
    colorPrimary: "hsl(43 80% 60%)",
    colorInputBackground: "hsl(220 55% 20%)",
    colorInputText: "hsl(43 70% 88%)",
    colorNeutral: "hsl(220 25% 70%)",
    borderRadius: "12px",
  },
  elements: {
    cardBox: "shadow-2xl",
    card: "border border-[rgba(201,169,97,0.22)]",
    headerTitle: "font-serif",
    formButtonPrimary: "font-semibold",
  },
};

export { clerkAppearance };

export function AuthLogo({ subtitle }: { subtitle: string }) {
  return (
    <div className="text-center">
      <Link
        href="/"
        className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-lg shadow-sm"
        style={{ background: "linear-gradient(135deg, hsl(43 80% 60%), hsl(43 45% 44%))", color: "hsl(220 45% 13%)" }}
      >
        <span className="font-serif text-xl font-bold">M</span>
      </Link>
      <p className="font-serif text-2xl font-semibold" style={{ color: "hsl(43 70% 88%)" }}>MindReply</p>
      <p className="mt-1 text-xs" style={{ color: "rgba(248,245,240,0.65)" }}>{subtitle}</p>
    </div>
  );
}

export function AuthShell({ children, subtitle }: { children: React.ReactNode; subtitle: string }) {
  return (
    <main className="min-h-screen px-4 py-28 flex items-center justify-center" style={{ background: "hsl(220 55% 20%)" }}>
      <section className="flex w-full max-w-md flex-col items-center gap-8">
        <AuthLogo subtitle={subtitle} />
        {children}
      </section>
    </main>
  );
}

export function AuthNotConfigured({ label }: { label: string }) {
  return (
    <div className="w-full rounded-2xl border bg-white p-8 text-center shadow-2xl" style={{ borderColor: "rgba(201,169,97,0.22)" }}>
      <h1 className="font-serif text-2xl font-bold mb-3" style={{ color: "hsl(220 45% 13%)" }}>{label}</h1>
      <p className="text-sm leading-relaxed mb-6" style={{ color: "hsl(220 25% 45%)" }}>
        Authentication is not configured yet. Add Clerk publishable and secret keys to enable secure MindReply account access.
      </p>
      <Link href="/" className="inline-flex rounded-lg px-5 py-3 text-sm font-semibold hover:opacity-90" style={{ background: "hsl(220 55% 20%)", color: "hsl(43 70% 88%)" }}>
        Back to Home
      </Link>
    </div>
  );
}
