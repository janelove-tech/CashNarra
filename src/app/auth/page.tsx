"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui";
import s from "@/components/app.module.css";

const accountWait =
  "The account service did not respond. Nothing was changed. Try again in a moment.";

function within<T>(work: Promise<T>, ms = 12000) {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(
      () => reject(new Error(accountWait)),
      ms,
    );
    work.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timer);
        reject(error);
      },
    );
  });
}

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
      else if (
        params.get("mode") === "signup" ||
        params.get("mode") === "signin" ||
        params.get("mode") === "recover"
      )
        setMode(params.get("mode") as "signup" | "signin" | "recover");
      if (params.has("link_error"))
        setMessage(
          "This link expired or could not be verified. Request a new recovery email.",
        );
    });
  }, []);
  const verify =
    "Check your email to finish setting up. You can continue after verification.";
  const aside =
    mode === "signup"
      ? {
          kicker: "Before anything is saved",
          title: "You check every record.",
          body: "Business and personal money stay in separate workspaces. CashNarra does not move money.",
        }
      : mode === "recover"
        ? {
            kicker: "Account recovery",
            title: "A link goes out only if this address has an account.",
            body: "If it does not, nothing is sent, and the page does not say whether the address exists.",
          }
        : mode === "update"
          ? {
              kicker: "New password",
              title: "At least 8 characters.",
              body: "Then your records open again.",
            }
          : {
              kicker: "Welcome back",
              title: "Your records are still here.",
              body: "The example on the introduction is fictional. It is not part of your records.",
            };
  return (
    <main className={s.landing}>
      <Link href="/">
        <img
          className={s.logo}
          src="/brand/cashnarra-logo.svg"
          alt="CashNarra"
        />
      </Link>
      <div className={s.authLayout}>
        <div className={s.authCard}>
        <h1>
          {mode === "signup"
            ? "Start your money records."
            : mode === "recover"
              ? "Recover your account."
              : mode === "update"
                ? "Choose a new password."
                : "Sign in."}
        </h1>
        <p className={s.authIntro}>
          {mode === "signup"
            ? "Use an email you can access. You'll review every money record before it's saved."
            : mode === "recover"
              ? "The email on your account."
              : mode === "update"
                ? "At least 8 characters."
                : "Sign in to continue your money records."}
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
                const { error } = await within(
                  db.auth.resetPasswordForEmail(address, {
                    redirectTo: location.origin + "/auth/confirm?recovery=1",
                  }),
                );
                if (error) throw error;
                setMessage(
                  "If this address has an account, recovery instructions will arrive by email.",
                );
              } else if (mode === "update") {
                const { error } = await within(
                  db.auth.updateUser({ password }),
                );
                if (error) throw error;
                setMessage("Password updated. You can open your records.");
              } else {
                const result = await within(
                  mode === "signup"
                    ? db.auth.signUp({
                        email: address,
                        password,
                        options: {
                          emailRedirectTo: location.origin + "/auth/confirm",
                        },
                      })
                    : db.auth.signInWithPassword({
                        email: address,
                        password,
                      }),
                );
                if (result.error) throw result.error;
                if (result.data.session) {
                  await within(
                    fetch("/api/logout", { method: "POST" }),
                    4000,
                  ).catch(() => undefined);
                  location.href = "/app";
                } else setMessage(verify);
              }
            } catch (x) {
              const detail = (x as Error).message;
              setMessage(
                mode === "signup"
                  ? `We couldn't create your account. ${detail}`
                  : detail,
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <div className={s.authFields}>
          {mode !== "update" && (
            <div>
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
            </div>
          )}
          {mode !== "recover" && (
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type={reveal ? "text" : "password"}
                minLength={8}
                aria-describedby={
                  mode === "signin" ? undefined : "password-hint"
                }
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                required
              />
              {mode !== "signin" && (
                <p id="password-hint" className={s.authHint}>
                  At least 8 characters. You can paste a password.
                </p>
              )}
              <div className={s.authActions}>
                <button
                  className={s.authReveal}
                  type="button"
                  aria-pressed={reveal}
                  onClick={() => setReveal((value) => !value)}
                >
                  {reveal ? "Hide password" : "Show password"}
                </button>
                {mode === "signin" && (
                  <button
                    className={s.authReveal}
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setMode("recover");
                      setMessage("");
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
          </div>
          )}
          </div>
          {mode === "signup" && (
            <label className={s.checkLabel}>
              <input type="checkbox" required /> I have read the{" "}
              <Link href="/privacy">processing notice.</Link>
            </label>
          )}
          <div className={s.actions}>
            <Button primary type="submit" disabled={busy}>
              {busy
                ? mode === "signup"
                  ? "Creating your account…"
                  : "Please wait…"
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
        <p role="status" className={message ? s.notice : s.authQuiet}>
          {message}
        </p>
        {message === verify && (
          <Button
            disabled={busy || !canResend}
            onClick={async () => {
              setBusy(true);
              setCanResend(false);
              window.setTimeout(() => setCanResend(true), 30000);
              try {
                const { error } = await within(
                  supabase().auth.resend({
                    type: "signup",
                    email,
                    options: {
                      emailRedirectTo: location.origin + "/auth/confirm",
                    },
                  }),
                );
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
        <div className={s.authLinks}>
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
          <Link href="/">Back to CashNarra</Link>
          {mode === "signin" && <Link href="/app">Open records</Link>}
        </div>
        </div>
        <aside className={s.authAside}>
          <p className={s.kicker}>{aside.kicker}</p>
          <h2>{aside.title}</h2>
          <p>{aside.body}</p>
        </aside>
      </div>
    </main>
  );
}
