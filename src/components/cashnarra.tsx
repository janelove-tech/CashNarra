"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  House,
  NotebookText,
  BookOpen,
  Target,
  Landmark,
  Settings,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Plus,
  ArrowRight,
  ChevronDown,
  Mic,
} from "lucide-react";
import { Button, Amount, Dialog, RecordRow } from "./ui";
import RecordForm from "./record-form";
import MoveForm from "./move-form";
import VoiceCapture from "./voice-capture";
import PeriodExplanation from "./period-explanation";
import ReportTrace from "./report-trace";
import WorkspaceTools from "./workspace-tools";
import DraftBackup from "./draft-backup";
import { draftBackup } from "@/lib/draft-backup";
import { debtDate } from "@/domain/planning";
import { calendarDate } from "@/domain/dates";
import { event, sample, unclearSample } from "@/domain/fixture";
import {
  accountBalance,
  applyBatch,
  duplicates,
  labels,
  obligations,
  report,
} from "@/domain/ledger";
import { D, sum } from "@/domain/money";
import { forecast } from "@/domain/goals";
import type { EventInput, RecordEvent, Workspace } from "@/domain/types";
import type { Extraction } from "@/server/ai";
import { clearDrafts, draftStorage, type Draft } from "@/lib/drafts";
import { supabase } from "@/lib/supabase";
import s from "./app.module.css";
const nav = [
  { id: "today", label: "Today", Icon: House },
  { id: "records", label: "Records", Icon: NotebookText },
  { id: "stories", label: "Money Stories", Icon: BookOpen },
  { id: "plan", label: "Plan", Icon: Target },
];
type Operation = {
  action: string;
  workspaceId: string;
  expectedVersion: number;
  key: string;
  [key: string]: unknown;
};
export default function CashNarra() {
  const [spaces, setSpaces] = useState<Workspace[]>([]),
    [wid, setWid] = useState(""),
    [owner, setOwner] = useState(""),
    [demo, setDemo] = useState(false),
    [ai, setAi] = useState(false),
    [voice, setVoice] = useState(false),
    [page, setPage] = useState("today"),
    [loaded, setLoaded] = useState(false),
    [error, setError] = useState(""),
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false),
    [hidden, setHidden] = useState(false),
    [theme, setTheme] = useState("light"),
    [modal, setModal] = useState(""),
    [date, setDate] = useState(new Date().toISOString().slice(0, 10)),
    [period, setPeriod] = useState("day"),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all"),
    [text, setText] = useState(""),
    [events, setEvents] = useState<EventInput[]>([]),
    [questions, setQuestions] = useState<Extraction["questions"]>([]),
    [replaceIds, setReplaceIds] = useState<string[]>([]),
    [reason, setReason] = useState("Entered incorrectly"),
    [revision, setRevision] = useState(0),
    [editing, setEditing] = useState<EventInput | null>(null),
    [selected, setSelected] = useState<RecordEvent | null>(null),
    [persistent, setPersistent] = useState(false),
    [allowDuplicates, setAllowDuplicates] = useState(false),
    [pending, setPending] = useState<Operation | null>(null),
    [goalId, setGoalId] = useState(""),
    [scenario, setScenario] = useState("600.00"),
    [accountId, setAccountId] = useState(""),
    [recordPeriod, setRecordPeriod] = useState(false),
    [retryOperation, setRetryOperation] = useState<Operation | null>(null);
  const revisionRef = useRef(0),
    draftReady = useRef(false),
    heading = useRef<HTMLHeadingElement>(null);
  const w = spaces.find((w) => w.id === wid);
  const goal = w?.goals.find((g) => g.id === goalId);
  async function refresh() {
    const res = await fetch("/api/workspaces", { cache: "no-store" }),
      data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setSpaces(data.workspaces);
    setOwner(data.userId);
    setDemo(data.demo);
    setAi(data.aiEnabled);
    setVoice(data.voiceEnabled);
    setWid((current) =>
      data.workspaces.some((x: Workspace) => x.id === current)
        ? current
        : (data.workspaces[0]?.id ?? ""),
    );
    return data;
  }
  useEffect(() => {
    Promise.resolve()
      .then(refresh)
      .then((data) => {
        if (data.demo) setDate("2026-10-13");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoaded(true));
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  useEffect(() => {
    const channel = new BroadcastChannel("cashnarra-session");
    channel.onmessage = () => {
      revisionRef.current++;
      setRevision(revisionRef.current);
      setSelected(null);
      setModal("");
      setQuestions([]);
      setReplaceIds([]);
      setStatus("Signed out in another tab.");
      setSpaces([]);
      setOwner("");
      setText("");
      setEvents([]);
      setPending(null);
      setRetryOperation(null);
    };
    return () => channel.close();
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    heading.current?.focus();
  }, [page]);

  useEffect(() => {
    if (!owner || !wid) return;
    let cancelled = false;
    draftReady.current = false;
    draftStorage("get", owner, wid)
      .then((d) => {
        if (cancelled) return;
        if (d) {
          setText(d.text);
          setEvents(d.events);
          setReplaceIds(d.replaceIds);
          setReason(d.reason);
          if (calendarDate(d.date)) setDate(d.date);
          setRevision(d.revision);
          revisionRef.current = d.revision;
          const restored = d.pendingRequest as Operation | undefined;
          setPending(restored?.action === "batch" ? restored : null);
          setRetryOperation(
            restored && restored.action !== "batch" ? restored : null,
          );
          setPersistent(true);
          setStatus("Recovered draft on this device. Review it before saving.");
        }
        draftReady.current = true;
      })
      .catch((e) => {
        draftReady.current = true;
        setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [owner, wid]);
  useEffect(() => {
    if (!persistent || !owner || !wid || !draftReady.current) return;
    const draft: Draft = {
      ownerId: owner,
      workspaceId: wid,
      text,
      date,
      revision,
      events,
      replaceIds,
      reason,
      pendingRequest: pending ?? retryOperation ?? undefined,
    };
    const timer = setTimeout(() => {
      draftStorage("put", owner, wid, draft)
        .then(() => {
          if (text && !busy && !pending) setStatus("Draft on this device");
        })
        .catch((e) => setError(e.message));
    }, 300);
    return () => clearTimeout(timer);
  }, [
    persistent,
    owner,
    wid,
    text,
    date,
    revision,
    events,
    replaceIds,
    reason,
    pending,
    retryOperation,
    busy,
  ]);
  useEffect(() => {
    const before = (e: BeforeUnloadEvent) => {
      if (text || events.length || pending || retryOperation) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", before);
    return () => window.removeEventListener("beforeunload", before);
  }, [text, events, pending, retryOperation]);
  function changeDraft(nextText?: string) {
    if (pending) {
      setError("Check the pending save before changing this draft.");
      return;
    }
    revisionRef.current++;
    setRevision(revisionRef.current);
    setPending(null);
    setAllowDuplicates(false);
    if (nextText !== undefined) {
      setText(nextText);
      setEvents([]);
      setQuestions([]);
    }
    setStatus(
      persistent
        ? "Draft pending device storage"
        : "Draft in this tab · not saved",
    );
  }
  function navigate(id: string) {
    setPage(id);
    setModal("");
    setError("");
  }
  async function perform(operation: Operation) {
    if (retryOperation && retryOperation.key !== operation.key)
      throw new Error(
        "Resolve the unconfirmed action before making another change.",
      );
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/workspaces", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(operation),
        }),
        data = await res.json();
      if (!res.ok) {
        const failure = new Error(data.error) as Error & { rejected?: boolean };
        failure.rejected = data.outcome === "rejected";
        throw failure;
      }
      await refresh();
      setRetryOperation(null);
      setStatus("Saved. Your records have been updated.");
      return data.receipt;
    } catch (e) {
      if (!(e as Error & { rejected?: boolean }).rejected)
        setRetryOperation(operation);
      else setRetryOperation(null);
      setError((e as Error).message);
      throw e;
    } finally {
      setBusy(false);
    }
  }
  async function simple(action: string, data: Record<string, unknown>) {
    if (!w) return;
    try {
      await perform({
        action,
        workspaceId: w.id,
        expectedVersion: w.version,
        key: crypto.randomUUID(),
        ...data,
      });
      setModal("");
    } catch {}
  }
  async function understand() {
    if (!w || pending) return;
    const rev = revisionRef.current;
    setBusy(true);
    setError("");
    setStatus("Waiting for processing");
    try {
      const res = await fetch("/api/understand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: w.id,
          text,
          date,
          replaceIds,
          mode: replaceIds.length ? "correction" : "extract",
        }),
      });
      const data = await res.json();
      if (rev !== revisionRef.current) {
        return;
      }
      if (!res.ok) throw new Error(data.error);
      setEvents(data.events);
      setQuestions(data.questions);
      setStatus(
        data.questions.length
          ? "Needs clarification"
          : "Understood · Ready to review",
      );
      setPage("review");
    } catch (e) {
      if (rev !== revisionRef.current) return;
      setError((e as Error).message);
      setStatus(
        navigator.onLine
          ? "Processing failed. Your draft is still here."
          : "Waiting for a connection. Your draft is still here.",
      );
    } finally {
      setBusy(false);
    }
  }
  function downloadCompleteDraft() {
    const value = {
      ownerId: owner,
      workspaceId: wid,
      text,
      date,
      revision,
      events,
      replaceIds,
      reason,
      pendingRequest: pending ?? retryOperation ?? undefined,
    };
    const url = URL.createObjectURL(
      new Blob([draftBackup(value)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "CashNarra-private-draft.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function saved() {
    setRetryOperation(null);
    setText("");
    setEvents([]);
    setReplaceIds([]);
    setQuestions([]);
    setPending(null);
    setAllowDuplicates(false);
    await draftStorage("delete", owner, wid).catch((e) => setError(e.message));
    setStatus("Saved · records confirmed");
    setPage("stories");
  }
  async function saveBatch() {
    if (!w || busy) return;
    setError("");
    let op = pending;
    if (!op) {
      op = {
        action: "batch",
        workspaceId: w.id,
        expectedVersion: w.version,
        key: crypto.randomUUID() + ":" + revision,
        batch: {
          requestId: "review",
          revision,
          expectedVersion: w.version,
          source: text || "Manually reviewed record",
          events,
          replaceIds,
          reason,
          allowDuplicates,
        },
      };
      try {
        applyBatch(w, op.batch as Parameters<typeof applyBatch>[1]);
      } catch (e) {
        setError((e as Error).message);
        return;
      }
      setPending(op);
      if (persistent)
        try {
          await draftStorage("put", owner, wid, {
            ownerId: owner,
            workspaceId: wid,
            text,
            date,
            revision,
            events,
            replaceIds,
            reason,
            pendingRequest: op,
          });
        } catch (e) {
          setError((e as Error).message);
          return;
        }
    }
    setStatus("Saving");
    try {
      await perform(op);
      await saved();
    } catch (e) {
      if ((e as Error & { rejected?: boolean }).rejected) {
        setPending(null);
        await refresh().catch(() => {});
        setStatus(
          "Save rejected. Your edits remain here; review them against the refreshed records.",
        );
      } else
        setStatus(
          "Save not confirmed. Check the original request before retrying.",
        );
    }
  }
  async function recover() {
    if (!pending) return;
    setBusy(true);
    try {
      const res = await fetch(
        `/api/workspaces?workspace=${encodeURIComponent(pending.workspaceId)}&request=${encodeURIComponent(pending.key)}`,
        { cache: "no-store" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.receipt) {
        await refresh();
        await saved();
      } else {
        setStatus(
          "No receipt found. Retry will use the same reviewed request.",
        );
        await perform(pending);
        await saved();
      }
    } catch (e) {
      setError((e as Error).message);
      if ((e as Error & { rejected?: boolean }).rejected) {
        setPending(null);
        await refresh().catch(() => {});
        setStatus("Save rejected. Your edits remain available for review.");
      }
    } finally {
      setBusy(false);
    }
  }
  function manual(initial?: EventInput) {
    if (pending) {
      setError("Resolve the pending save before editing this batch.");
      return;
    }
    setEditing(
      initial ?? event("expense", "", "", w?.accounts[0]?.id ?? null, { date }),
    );
    setModal("record");
  }
  function beginCorrection(r: RecordEvent) {
    setReplaceIds([r.id]);
    setEvents([{ ...r, id: crypto.randomUUID() }]);
    setText(
      `Correction to ${r.description}. Original words: ${w?.sources.find((s) => s.id === r.sourceId)?.text ?? "text removed under retention setting"}`,
    );
    setQuestions([]);
    changeDraft();
    setPage("review");
    setModal("");
  }
  const from =
    period === "month"
      ? date.slice(0, 7) + "-01"
      : period === "week"
        ? new Date(
            new Date(date + "T12:00:00Z").getTime() -
              ((new Date(date + "T12:00:00Z").getUTCDay() + 6) % 7) * 86400000,
          )
            .toISOString()
            .slice(0, 10)
        : date;
  const to =
    period === "month"
      ? new Date(
          Date.UTC(Number(date.slice(0, 4)), Number(date.slice(5, 7)), 0),
        )
          .toISOString()
          .slice(0, 10)
      : period === "week"
        ? new Date(new Date(from + "T12:00:00Z").getTime() + 6 * 86400000)
            .toISOString()
            .slice(0, 10)
        : date;
  const r = w ? report(w, from, to) : null;
  const total = w ? report(w, "0001-01-01", "9999-12-31").total : null;
  const active =
    w?.records.filter((r) => !r.removed && !r.kind.startsWith("opening_")) ??
    [];
  const filtered = active
    .filter((r) => !recordPeriod || (r.date >= from && r.date <= to))
    .filter(
      (r) =>
        (filter === "all" ||
          (filter === "in" &&
            [
              "sale",
              "income",
              "owner_in",
              "loan_received",
              "receivable_payment",
            ].includes(r.kind)) ||
          (filter === "out" &&
            [
              "expense",
              "stock",
              "asset",
              "owner_out",
              "interest",
              "payable_payment",
              "loan_principal",
            ].includes(r.kind)) ||
          r.kind === filter) &&
        [
          r.description,
          r.party,
          r.amount,
          r.id,
          w?.accounts.find((a) => a.id === r.accountId)?.name,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()),
    );
  function rows(records: EventInput[], draft = false) {
    return records.map((record) => (
      <RecordRow
        key={record.id}
        record={record}
        hidden={hidden}
        account={
          hidden
            ? undefined
            : w?.accounts.find((a) => a.id === record.accountId)?.name
        }
        onClick={() => {
          if (draft) manual(record);
          else {
            setSelected(record as RecordEvent);
            setModal("detail");
          }
        }}
      />
    ));
  }
  const navigation = (mobile = false) => (
    <nav
      aria-label={mobile ? "Mobile navigation" : "Main navigation"}
      className={mobile ? s.bottomNav : undefined}
    >
      {nav.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={s.navLink}
          aria-current={page === id ? "page" : undefined}
          onClick={() => navigate(id)}
        >
          <Icon size={20} />
          {mobile && id === "stories" ? "Stories" : label}
        </button>
      ))}
      {!mobile && (
        <>
          <hr />
          <button className={s.navLink} onClick={() => navigate("accounts")}>
            <Landmark size={20} />
            Accounts
          </button>
        </>
      )}
    </nav>
  );
  if (!loaded)
    return (
      <main className={s.landing}>
        <h1>Opening your records…</h1>
      </main>
    );
  if (!owner)
    return (
      <main className={s.landing}>
        <h1>Let’s open your records.</h1>
        {status && <p role="status">{status}</p>}
        <p role="alert">{error}</p>
        <Link href="/auth" className={s.button}>
          Sign in
        </Link>{" "}
        <Link href="/" className={s.button}>
          Try the synthetic demo
        </Link>
      </main>
    );
  return (
    <>
      <a className={s.skip} href="#main">
        Skip to content
      </a>
      {demo && (
        <div className={s.strip}>
          Synthetic demo · fictional Ama Works data · no real AI calls
        </div>
      )}
      <div className={s.shell}>
        <aside className={s.sidebar}>
          <Link href="/">
            <img
              className={s.logo}
              src={
                theme === "dark"
                  ? "/brand/cashnarra-lockup-reversed.svg"
                  : "/brand/cashnarra-lockup.svg"
              }
              alt="CashNarra"
            />
          </Link>
          <button
            className={s.accountButton}
            onClick={() => setModal("workspace")}
          >
            <strong>
              {hidden ? "Workspace" : (w?.name ?? "Create a workspace")}
            </strong>
            <small>
              {w?.type ?? "Personal or Business"} · GHS{" "}
              <ChevronDown size={13} />
            </small>
          </button>
          {navigation()}
          <div className={s.sidebarBottom}>
            <button className={s.navLink} onClick={() => navigate("settings")}>
              <Settings size={20} />
              Settings and privacy
            </button>
            <small>
              Serious money.
              <br />
              Light interaction.
            </small>
          </div>
        </aside>
        <div>
          <header className={s.topbar}>
            <div className={s.breadcrumb}>
              {hidden ? "Workspace" : w?.name} ›{" "}
              {nav.find((n) => n.id === page)?.label ?? "Your story"}
            </div>
            <Link className={s.mobileLogo} href="/">
              <img
                className={s.logo}
                src={
                  theme === "dark"
                    ? "/brand/cashnarra-lockup-reversed.svg"
                    : "/brand/cashnarra-lockup.svg"
                }
                alt="CashNarra"
              />
            </Link>
            <div className={s.topActions}>
              <button
                className={s.iconButton}
                aria-label={hidden ? "Show amounts" : "Hide amounts"}
                onClick={() => setHidden(!hidden)}
              >
                {hidden ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <button
                className={s.iconButton}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} appearance`}
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button
                className={s.iconButton}
                aria-label="Workspace, accounts and settings"
                onClick={() => setModal("workspace")}
              >
                <span className={s.badge}>AW</span>
              </button>
            </div>
          </header>
          <main id="main" className={s.content}>
            <div role="status" aria-live="polite">
              {status && (
                <p className={status.startsWith("Saved") ? s.status : s.notice}>
                  {status}
                </p>
              )}
            </div>
            {error && (
              <p role="alert" className={`${s.notice} ${s.error}`}>
                {error}
              </p>
            )}
            {retryOperation && retryOperation.action !== "batch" && (
              <div className={s.notice}>
                <p>
                  The last action is not confirmed. Its original request is
                  preserved.
                </p>
                <Button
                  disabled={busy}
                  onClick={async () => {
                    try {
                      await perform(retryOperation);
                      setStatus("Saved · original action receipt confirmed");
                    } catch {}
                  }}
                >
                  Recover original action
                </Button>
              </div>
            )}
            {!w ? (
              <>
                <h1>Create your first workspace.</h1>
                <p>
                  Choose personal or business. Account openings can stay
                  unknown.
                </p>
                <Button primary onClick={() => setModal("workspace")}>
                  Create workspace
                </Button>
              </>
            ) : (
              <>
                {page === "today" && (
                  <>
                    <div className={s.pageHead}>
                      <div>
                        <h1 ref={heading} tabIndex={-1}>
                          Let’s make sense of your money.
                        </h1>
                        <p>
                          {demo
                            ? "Ama Works · Tuesday, 13 October 2026"
                            : "Start with the day you remember."}
                        </p>
                      </div>
                    </div>
                    <div className={s.balanceBand}>
                      <button
                        className={s.balanceMain}
                        onClick={() => navigate("accounts")}
                      >
                        <span className={s.muted}>
                          Recorded account balances
                        </span>
                        <Amount value={total} hidden={hidden} large />
                        <small>Cash, Bank & MoMo · manually tracked</small>
                      </button>
                      <button
                        className={s.balanceStat}
                        onClick={() => {
                          setFilter("in");
                          setRecordPeriod(true);
                          navigate("records");
                        }}
                      >
                        <small>Money in · selected day</small>
                        <Amount value={r!.received} hidden={hidden} />
                        <small>Including old-balance payments</small>
                      </button>
                      <button
                        className={s.balanceStat}
                        onClick={() => {
                          setFilter("out");
                          setRecordPeriod(true);
                          navigate("records");
                        }}
                      >
                        <small>Money out · selected day</small>
                        <Amount value={r!.paid} hidden={hidden} />
                        <small>Transfers between accounts excluded</small>
                      </button>
                    </div>
                    <div className={s.homeGrid}>
                      <section>
                        <div className={s.composer}>
                          <img
                            className={s.watermark}
                            src="/brand/cashnarra-symbol.svg"
                            alt=""
                          />
                          <span className={s.eyebrow}>
                            <img src="/brand/cashnarra-symbol.svg" alt="" />
                            Your next story
                          </span>
                          <h2>What happened with your money today?</h2>
                          <p>
                            A sale, a payment, a little of both.
                            <br />
                            Tell it in your own words.
                          </p>
                          <button
                            className={s.capture}
                            onClick={() =>
                              navigate(events.length ? "review" : "capture")
                            }
                          >
                            {text
                              ? "Your draft is here. Continue when you’re ready."
                              : "“I sold 900 cash, paid for delivery, and Abena paid part of her balance…”"}
                          </button>
                          <div className={s.actions}>
                            <Button
                              primary
                              onClick={() =>
                                navigate(events.length ? "review" : "capture")
                              }
                            >
                              <Plus size={18} />
                              {events.length
                                ? "Finish your draft"
                                : "Tell your story"}
                            </Button>
                            <Button onClick={() => setModal("voice")}>
                              <Mic size={18} />
                              <span>Voice</span>
                            </Button>
                          </div>
                          <small>
                            You review the records before they’re saved.
                          </small>
                        </div>
                        <div className={s.sectionHead}>
                          <h2>Recent records</h2>
                          <button
                            className={s.sectionLink}
                            onClick={() => navigate("records")}
                          >
                            View all →
                          </button>
                        </div>
                        {active.length ? (
                          rows(active.slice(-5))
                        ) : (
                          <p className={s.empty}>
                            No records yet. Start with one useful story.
                          </p>
                        )}
                      </section>
                      <aside>
                        <div className={s.storyTile}>
                          <small>
                            <BookOpen size={15} /> Your Money Story
                          </small>
                          <h2>
                            Your day,
                            <br />
                            <em>made clearer.</em>
                          </h2>
                          {[
                            ["Money in", r!.received],
                            ["Money out", r!.paid],
                          ].map(([label, value], i) => (
                            <div key={label}>
                              <div className={s.barLabel}>
                                <span>{label}</span>
                                <Amount value={value} hidden={hidden} />
                              </div>
                              <div className={s.bar}>
                                <span
                                  className={i ? s.barOut : undefined}
                                  style={{
                                    width: hidden
                                      ? "0%"
                                      : `${D(value)
                                          .div(
                                            (D(r!.received).gte(r!.paid)
                                              ? D(r!.received)
                                              : D(r!.paid)
                                            ).plus("0.01"),
                                          )
                                          .mul(100)
                                          .toNumber()}%`,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                          <p>
                            Recorded net movement:{" "}
                            <Amount value={r!.net} hidden={hidden} />. This is
                            not profit.
                          </p>
                          <Button onClick={() => navigate("stories")}>
                            Read your story <ArrowRight size={15} />
                          </Button>
                        </div>
                        {w.preferences?.showRhythm !== false && (
                          <section className={s.rhythm}>
                            <h3>Your rhythm</h3>
                            <p>
                              {
                                w.checkins.filter((c) => c.kind !== "rest")
                                  .length
                              }{" "}
                              deliberate check-ins recorded
                            </p>
                            <small>
                              A check-in does not mean all activity is captured.
                            </small>
                            <div className={s.actions}>
                              <Button onClick={() => setModal("checkin")}>
                                Check in
                              </Button>
                            </div>
                          </section>
                        )}
                        {w.preferences?.reminder &&
                          !w.checkins.some(
                            (c) =>
                              c.date === new Date().toISOString().slice(0, 10),
                          ) && (
                            <p className={s.notice}>
                              A moment for your money? Check today, or catch up
                              on a day you remember. No rush.
                            </p>
                          )}
                        {w.goals[0] && (
                          <section className={s.goalPeek}>
                            <h3>Something to work towards</h3>
                            <p>{w.goals[0].name}</p>
                            <Amount
                              value={sum(
                                w.goals[0].allocations.map((a) => a.amount),
                              )}
                              hidden={hidden}
                            />
                            <small> assigned, not moved</small>
                            <div>
                              <button
                                className={s.sectionLink}
                                onClick={() => navigate("plan")}
                              >
                                Open your plan →
                              </button>
                            </div>
                          </section>
                        )}
                      </aside>
                    </div>
                  </>
                )}
                {page === "capture" && (
                  <section className={s.flow}>
                    <h1 ref={heading} tabIndex={-1}>
                      Tell it as it happened.
                    </h1>
                    <p>
                      You don’t need accounting words. Describe several things
                      at once.
                    </p>
                    <label htmlFor="story-date">Date of activity</label>
                    <DraftBackup
                      draft={{
                        ownerId: owner,
                        workspaceId: wid,
                        text,
                        date,
                        revision,
                        events,
                        replaceIds,
                        reason,
                        pendingRequest: pending ?? retryOperation ?? undefined,
                      }}
                      locked={!!pending || !!retryOperation || busy}
                      onRestore={(d) => {
                        const next =
                          Math.max(revisionRef.current, d.revision) + 1;
                        revisionRef.current = next;
                        setRevision(next);
                        setText(d.text);
                        setDate(d.date);
                        setEvents(d.events);
                        setReplaceIds(d.replaceIds);
                        setReason(d.reason);
                        const op = d.pendingRequest as Operation | undefined;
                        setPending(op?.action === "batch" ? op : null);
                        setRetryOperation(
                          op && op.action !== "batch" ? op : null,
                        );
                        setQuestions([]);
                        setStatus(
                          "Draft restored. Check the words and records before saving.",
                        );
                        if (d.events.length || op) setPage("review");
                      }}
                    />
                    <input
                      id="story-date"
                      type="date"
                      value={date}
                      onChange={(e) => {
                        if (calendarDate(e.target.value))
                          setDate(e.target.value);
                        changeDraft();
                      }}
                      disabled={!!pending}
                    />
                    <label htmlFor="narration">Your money story</label>
                    <textarea
                      id="narration"
                      value={text}
                      maxLength={12000}
                      onChange={(e) => changeDraft(e.target.value)}
                      disabled={!!pending}
                      placeholder="Today I…"
                    />
                    <label className={s.checkLabel}>
                      <input
                        type="checkbox"
                        checked={persistent}
                        onChange={async (e) => {
                          setPersistent(e.target.checked);
                          if (!e.target.checked)
                            await clearDrafts().catch((x) =>
                              setError(x.message),
                            );
                        }}
                      />
                      Keep drafts on this private device
                    </label>
                    <small>
                      Off on shared devices. Browser storage is not a backup.
                    </small>
                    {!ai && (
                      <p className={s.notice}>
                        Mock processing supports the labelled examples only.
                        Manual recording works for other input.
                      </p>
                    )}
                    <div className={s.actions}>
                      {demo && (
                        <>
                          <Button onClick={() => changeDraft(sample)}>
                            Use the example
                          </Button>
                          <Button onClick={() => changeDraft(unclearSample)}>
                            Try an unclear version
                          </Button>
                        </>
                      )}
                      <Button onClick={() => manual()}>
                        Add a manual record
                      </Button>
                    </div>
                    <div className={s.actions}>
                      <Button
                        primary
                        onClick={understand}
                        disabled={busy || !text.trim() || !!pending}
                      >
                        {busy
                          ? "Waiting for processing…"
                          : "Understand my story"}
                      </Button>
                      <Button
                        onClick={() =>
                          navigator.clipboard
                            .writeText(text)
                            .then(() => setStatus("Draft copied."))
                            .catch(() =>
                              setError(
                                "Copy failed. Select and copy your text manually.",
                              ),
                            )
                        }
                      >
                        Copy draft
                      </Button>
                    </div>
                    <p className={s.notice}>
                      Review names and sensitive details before processing.{" "}
                      <Link href="/privacy">Who processes your story?</Link>
                    </p>
                  </section>
                )}
                {page === "review" && (
                  <section className={s.flow}>
                    <h1 ref={heading} tabIndex={-1}>
                      {questions.length
                        ? "Just one detail."
                        : "Your story, organised."}
                    </h1>
                    <p>
                      {questions.length
                        ? "Your answer changes how the record is understood."
                        : "Check every record. Select a row to change it."}
                    </p>
                    {questions.map((q) => (
                      <div key={q.recordId + q.field} className={s.panel}>
                        <h2>{q.question}</h2>
                        <Button
                          onClick={() =>
                            manual(events.find((e) => e.id === q.recordId))
                          }
                        >
                          Add the missing detail
                        </Button>
                      </div>
                    ))}
                    <span className={s.badge}>
                      {events.length} proposed records · not saved yet
                    </span>
                    {replaceIds.length > 0 && (
                      <div className={s.notice}>
                        This replaces {replaceIds.length} saved record(s). Prior
                        versions remain in correction history.
                        <label htmlFor="reason">Reason</label>
                        <input
                          id="reason"
                          value={reason}
                          disabled={!!pending}
                          onChange={(e) => {
                            setReason(e.target.value);
                            changeDraft();
                          }}
                        />
                      </div>
                    )}
                    {rows(events, true)}
                    {events.length === 0 && (
                      <p className={s.empty}>
                        {replaceIds.length
                          ? "The incorrect financial effect will be removed."
                          : "No proposed records yet."}
                      </p>
                    )}
                    <details>
                      <summary>Read the original story</summary>
                      <blockquote>
                        {hidden
                          ? "Source hidden while amounts are masked."
                          : text}
                      </blockquote>
                    </details>
                    {duplicates(w, events).length > 0 && (
                      <div className={s.notice}>
                        <h3>This may already be recorded.</h3>
                        {duplicates(w, events).map((d, i) => (
                          <p key={i}>
                            {d.existing.description} · {d.existing.date} ·{" "}
                            <Amount value={d.existing.amount} hidden={hidden} />
                            <br />
                            Existing record: {d.existing.id}
                            <br />
                            Source:{" "}
                            {hidden
                              ? "Hidden"
                              : (w.sources.find(
                                  (s) => s.id === d.existing.sourceId,
                                )?.text ?? "Removed under retention setting")}
                          </p>
                        ))}
                        <label className={s.checkLabel}>
                          <input
                            type="checkbox"
                            checked={allowDuplicates}
                            onChange={(e) =>
                              setAllowDuplicates(e.target.checked)
                            }
                          />
                          I compared the evidence. Keep these as new records.
                        </label>
                      </div>
                    )}
                    <p className={s.notice}>
                      The whole batch saves together. Transfers are not
                      spending. Old debt payments are not new sales.
                    </p>
                    <div className={s.actions}>
                      {pending ? (
                        <Button primary onClick={recover} disabled={busy}>
                          Check original save request
                        </Button>
                      ) : (
                        <Button
                          primary
                          onClick={saveBatch}
                          disabled={
                            busy ||
                            questions.length > 0 ||
                            (!events.length && !replaceIds.length)
                          }
                        >
                          Save reviewed{" "}
                          {events.length
                            ? `${events.length} records`
                            : "removal"}
                        </Button>
                      )}
                      <Button onClick={() => manual()} disabled={!!pending}>
                        Add record
                      </Button>
                      <Button onClick={() => navigate("capture")}>
                        Back to words
                      </Button>
                      <Button onClick={() => setModal("discard")}>
                        Discard draft
                      </Button>
                    </div>
                  </section>
                )}
                {page === "records" && (
                  <>
                    <div className={s.pageHead}>
                      <div>
                        <h1 ref={heading} tabIndex={-1}>
                          Every story has a paper trail.
                        </h1>
                        <p>Search, inspect and correct your saved records.</p>
                      </div>
                      <Button onClick={() => setModal("export")}>Export</Button>
                    </div>
                    <div className={s.toolbar}>
                      <input
                        aria-label="Search records"
                        placeholder="Search person, amount or description"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <select
                        aria-label="Filter records"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                      >
                        <option value="all">All records</option>
                        <option value="in">Money in</option>
                        <option value="out">Money out</option>
                        <option value="transfer">Transfers</option>
                        <option value="credit_sale">Credit sales</option>
                        <option value="credit_expense">Unpaid expenses</option>
                      </select>
                      <Button primary onClick={() => manual()}>
                        <Plus size={17} />
                        Add record
                      </Button>
                    </div>
                    {recordPeriod && (
                      <p>
                        Period: {from}–{to}.{" "}
                        <Button onClick={() => setRecordPeriod(false)}>
                          Show all dates
                        </Button>
                      </p>
                    )}
                    {rows(filtered)}
                    {!filtered.length && (
                      <p className={s.empty}>
                        No matching records. Missing activity is not treated as
                        zero.
                      </p>
                    )}
                    <details>
                      <summary>Correction and removal history</summary>
                      {w.history.map((h, i) => (
                        <div key={i}>
                          <p>
                            {h.at} · {h.reason}
                          </p>
                          <Button
                            onClick={() => {
                              setSelected(h.before);
                              setModal("detail");
                            }}
                          >
                            Inspect prior {h.before.description}
                          </Button>
                        </div>
                      ))}
                    </details>
                    <section className={s.chapter}>
                      <h2>Money still owed</h2>
                      <Button onClick={() => setModal("workspace-tools")}>
                        Manage people and payment dates
                      </Button>
                      {obligations(w).map((o) => (
                        <div className={s.settingsRow} key={o.id}>
                          <div>
                            <strong>{hidden ? "Counterparty" : o.party}</strong>
                            <p>
                              {o.direction === "receivable"
                                ? "People owe you"
                                : "You owe"}{" "}
                              · {o.date}
                            </p>
                            <Amount value={o.remaining} hidden={hidden} />
                            {debtDate(w, o.id) && (
                              <p>
                                Due {debtDate(w, o.id)}
                                {debtDate(w, o.id)! <
                                  new Date().toISOString().slice(0, 10) &&
                                D(o.remaining).gt(0)
                                  ? " · Past the date you set"
                                  : ""}
                              </p>
                            )}
                          </div>
                          <Button
                            onClick={() =>
                              manual(
                                event(
                                  o.direction === "receivable"
                                    ? "receivable_payment"
                                    : [
                                          "loan_received",
                                          "opening_loan",
                                        ].includes(
                                          w.records.find((r) => r.id === o.id)
                                            ?.kind ?? "",
                                        )
                                      ? "loan_principal"
                                      : "payable_payment",
                                  o.remaining,
                                  `${o.party} balance payment`,
                                  w.accounts[0]?.id ?? null,
                                  { date, party: o.party, obligationId: o.id },
                                ),
                              )
                            }
                            disabled={D(o.remaining).isZero()}
                          >
                            Record payment
                          </Button>
                          <Button
                            onClick={() => {
                              setSelected(
                                w.records.find((r) => r.id === o.id) ?? null,
                              );
                              setModal("detail");
                            }}
                          >
                            View original balance
                          </Button>
                        </div>
                      ))}
                      <Button
                        onClick={() =>
                          manual(
                            event(
                              "opening_receivable",
                              "",
                              "Opening balance",
                              null,
                              { date },
                            ),
                          )
                        }
                      >
                        Add opening obligation
                      </Button>
                    </section>
                  </>
                )}
                {page === "stories" && (
                  <>
                    <div className={s.pageHead}>
                      <div>
                        <h1 ref={heading} tabIndex={-1}>
                          Money Stories
                        </h1>
                        <p>The numbers, with their meaning.</p>
                      </div>
                      <Button onClick={() => setModal("export")}>Export</Button>
                    </div>
                    <div className={s.toolbar}>
                      <select
                        aria-label="Story period"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                      >
                        <option value="day">Daily</option>
                        <option value="week">Weekly</option>
                        <option value="month">Monthly</option>
                      </select>
                      <input
                        aria-label="Story date"
                        type="date"
                        value={date}
                        onChange={(e) => {
                          if (calendarDate(e.target.value))
                            setDate(e.target.value);
                        }}
                      />
                    </div>
                    <section className={s.storyCover}>
                      <small>
                        {hidden ? "Workspace" : w.name} · {from} to {to} · GHS
                      </small>
                      <h2>
                        <Amount value={r!.received} hidden={hidden} /> came in.
                        <br />
                        <em>Here’s the story.</em>
                      </h2>
                      <p>
                        {
                          r!.records.filter(
                            (x) => !x.kind.startsWith("opening_"),
                          ).length
                        }{" "}
                        saved records in this period.{" "}
                        <Amount value={r!.paid} hidden={hidden} /> went out.
                      </p>
                      <small>
                        Recorded activity so far. Missing days are not zero.
                      </small>
                    </section>
                    <section className={s.chapter}>
                      <h2>01 · What moved</h2>
                      <p>
                        Recorded net movement was{" "}
                        <Amount value={r!.net} hidden={hidden} />. It is money
                        received minus money paid out.
                      </p>
                      <Button
                        onClick={() => {
                          setFilter("in");
                          setRecordPeriod(true);
                          navigate("records");
                        }}
                      >
                        See money received
                      </Button>
                      <Button
                        onClick={() => {
                          setFilter("out");
                          setRecordPeriod(true);
                          navigate("records");
                        }}
                      >
                        See money paid out
                      </Button>
                      <details>
                        <summary>
                          Included records, formula and exclusions
                        </summary>
                        <p>
                          {r!.exclusions} Workspace version {r!.version}; period{" "}
                          {from}–{to}; Africa/Accra.
                        </p>
                        {rows(r!.records)}
                      </details>
                    </section>
                    <section className={s.chapter}>
                      <h2>02 · Received does not always mean sold</h2>
                      <p>
                        Sales value:{" "}
                        <Amount
                          value={r!.sales}
                          hidden={hidden}
                          onInspect={() => setModal("trace")}
                        />
                        . This includes credit sales. Old-balance payments,
                        loans and owner money are separate from sales.
                      </p>
                      <div className={s.metrics}>
                        <div>
                          <small>People owe you · period end</small>
                          <Amount
                            value={r!.peopleOwe}
                            hidden={hidden}
                            onInspect={() => setModal("trace")}
                          />
                        </div>
                        <div>
                          <small>You owe · period end</small>
                          <Amount
                            value={r!.userOwes}
                            hidden={hidden}
                            onInspect={() => setModal("trace")}
                          />
                        </div>
                      </div>
                      <Button onClick={() => navigate("records")}>
                        Inspect outstanding balances
                      </Button>
                    </section>
                    <section className={s.chapter}>
                      <h2>03 · A useful picture. Clear boundaries.</h2>
                      {ai && (
                        <PeriodExplanation
                          key={w.id + from + to + w.version}
                          workspaceId={w.id}
                          from={from}
                          to={to}
                          onRecord={(id) => {
                            setSelected(
                              w.records.find((r) => r.id === id) ?? null,
                            );
                            setModal("detail");
                          }}
                        />
                      )}
                      <p>
                        Recorded balances at period end:{" "}
                        <Amount
                          value={r!.total}
                          hidden={hidden}
                          onInspect={() => setModal("trace")}
                        />
                        . Declared openings plus saved movements; not externally
                        verified.
                      </p>
                      <p>
                        Profit is unavailable. Cost of sales, inventory consumed
                        and other necessary information are missing.
                      </p>
                      <Button onClick={() => navigate("accounts")}>
                        Trace account balances
                      </Button>
                      <Button onClick={() => setModal("checkin")}>
                        Review this period’s activity
                      </Button>
                    </section>
                  </>
                )}
                {page === "accounts" && (
                  <>
                    <div className={s.pageHead}>
                      <div>
                        <h1 ref={heading} tabIndex={-1}>
                          Your accounts
                        </h1>
                        <p>
                          One recorded picture. Your money stays in your own
                          accounts.
                        </p>
                        {!w.accounts.length && (
                          <ol>
                            <li>Add Cash, Bank or MoMo with a nickname.</li>
                            <li>
                              Enter the amount you knew before your first
                              recorded activity, or leave it unknown.
                            </li>
                            <li>
                              Use Add record for money already owed to you or by
                              you; choose an opening balance, not a new sale.
                            </li>
                          </ol>
                        )}
                      </div>
                      <Button primary onClick={() => setModal("account")}>
                        Add account
                      </Button>
                    </div>
                    <small>Recorded total</small>
                    <div>
                      <Amount value={total} hidden={hidden} large />
                    </div>
                    <div className={s.accountGrid}>
                      {w.accounts.map((a) => (
                        <article key={a.id} className={s.panel}>
                          <Landmark size={22} />
                          <h2 style={{ marginTop: 16 }}>
                            {hidden ? "Account" : a.name}
                          </h2>
                          <Amount
                            value={accountBalance(w, a.id)}
                            hidden={hidden}
                            large
                          />
                          <p>Manually tracked · {a.type} · GHS</p>
                          <details>
                            <summary>Opening and recorded movements</summary>
                            <p>
                              Declared opening on {a.openingDate}:{" "}
                              <Amount value={a.opening} hidden={hidden} />
                            </p>
                            {rows(
                              active.filter(
                                (r) =>
                                  r.accountId === a.id ||
                                  r.toAccountId === a.id,
                              ),
                            )}
                          </details>
                          <Button
                            onClick={() => {
                              setAccountId(a.id);
                              setModal("opening");
                            }}
                          >
                            Review opening balance
                          </Button>
                        </article>
                      ))}
                    </div>
                    <p className={s.notice}>
                      An unknown opening remains unknown. Account balances do
                      not imply bank verification.
                    </p>
                  </>
                )}
                {page === "plan" && (
                  <>
                    <div className={s.pageHead}>
                      <div>
                        <h1 ref={heading} tabIndex={-1}>
                          Give your story a direction.
                        </h1>
                        <p>A goal you choose. A pace you can understand.</p>
                      </div>
                      <div className={s.actions}>
                        <Button onClick={() => setModal("goal")}>
                          New goal
                        </Button>
                        <Button onClick={() => setModal("workspace-tools")}>
                          Edit goals
                        </Button>
                      </div>
                    </div>
                    {!w.goals.length && (
                      <p className={s.empty}>
                        Goals are optional. Start with a name and a fixed
                        target.
                      </p>
                    )}
                    {w.goals.map((g) => {
                      const f = forecast(g, date);
                      return (
                        <div className={s.goalGrid} key={g.id}>
                          <section className={s.panel}>
                            <span className={s.badge}>Assigned, not moved</span>
                            <h2 style={{ marginTop: 18 }}>{g.name}</h2>
                            <small>Money assigned to this goal</small>
                            <div>
                              <Amount
                                value={f.assigned}
                                hidden={hidden}
                                large
                              />
                            </div>
                            <p>
                              of <Amount value={g.target} hidden={hidden} />{" "}
                              target
                            </p>
                            <progress
                              aria-label={`${g.name} assigned progress`}
                              max={100}
                              value={
                                hidden
                                  ? 0
                                  : D(f.assigned)
                                      .div(g.target)
                                      .mul(100)
                                      .clamp(0, 100)
                                      .toNumber()
                              }
                            />
                            <div className={s.actions}>
                              <Button
                                onClick={() => {
                                  setGoalId(g.id);
                                  setModal("allocation");
                                }}
                              >
                                Assign money to this goal
                              </Button>
                              <Button
                                onClick={() => {
                                  setGoalId(g.id);
                                  setModal("goal-review");
                                }}
                              >
                                Review history
                              </Button>
                            </div>
                            <hr />
                            <small>At your recorded contribution pace</small>
                            <h3 style={{ marginTop: 10 }}>
                              {f.count === null
                                ? "No useful date yet"
                                : f.count === 0
                                  ? "Target assigned"
                                  : `About ${f.count} monthly contributions`}
                            </h3>
                            {f.period && (
                              <p>
                                Around {f.period} at{" "}
                                <Amount value={f.pace} hidden={hidden} /> per
                                month.
                              </p>
                            )}
                            <p>{f.reason}</p>
                            <Button
                              onClick={() => {
                                setGoalId(g.id);
                                setModal("scenario");
                              }}
                            >
                              Explore a what-if
                            </Button>
                          </section>
                          <aside>
                            <h3>Behind this estimate</h3>
                            <p>
                              As of {date}. Target unchanged. Monthly
                              contributions, no withdrawals, interest, fees,
                              returns or future price changes.
                            </p>
                            <p>
                              Assigning money is a note in CashNarra. The money
                              stays in your account and is not reserved by your
                              bank or MoMo provider.
                            </p>
                            <p>
                              You still need to allow for debts and other bills.
                              This estimate does not tell you whether you can
                              afford each contribution.
                            </p>
                            <details>
                              <summary>See money assigned to this goal</summary>
                              {g.allocations.map((a) => (
                                <p key={a.id}>
                                  {a.date} ·{" "}
                                  <Amount value={a.amount} hidden={hidden} />
                                </p>
                              ))}
                            </details>
                          </aside>
                        </div>
                      );
                    })}
                  </>
                )}
                {page === "settings" && (
                  <>
                    <h1 ref={heading} tabIndex={-1}>
                      Make it work for you.
                    </h1>
                    <div className={s.settingsRow}>
                      <div>
                        <strong>Appearance</strong>
                        <p>Use light or dark appearance.</p>
                      </div>
                      <select
                        aria-label="Appearance"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>
                    <div className={s.settingsRow}>
                      <div>
                        <strong>Hide amounts</strong>
                        <p>Screen privacy, not encryption.</p>
                      </div>
                      <Button onClick={() => setHidden(!hidden)}>
                        {hidden ? "Show amounts" : "Hide amounts"}
                      </Button>
                    </div>
                    <div className={s.settingsRow}>
                      <div>
                        <strong>Shared device</strong>
                        <p>
                          Draft persistence is {persistent ? "on" : "off"}.
                          Turning it off clears stored drafts.
                        </p>
                      </div>
                      <Button
                        onClick={async () => {
                          setPersistent(false);
                          await clearDrafts()
                            .then(() =>
                              setStatus(
                                "Shared-device mode. Stored drafts cleared.",
                              ),
                            )
                            .catch((e) => setError(e.message));
                        }}
                      >
                        Use shared-device mode
                      </Button>
                    </div>
                    <div className={s.settingsRow}>
                      <div>
                        <strong>How long to keep your original words</strong>
                        <p>
                          Your saved amounts and correction history are kept
                          separately.
                        </p>
                      </div>
                      <select
                        aria-label="Narration retention"
                        value={w.retentionDays}
                        onChange={(e) =>
                          simple("retention", { days: Number(e.target.value) })
                        }
                      >
                        <option value={30}>30 days</option>
                        <option value={7}>7 days</option>
                        <option value={0}>Remove text now</option>
                      </select>
                    </div>
                    <div className={s.settingsRow}>
                      <div>
                        <strong>Check-in and catch-up</strong>
                        <p>
                          No penalties, points or claims of complete finances.
                        </p>
                      </div>
                      <Button onClick={() => setModal("checkin")}>
                        Choose a day
                      </Button>
                    </div>
                    <section className={s.chapter}>
                      <h2>Privacy and your data</h2>
                      <Button onClick={() => setModal("workspace-tools")}>
                        People, payment dates and goal settings
                      </Button>
                      <p>
                        <Link href="/privacy">Read the processing notice</Link>
                      </p>
                      <div className={s.actions}>
                        <Button onClick={() => setModal("export")}>
                          Private export
                        </Button>
                        <Button
                          onClick={() => simple("request", { kind: "access" })}
                        >
                          Record access request
                        </Button>
                        <Button onClick={() => setModal("deletion")}>
                          Request account-data deletion
                        </Button>
                        <Button onClick={() => setModal("logout")}>
                          Sign out
                        </Button>
                      </div>
                      {w.requests.map((r) => (
                        <p key={r.id}>
                          {r.kind} request · {r.status} · {r.at.slice(0, 10)}
                        </p>
                      ))}
                      <p className={s.notice}>
                        Requests are recorded for operator review. No records
                        are automatically erased or emailed. This local build
                        has no staffed support service.
                      </p>
                    </section>
                  </>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      {navigation(true)}
      {modal === "record" && editing && w && (
        <Dialog title="Check this record" onClose={() => setModal("")}>
          <RecordForm
            initial={editing}
            workspace={w}
            onCancel={() => setModal("")}
            onSave={(e) => {
              setEvents((current) =>
                current.some((x) => x.id === e.id)
                  ? current.map((x) => (x.id === e.id ? e : x))
                  : [...current, e],
              );
              setQuestions((q) => q.filter((x) => x.recordId !== e.id));
              changeDraft();
              setPage("review");
              setModal("");
            }}
          />
        </Dialog>
      )}
      {modal === "workspace" && (
        <Dialog title="Your workspaces" onClose={() => setModal("")}>
          {spaces.map((x) => (
            <Button
              key={x.id}
              onClick={() => {
                if (text || events.length || pending || retryOperation) {
                  setError(
                    "Save or discard the current draft before switching workspace.",
                  );
                  setModal("");
                  return;
                }
                setWid(x.id);
                navigate("today");
              }}
            >
              {hidden ? "Workspace" : x.name} · {x.type}
            </Button>
          ))}
          <div className={s.actions}>
            <Button onClick={() => navigate("accounts")}>
              Manage accounts
            </Button>
            <Button onClick={() => navigate("settings")}>
              Settings and privacy
            </Button>
          </div>
          <hr />
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              try {
                await perform({
                  action: "create",
                  workspaceId: crypto.randomUUID(),
                  expectedVersion: -1,
                  key: crypto.randomUUID(),
                  name: f.get("name"),
                  type: f.get("type"),
                });
                setModal("");
              } catch {}
            }}
          >
            <h3>Create a workspace</h3>
            <label htmlFor="workspace-name">Name</label>
            <input id="workspace-name" name="name" maxLength={100} required />
            <label htmlFor="workspace-type">Use</label>
            <select id="workspace-type" name="type">
              <option>Business</option>
              <option>Personal</option>
            </select>
            <div className={s.actions}>
              <Button primary type="submit" disabled={busy}>
                Create workspace
              </Button>
            </div>
          </form>
        </Dialog>
      )}
      {modal === "account" && (
        <Dialog title="Track an account" onClose={() => setModal("")}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              simple("account", {
                account: {
                  id: crypto.randomUUID(),
                  name: f.get("name"),
                  type: f.get("type"),
                  opening: f.get("unknown") ? null : f.get("amount"),
                  openingDate: f.get("date"),
                },
              });
            }}
          >
            <label htmlFor="account-name">Account nickname</label>
            <input id="account-name" name="name" required maxLength={80} />
            <label htmlFor="account-type">Type</label>
            <select id="account-type" name="type">
              <option>Cash</option>
              <option>Bank</option>
              <option>MoMo</option>
            </select>
            <label htmlFor="opening">Opening amount · GHS</label>
            <input
              id="opening"
              name="amount"
              inputMode="decimal"
              placeholder="Enter a known opening"
            />
            <label className={s.checkLabel}>
              <input type="checkbox" name="unknown" defaultChecked />I don’t
              know the opening balance yet
            </label>
            <label htmlFor="opening-date">Opening date</label>
            <input
              id="opening-date"
              name="date"
              type="date"
              defaultValue={date}
              required
            />
            <p>Use an opening before the activity you want to record.</p>
            <Button primary type="submit" disabled={busy}>
              Create recorded account
            </Button>
          </form>
        </Dialog>
      )}
      {modal === "trace" && w && (
        <Dialog title="Behind these figures" onClose={() => setModal("")}>
          <ReportTrace
            workspace={w}
            from={from}
            to={to}
            hidden={hidden}
            onRecord={(id) => {
              setSelected(w.records.find((r) => r.id === id) ?? null);
              setModal("detail");
            }}
          />
        </Dialog>
      )}
      {modal === "detail" && selected && w && (
        <Dialog title={selected.description} onClose={() => setModal("")}>
          <Amount value={selected.amount} hidden={hidden} large />
          <p>
            {labels[selected.kind]} · {selected.date}
          </p>
          <small>Record {selected.id}</small>
          <blockquote>
            {hidden
              ? "Source hidden"
              : (w.sources.find((s) => s.id === selected.sourceId)?.text ??
                "Original words removed according to your privacy setting")}
          </blockquote>
          <h3>Correction history</h3>
          {w.history
            .filter(
              (h) =>
                h.before.id === selected.id ||
                h.replacementIds.includes(selected.id),
            )
            .map((h, i) => (
              <p key={i}>
                {h.at} · {h.reason}
                <br />
                Previous amount:{" "}
                <Amount value={h.before.amount} hidden={hidden} />
              </p>
            ))}
          {!w.records.find((r) => r.id === selected.id)?.removed && (
            <div className={s.actions}>
              <Button onClick={() => beginCorrection(selected)}>
                Correct record
              </Button>
              <Button
                onClick={() => {
                  beginCorrection(selected);
                  setEvents([]);
                  setReason("Incorrect effect removed");
                }}
              >
                Remove incorrect effect
              </Button>
              <Button
                disabled={D(selected.amount).lt("0.02")}
                onClick={() => {
                  beginCorrection(selected);
                  const half = D(selected.amount).div(2).toDecimalPlaces(2);
                  setEvents([
                    {
                      ...selected,
                      id: crypto.randomUUID(),
                      amount: half.toFixed(2),
                      description: selected.description + " · first part",
                    },
                    {
                      ...selected,
                      id: crypto.randomUUID(),
                      amount: D(selected.amount).minus(half).toFixed(2),
                      description: selected.description + " · second part",
                    },
                  ]);
                  setReason("Split record");
                }}
              >
                Split record
              </Button>
              <Button onClick={() => setModal("move")}>Move workspace</Button>
            </div>
          )}
        </Dialog>
      )}
      {modal === "move" && selected && w && (
        <Dialog title="Move a record safely" onClose={() => setModal("")}>
          <MoveForm
            source={w}
            spaces={spaces}
            record={selected}
            onMove={async (data) => {
              await perform(data as Operation);
              setModal("");
            }}
          />
        </Dialog>
      )}
      {modal === "opening" && w && (
        <Dialog
          title="Review the declared opening"
          onClose={() => setModal("")}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              simple("opening", {
                accountId,
                amount: f.get("amount") || null,
                reason: f.get("reason"),
              });
            }}
          >
            <p>
              This changes the declared opening on{" "}
              {w.accounts.find((a) => a.id === accountId)?.openingDate},
              including affected earlier reports. It is not new income.
            </p>
            <label htmlFor="opening-correction">
              Correct amount · GHS (blank if unknown)
            </label>
            <input
              id="opening-correction"
              name="amount"
              inputMode="decimal"
              defaultValue={
                w.accounts.find((a) => a.id === accountId)?.opening ?? ""
              }
            />
            <label htmlFor="opening-reason">Reason for this correction</label>
            <input id="opening-reason" name="reason" required maxLength={300} />
            <Button primary type="submit" disabled={busy}>
              Save declared opening
            </Button>
            {w.openingHistory
              ?.filter((h) => h.before.id === accountId)
              .map((h, i) => (
                <p key={i}>
                  {h.at} · {h.reason}: <Amount value={h.before.opening} /> →{" "}
                  <Amount value={h.after.opening} />
                </p>
              ))}
          </form>
        </Dialog>
      )}{" "}
      {modal === "goal" && w && (
        <Dialog
          title="What are you working towards?"
          onClose={() => setModal("")}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              simple("goal", {
                goal: {
                  name: f.get("name"),
                  target: f.get("target"),
                  accountId: f.get("account"),
                },
              });
            }}
          >
            <label htmlFor="goal-name">Goal name</label>
            <input id="goal-name" name="name" required />
            <label htmlFor="target">Fixed target · GHS</label>
            <input id="target" name="target" inputMode="decimal" required />
            <label htmlFor="goal-account">Tracked account</label>
            <select id="goal-account" name="account" required>
              <option value="">Choose account</option>
              {w.accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <p className={s.notice}>
              You can assign recorded money later. No funds move.
            </p>
            <Button primary type="submit" disabled={busy}>
              Create goal
            </Button>
          </form>
        </Dialog>
      )}
      {modal === "allocation" && goal && (
        <Dialog
          title={`Assign money · ${goal.name}`}
          onClose={() => setModal("")}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              simple("allocation", {
                goalId: goal.id,
                amount: f.get("amount"),
                date: f.get("date"),
              });
            }}
          >
            <label htmlFor="allocation">
              Amount · GHS (negative to release)
            </label>
            <input id="allocation" name="amount" inputMode="decimal" required />
            <label htmlFor="allocation-date">Date</label>
            <input
              id="allocation-date"
              name="date"
              type="date"
              defaultValue={date}
              required
            />
            <p className={s.notice}>
              Assignments across all goals cannot exceed the known recorded
              balance. No money moves.
            </p>
            <Button primary type="submit" disabled={busy}>
              Save amount
            </Button>
          </form>
        </Dialog>
      )}
      {modal === "goal-review" && goal && (
        <Dialog title="Review a completed month" onClose={() => setModal("")}>
          <p>
            Review means you have checked the whole month, including quiet days.
            Leave a month unchecked if you are still missing information.
          </p>
          <ol>
            <li>
              Check Records for missing activity, mistakes and repeated entries.
            </li>
            <li>
              Check what you actually assigned to this goal. Assigning nothing
              is different from not knowing.
            </li>
            <li>
              Check unpaid balances and other payments you need to make before
              setting more money aside.
            </li>
          </ol>
          <p>
            CashNarra uses the middle amount from the last three full months you
            checked. It cannot confirm that your records are complete or that
            you can afford future contributions.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              simple("goal_review", {
                goalId: goal.id,
                month: f.get("month"),
                commitmentsKnown: f.get("commitments") === "on",
              });
            }}
          >
            <label htmlFor="review-month">
              Month checked, even if you assigned no money
            </label>
            <input id="review-month" name="month" type="month" required />
            <label className={s.checkLabel}>
              <input
                name="commitments"
                type="checkbox"
                defaultChecked={goal.commitmentsKnown}
              />
              I have checked my debts and other planned payments
            </label>
            <p>
              Missing months are not zero. This confirms review, not
              affordability.
            </p>
            <Button primary type="submit" disabled={busy}>
              Record review
            </Button>
          </form>
        </Dialog>
      )}
      {modal === "scenario" && goal && (
        <Dialog
          title="What if you assigned a little more?"
          onClose={() => setModal("")}
        >
          <span className={s.badge}>
            Scenario only · actual records stay unchanged
          </span>
          <label htmlFor="scenario">Assumed monthly contribution · GHS</label>
          <input
            id="scenario"
            value={scenario}
            inputMode="decimal"
            onChange={(e) => setScenario(e.target.value)}
          />
          {(() => {
            try {
              const f = forecast(goal, date, scenario);
              return (
                <div className={s.notice}>
                  <h3>
                    {f.count === null
                      ? "No completion estimate"
                      : `${f.count} monthly contributions`}
                  </h3>
                  <p>{f.period ? `Around ${f.period}.` : ""}</p>
                  <p>{f.reason}</p>
                </div>
              );
            } catch {
              return (
                <p role="alert">
                  Enter an amount with up to two decimal places.
                </p>
              );
            }
          })()}
          <Button onClick={() => setScenario("600.00")}>
            Reset assumption
          </Button>
        </Dialog>
      )}
      {modal === "checkin" && (
        <Dialog
          title="Start with the day you remember"
          onClose={() => setModal("")}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              simple("checkin", { date: f.get("date"), kind: f.get("kind") });
            }}
          >
            <label htmlFor="check-date">Date</label>
            <input
              id="check-date"
              name="date"
              type="date"
              defaultValue={date}
              required
            />
            <label htmlFor="check-kind">What would you like to mark?</label>
            <select id="check-kind" name="kind">
              <option value="review">I reviewed the recorded activity</option>
              <option value="no_activity">I confirm no money activity</option>
              <option value="rest">Rest / business closed</option>
            </select>
            <p>
              Choose the day you checked. Previous choices stay in your history.
              A check-in does not prove that every transaction has been
              recorded.
            </p>
            <Button primary type="submit">
              Record check-in
            </Button>
          </form>
        </Dialog>
      )}
      {modal === "workspace-tools" && w && (
        <Dialog
          title="People, plans and check-ins"
          onClose={() => setModal("")}
        >
          <WorkspaceTools
            w={w}
            hidden={hidden}
            busy={busy}
            save={async (action, data) => {
              await perform({
                action,
                workspaceId: w.id,
                expectedVersion: w.version,
                key: crypto.randomUUID(),
                ...data,
              });
            }}
          />
        </Dialog>
      )}
      {modal === "discard" && (
        <Dialog title="Discard this draft?" onClose={() => setModal("")}>
          <p>
            Your confirmed records stay intact. Copy any unsaved words you need
            first.
          </p>
          <Button
            onClick={async () => {
              if (pending || retryOperation) {
                setError("Check the unconfirmed action before discarding.");
                setModal("");
                return;
              }
              setText("");
              setEvents([]);
              setReplaceIds([]);
              setQuestions([]);
              await draftStorage("delete", owner, wid).catch((e) =>
                setError(e.message),
              );
              setModal("");
              setPage("today");
              setStatus("Draft discarded.");
            }}
          >
            Discard unsaved draft
          </Button>
        </Dialog>
      )}
      {modal === "deletion" && (
        <Dialog
          title="Request account-data deletion"
          onClose={() => setModal("")}
        >
          <p>
            This adds your request to the review list; it does not delete your
            records now. Some financial records may need to be kept by law. This
            development version does not yet have a team handling requests.
          </p>
          <Button
            primary
            onClick={() => simple("request", { kind: "deletion" })}
          >
            Record deletion request
          </Button>
        </Dialog>
      )}
      {modal === "logout" && (
        <Dialog title="Sign out of this device?" onClose={() => setModal("")}>
          <p>
            A complete draft file keeps edited records as well as your words.
            Keep the file private and restore it in the same account and
            workspace.
          </p>
          <Button onClick={downloadCompleteDraft}>
            Download complete draft
          </Button>
          <p>
            {text || events.length || pending
              ? "Some work has not been saved. Copy it first, or stay and finish it."
              : "Your saved records will be here when you sign in again."}
          </p>
          <div className={s.actions}>
            <Button
              onClick={() =>
                navigator.clipboard
                  .writeText(text)
                  .catch(() => setError("Select and copy the draft manually."))
              }
            >
              Copy draft
            </Button>
            <Button onClick={() => setModal("")}>Stay</Button>
            <Button
              primary
              onClick={async () => {
                if (pending || retryOperation) {
                  setError("Check the unconfirmed action before signing out.");
                  setModal("");
                  return;
                }
                try {
                  await clearDrafts();
                  if (!demo) await supabase().auth.signOut();
                  await fetch("/api/logout", { method: "POST" });
                  const channel = new BroadcastChannel("cashnarra-session");
                  channel.postMessage("signed-out");
                  channel.close();
                  setText("");
                  setEvents([]);
                  location.href = "/";
                } catch (e) {
                  setError((e as Error).message);
                }
              }}
            >
              Erase local drafts and sign out
            </Button>
          </div>
        </Dialog>
      )}
      {modal === "voice" && w && (
        <Dialog
          title="A short story, in your voice"
          onClose={() => setModal("")}
        >
          <VoiceCapture
            transcriptionEnabled={voice}
            workspaceId={w.id}
            onTranscript={(value) => {
              changeDraft(text ? text + " " + value : value);
              navigate("capture");
            }}
          />
          <Button onClick={() => navigate("capture")}>Type your story</Button>
        </Dialog>
      )}
      {modal === "export" && w && (
        <Dialog title="Export a private report" onClose={() => setModal("")}>
          <p>
            {from} to {to} · {w.name} · GHS. Includes amounts and references to
            the records behind them. Anyone you share the downloaded file with
            can pass it on.
          </p>
          <div className={s.actions}>
            {["csv", "pdf", "xlsx"].map((type) => (
              <Button
                key={type}
                onClick={async () => {
                  try {
                    const { downloadReport } = await import("@/lib/exports");
                    await downloadReport(
                      w,
                      from,
                      to,
                      type as "csv" | "pdf" | "xlsx",
                    );
                    setStatus("Private report downloaded.");
                  } catch (e) {
                    setError((e as Error).message);
                  }
                  setModal("");
                }}
              >
                {type.toUpperCase()}
              </Button>
            ))}
          </div>
        </Dialog>
      )}
    </>
  );
}
