import { SignIn } from "@clerk/nextjs";
import { AuthNotConfigured, AuthShell, clerkAppearance } from "@/components/AuthShell";

export default function SignInPage() {
  return (
    <AuthShell subtitle="Enter your communication intelligence workspace">
      {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
        <SignIn appearance={clerkAppearance} fallbackRedirectUrl="/dashboard" signUpUrl="/sign-up" />
      ) : (
        <AuthNotConfigured label="Sign In Unavailable" />
      )}
    </AuthShell>
  );
}
