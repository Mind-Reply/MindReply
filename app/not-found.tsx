import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0f1412] px-5 text-[#f4efe4]">
      <section className="max-w-md rounded-lg border border-[#403b31] bg-[#171d1a] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b99758]">404</p>
        <h1 className="mt-3 text-3xl font-semibold">Signal not found.</h1>
        <p className="mt-4 leading-7 text-[#c9c1b0]">
          This path is outside the current decision surface.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-md bg-[#b99758] px-5 text-sm font-semibold text-[#101512]"
        >
          Return to MindReply
        </Link>
      </section>
    </main>
  );
}
