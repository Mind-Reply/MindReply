import { AuthNotConfigured, AuthShell } from "@/components/AuthShell";
import ForgotPasswordClient from "./ForgotPasswordClient";

export default function ForgotPasswordPage() {
  return (
    <AuthShell subtitle="Recover secure access to your MindReply workspace">
      {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
        <ForgotPasswordClient />
      ) : (
        <AuthNotConfigured label="Password Reset Unavailable" />
      )}
    </AuthShell>
  );
}
