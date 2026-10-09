import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell, PageHeading, fieldStyles } from "@/components/site-shell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — FieldLink TZ" },
      { name: "description", content: "Sign in or create a FieldLink TZ account with email or Google." },
      { property: "og:title", content: "Sign in — FieldLink TZ" },
      { property: "og:description", content: "Access your FieldLink TZ account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      setMsg(error ? error.message : "Check your email to confirm your account, then sign in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
      else navigate({ to: "/" });
    }
    setBusy(false);
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res?.error) setMsg(String(res.error.message ?? res.error));
  }

  if (user) {
    return (
      <SiteShell>
        <PageHeading eyebrow="Account" title="You are signed in" intro={user.email ?? ""} />
        <section className="py-10">
          <button
            className={fieldStyles.submit}
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/" });
            }}
          >
            Sign out
          </button>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <PageHeading
        eyebrow="Account"
        title={mode === "signin" ? "Sign in" : "Create an account"}
        intro="Use your email or Google account."
      />
      <section className="py-10">
        <div className={`${fieldStyles.panel} max-w-sm`}>
          <button
            type="button"
            onClick={google}
            className="w-full rounded-full border border-line bg-paper px-5 py-3 text-sm font-semibold transition-colors hover:border-brand"
          >
            Continue with Google
          </button>
          <p className="my-4 text-center text-xs text-ink-soft">or</p>
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className={fieldStyles.label}>Email</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={fieldStyles.input} />
            </label>
            <label className="block">
              <span className={fieldStyles.label}>Password</span>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className={fieldStyles.input} />
            </label>
            {msg ? <p className="text-sm text-ink-soft">{msg}</p> : null}
            <button type="submit" disabled={busy} className={`${fieldStyles.submit} w-full justify-center`}>
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 text-sm text-brand"
          >
            {mode === "signin" ? "No account? Create one" : "Have an account? Sign in"}
          </button>
        </div>
      </section>
    </SiteShell>
  );
}
