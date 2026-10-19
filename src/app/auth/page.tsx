"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui";
import s from "@/components/app.module.css";
export default function Auth() {
  const [mode, setMode] = useState("signin"),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [email, setEmail] = useState(""),
    [reveal, setReveal] = useState(false),
    [canResend, setCanResend] = useState(true);
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
        <h1>
          {mode === "signup"
            ? "Create your account."
            : mode === "recover"
              ? "Recover your account."
              : mode === "update"
                ? "Choose a new password."
                : "Sign in."}
        </h1>
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
                address = email || String(f.get("email")),
                password = String(f.get("password") ?? "");
              if (mode === "recover") {
                const { error } = await db.auth.resetPasswordForEmail(address, {
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
                        email: address,
                        password,
                        options: {
                          emailRedirectTo: location.origin + "/auth/confirm",
                        },
                      })
                    : await db.auth.signInWithPassword({
                        email: address,
                        password,
                      });
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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
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
                type={reveal ? "text" : "password"}
                minLength={8}
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                required
              />
              <Button type="button" onClick={() => setReveal((value) => !value)}>
                {reveal ? "Hide password" : "Show password"}
              </Button>
              {mode !== "signin" && (
                <p>Use at least 8 characters.</p>
              )}
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
        {message === "Check your email to confirm your account." && (
          <Button
            disabled={busy || !canResend}
            onClick={async () => {
              setBusy(true);
              setCanResend(false);
              window.setTimeout(() => setCanResend(true), 30000);
              try {
                const { error } = await supabase().auth.resend({
                  type: "signup",
                  email,
                  options: {
                    emailRedirectTo: location.origin + "/auth/confirm",
                  },
                });
                if (error) throw error;
                setMessage(
                  "If a confirmation email can be sent, another one is on the way. Check your inbox.",
                );
              } catch (x) {
                setMessage((x as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            Send the confirmation email again
          </Button>
        )}
        <div className={s.actions}>
          {mode !== "signin" && (
            <Button
              disabled={busy}
              onClick={() => {
                setMode("signin");
                setMessage("");
              }}
            >
              Already have an account? Sign in.
            </Button>
          )}
          {mode !== "signup" && mode !== "update" && (
            <Button
              disabled={busy}
              onClick={() => {
                setMode("signup");
                setMessage("");
              }}
            >
              Create account
            </Button>
          )}
          {mode !== "recover" && (
            <Button
              disabled={busy}
              onClick={() => {
                setMode("recover");
                setMessage("");
              }}
            >
              Forgot password?
            </Button>
          )}
          <Link href="/app">Open records</Link>
        </div>
      </div>
    </main>
  );
}
