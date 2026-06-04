"use client";

import Link from "next/link";
import { Show, SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function DashboardSignOut() {
  const className = "flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border hover:bg-red-50 transition-colors";
  const style = { borderColor: "hsl(40 25% 88%)", color: "#ef4444" };

  if (!clerkEnabled) {
    return (
      <Link href="/sign-in" className={className} style={style}>
        <LogOut size={16} /> Sign Out
      </Link>
    );
  }

  return (
    <>
      <Show when="signed-in">
        <SignOutButton redirectUrl="/sign-in">
          <button type="button" className={className} style={style}>
            <LogOut size={16} /> Sign Out
          </button>
        </SignOutButton>
      </Show>
      <Show when="signed-out">
        <Link href="/sign-in" className={className} style={style}>
          <LogOut size={16} /> Sign In
        </Link>
      </Show>
    </>
  );
}
