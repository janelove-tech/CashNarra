"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui";
import s from "@/components/app.module.css";
export default function Auth() {
  const [mode, setMode] = useState("signin"),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    Promise.resolve().then(() => {
      if (params.get("recovery") === "1") setMode("update");
      if (params.has("link_error"))
        setMessage(
          "This link expired or could not be verified. Request a new recovery email.",
        );
    });
  }, []);
  return (
    <main className={s.landing}>
      <Link href="/">
        <img
          className={s.logo}
          src="/brand/cashnarra-lockup.svg"
          alt="CashNarra"
        />
      </Link>
      <div className={s.flow} style={{ maxWidth: 460, paddingTop: 60 }}>
        <h1>Make room for clarity.</h1>
        <p>
          Your story belongs to you. Sign in to keep your personal and business
          records separate.
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            setBusy(true);
            setMessage("");
            try {
              const db = supabase(),
                email = String(f.get("email")),
                password = String(f.get("password"));
              if (mode === "recover") {
                const { error } = await db.auth.resetPasswordForEmail(email, {
                  redirectTo: location.origin + "/auth/confirm?recovery=1",
                });
                if (error) throw error;
                setMessage(
                  "If this address has an account, recovery instructions will arrive by email.",
                );
              } else if (mode === "update") {
                const { error } = await db.auth.updateUser({ password });
                if (error) throw error;
                setMessage("Password updated. You can open your records.");
              } else {
                const result =
                  mode === "signup"
                    ? await db.auth.signUp({
                        email,
                        password,
                        options: {
                          emailRedirectTo: location.origin + "/auth/confirm",
                        },
                      })
                    : await db.auth.signInWithPassword({ email, password });
                if (result.error) throw result.error;
                if (result.data.session) {
                  await fetch("/api/logout", { method: "POST" });
                  location.href = "/app";
                } else setMessage("Check your email to confirm your account.");
              }
            } catch (x) {
              setMessage((x as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {mode !== "update" && (
            <>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </>
          )}
          {mode !== "recover" && (
            <>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                minLength={8}
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                required
              />
            </>
          )}
          {mode === "signup" && (
            <label className={s.checkLabel}>
              <input type="checkbox" required />I have read the{" "}
              <Link href="/privacy">processing notice</Link>.
            </label>
          )}
          <div className={s.actions}>
            <Button primary type="submit" disabled={busy}>
              {busy
                ? "Please wait…"
                : mode === "signup"
                  ? "Create account"
                  : mode === "recover"
                    ? "Send recovery email"
                    : mode === "update"
                      ? "Set new password"
                      : "Sign in"}
            </Button>
          </div>
        </form>
        <p role="status" className={s.notice}>
          {message ||
            "Your records are private. Use account recovery if you cannot sign in."}
        </p>
        <div className={s.actions}>
          {[
            ["signin", "Sign in"],
            ["signup", "Create account"],
            ["recover", "Forgot password?"],
          ].map(([id, label]) => (
            <Button
              key={id}
              disabled={busy}
              onClick={() => {
                setMode(id);
                setMessage("");
              }}
            >
              {label}
            </Button>
          ))}
          <Link href="/app">Open records</Link>
        </div>
      </div>
    </main>
  );
}
