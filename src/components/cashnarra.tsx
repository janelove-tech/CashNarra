"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  House,
  NotebookText,
  BookOpen,
  Target,
  Landmark,
  Wallet,
  Smartphone,
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
import ProfitReview from "./profit-review";
import RecordForm from "./record-form";
import BatchReview from "./batch-review";
import MoveForm from "./move-form";
import VoiceCapture from "./voice-capture";
import PeriodExplanation from "./period-explanation";
import ReportTrace from "./report-trace";
import WorkspaceTools from "./workspace-tools";
import DraftBackup from "./draft-backup";
import { draftBackup } from "@/lib/draft-backup";
import { debtDate } from "@/domain/planning";
import { calendarDate } from "@/domain/dates";
import {
  accountDraft,
  openingForSettlement,
  withSuggestions,
} from "@/domain/review-create";
import {
  exportChoiceFor,
  exportWindow,
  rangeLabel,
  readingDate,
  storyWindow,
  type ExportPreset,
  type ExportSpan,
  type StoryPeriod,
} from "@/domain/periods";
import { event, sample, unclearSample } from "@/domain/fixture";
import {
  accountBalance,
  applyBatch,
  labels,
  obligations,
  report,
} from "@/domain/ledger";
import { D, formatMoney, money, parseEntryAmount, sum } from "@/domain/money";
import { forecast } from "@/domain/goals";
import type {
  EventInput,
  RecordEvent,
  Workspace,
  WorkspaceSummary,
} from "@/domain/types";
import type { Extraction } from "@/server/ai";
import { clearDrafts, draftStorage, type Draft } from "@/lib/drafts";
import { exportFileTargets, type ExportScope } from "@/lib/export-targets";
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
    [receipt, setReceipt] = useState<{ page: string; message: string } | null>(
      null,
    ),
    [busy, setBusy] = useState(false),
    [hidden, setHidden] = useState(false),
    [theme, setTheme] = useState("light"),
    [modal, setModal] = useState(""),
    [date, setDate] = useState(new Date().toISOString().slice(0, 10)),
    [storyDate, setStoryDate] = useState(new Date().toISOString().slice(0, 10)),
    [period, setPeriod] = useState<StoryPeriod>("day"),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all"),
    [text, setText] = useState(""),
    [events, setEvents] = useState<EventInput[]>([]),
    [questions, setQuestions] = useState<Extraction["questions"]>([]),
    [calculations, setCalculations] = useState<Extraction["calculations"]>([]),
    [replaceIds, setReplaceIds] = useState<string[]>([]),
    [reason, setReason] = useState("Entered incorrectly"),
    [revision, setRevision] = useState(0),
    [editing, setEditing] = useState<EventInput | null>(null),
    [selected, setSelected] = useState<RecordEvent | null>(null),
    [persistent, setPersistent] = useState(false),
    [allowDuplicates, setAllowDuplicates] = useState(false),
    [needsFreshReview, setNeedsFreshReview] = useState(false),
    [voiceLeave, setVoiceLeave] = useState(false),
    [voiceWork, setVoiceWork] = useState(false),
    [accountFilter, setAccountFilter] = useState(""),
    [pending, setPending] = useState<Operation | null>(null),
    [goalId, setGoalId] = useState(""),
    [scenario, setScenario] = useState("600.00"),
    [accountId, setAccountId] = useState(""),
    [evidence, setEvidence] = useState<{ from: string; to: string } | null>(
      null,
    ),
    [retryOperation, setRetryOperation] = useState<Operation | null>(null);
  const revisionRef = useRef(0),
    draftReady = useRef(false),
    heading = useRef<HTMLHeadingElement>(null);
  const [spaceSummaries, setSpaceSummaries] = useState<WorkspaceSummary[]>([]);
  const loadRevision = useRef(0);
  const w = spaces.find((w) => w.id === wid);
  const goal = w?.goals.find((g) => g.id === goalId);
  const refresh = useCallback(async (target: string) => {
    const request = ++loadRevision.current;
    const res = await fetch("/api/workspaces?view=summaries", {
        cache: "no-store",
      }),
      data = await res.json();
    if (!res.ok) throw new Error(data.error);
    const selectedId = data.workspaces.some(
      (x: WorkspaceSummary) => x.id === target,
    )
      ? target
      : (data.workspaces[0]?.id ?? "");
    let selected: Workspace | null = null;
    if (selectedId) {
      const response = await fetch(
        `/api/workspaces?workspace=${encodeURIComponent(selectedId)}`,
        { cache: "no-store" },
      );
      const state = await response.json();
      if (!response.ok) throw new Error(state.error);
      selected = state.workspace;
    }
    if (request !== loadRevision.current) return data;
    setSpaceSummaries(data.workspaces);
    setSpaces(selected ? [selected] : []);
    setOwner(data.userId);
    setDemo(data.demo);
    setAi(data.aiEnabled);
    setVoice(data.voiceEnabled);
    setWid(selectedId);
    return data;
  }, []);
  useEffect(() => {
    Promise.resolve()
      .then(() => refresh(""))
      .then((data) => {
        if (data.demo) {
          setDate("2026-10-13");
          setStoryDate("2026-10-13");
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoaded(true));
    if ("serviceWorker" in navigator)
      navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, [refresh]);
  useEffect(() => {
    const channel = new BroadcastChannel("cashnarra-session");
    channel.onmessage = () => {
      loadRevision.current++;
      setSpaceSummaries([]);
      revisionRef.current++;
      setRevision(revisionRef.current);
      setSelected(null);
      setModal("");
      setQuestions([]);
      setCalculations([]);
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
          setQuestions(withSuggestions(d.questions ?? []));
          setCalculations(d.calculations ?? []);
          setNeedsFreshReview(
            d.questionsPreserved === false && d.events.length > 0,
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
      questions,
      calculations,
      questionsPreserved: true,
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
    questions,
    calculations,
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
      setCalculations([]);
    }
    setReceipt(null);
    setStatus(
      persistent
        ? "Draft pending device storage"
        : "Draft in this tab · not saved",
    );
  }
  function showReceipt(message: string, onPage = page) {
    setStatus("");
    setReceipt({ page: onPage, message });
  }
  function navigate(id: string) {
    setPage(id);
    setModal("");
    setError("");
    setReceipt((current) => (current && current.page !== id ? null : current));
    setStatus((current) => (current.startsWith("Saved") ? "" : current));
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
      if (res.status === 401) {
        const failure = new Error(
          "Sign in again to finish. This draft stays here until you sign in again.",
        ) as Error & { rejected?: boolean; session?: boolean };
        failure.session = true;
        throw failure;
      }
      if (!res.ok) {
        const failure = new Error(data.error) as Error & { rejected?: boolean };
        failure.rejected = data.outcome === "rejected";
        throw failure;
      }
      await refresh(
        operation.action === "create" ? wid : operation.workspaceId,
      );
      setRetryOperation(null);
      showReceipt("Saved. Your records have been updated.");
      return data.receipt;
    } catch (e) {
      if ((e as Error & { session?: boolean }).session) setRetryOperation(null);
      else if (!(e as Error & { rejected?: boolean }).rejected)
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
      if (res.status === 401)
        throw new Error(
          "Sign in again to finish. Your draft is still here.",
        );
      if (!res.ok) throw new Error(data.error);
      setEvents(data.events);
      setQuestions(data.questions);
      setCalculations(data.calculations ?? []);
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
      questions,
      calculations,
      questionsPreserved: true,
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
    showReceipt("Saved · records confirmed", "stories");
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
            questions,
            calculations,
            questionsPreserved: true,
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
        await refresh(wid).catch(() => {});
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
        await refresh(wid);
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
        await refresh(wid).catch(() => {});
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
  const today = new Date().toISOString().slice(0, 10);
  const dayLabel = date === today ? "Today" : readingDate(date);
  const view = storyWindow(storyDate, period, today);
  const dayReport = w ? report(w, date, date) : null;
  const storyReport =
    w && view.from && view.to ? report(w, view.from, view.to) : null;
  const laterRecords =
    w && view.futureFrom && view.futureTo
      ? w.records.filter(
          (record) =>
            !record.removed &&
            record.date >= view.futureFrom! &&
            record.date <= view.futureTo!,
        )
      : [];
  const exportRange = evidence
    ? evidence
    : view.from && view.to
      ? { from: view.from, to: view.to }
      : page === "records"
        ? { from: date, to: date }
        : null;
  const total = w ? report(w, "0001-01-01", "9999-12-31").total : null;
  const active =
    w?.records.filter((r) => !r.removed && !r.kind.startsWith("opening_")) ??
    [];
  const filtered = active
    .filter(
      (r) => !evidence || (r.date >= evidence.from && r.date <= evidence.to),
    )
    .filter(
      (r) =>
        (accountFilter === "" ||
          r.accountId === accountFilter ||
          r.toAccountId === accountFilter) &&
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
        pendingAmount={
          draft && !record.amount
            ? calculations?.find(
                (c) => c.recordId === record.id && c.options.length === 1,
              )?.options[0]?.amount
            : undefined
        }
        account={
          hidden
            ? undefined
            : w?.accounts.find((a) => a.id === record.accountId)?.name
        }
        workspaceType={w?.type}
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
          <Icon size={20} aria-hidden />
          {mobile && id === "stories" ? "Stories" : label}
        </button>
      ))}
      {!mobile && (
        <>
          <hr />
          <button className={s.navLink} onClick={() => navigate("accounts")}>
            <Landmark size={20} aria-hidden />
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
          Explore with sample data
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
                  : "/brand/cashnarra-logo.svg"
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
              {page === "settings"
                ? "Settings"
                : (nav.find((n) => n.id === page)?.label ?? "Your story")}
            </div>
            <Link className={s.mobileLogo} href="/">
              <img
                className={s.logo}
                src={
                  theme === "dark"
                    ? "/brand/cashnarra-lockup-reversed.svg"
                    : "/brand/cashnarra-logo.svg"
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
                <span className={s.badge}>
                  {(w?.name ?? "Workspace")
                    .split(/\s+/)
                    .map((part) => part[0] ?? "")
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </button>
            </div>
          </header>
          <main id="main" className={s.content}>
            <div role="status" aria-live="polite">
              {receipt?.page === page && (
                <p className={s.status}>{receipt.message}</p>
              )}
              {status && (
                <p className={status.startsWith("Saved") ? s.status : s.notice}>
                  {status}
                </p>
              )}
            </div>
            {error && (
              <p role="alert" className={`${s.notice} ${s.error}`}>
                {error}
                {/marked for/i.test(error) && (
                  <>
                    {" "}
                    <Button
                      onClick={() => {
                        navigate("plan");
                      }}
                    >
                      Adjust goal marks
                    </Button>
                  </>
                )}
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
                      showReceipt("Saved · original action receipt confirmed");
                    } catch {}
                  }}
                >
                  Recover original action
                </Button>
              </div>
            )}
            {!w ? (
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
                  } catch {}
                }}
              >
                <h1>Which money are you recording?</h1>
                <p>
                  Business and personal records stay separate. You can tell
                  the first story as soon as this space exists.
                </p>
                <fieldset className={s.choiceSet}>
                  <legend>Which money is this?</legend>
                  <label className={s.checkLabel}>
                    <input
                      type="radio"
                      name="type"
                      value="Business"
                      defaultChecked
                      required
                    />
                    Business money
                  </label>
                  <label className={s.checkLabel}>
                    <input type="radio" name="type" value="Personal" />
                    Personal money
                  </label>
                </fieldset>
                <label htmlFor="first-space-name">
                  What should we call this space?
                </label>
                <input
                  id="first-space-name"
                  name="name"
                  maxLength={100}
                  required
                  autoComplete="organization"
                />
                <p>
                  For example, My shop or Personal. Add the account when you
                  record something. If you do not know the opening amount, it
                  stays unknown.
                </p>
                <Button primary type="submit" disabled={busy}>
                  Continue to my first record
                </Button>
              </form>
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
                      <label htmlFor="today-story">Your money story</label>
                      <textarea
                        id="today-story"
                        className={s.capture}
                        value={text}
                        maxLength={12000}
                        disabled={!!pending || busy}
                        placeholder="I sold 900 cash, paid for delivery, and Abena paid part of her balance…"
                        onChange={(e) => changeDraft(e.target.value)}
                      />
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
                        {voice
                          ? "Transcription is available. You review the words before anything is saved."
                          : "Transcription is not available yet. Type here, or record and type the words yourself."}
                      </small>
                      <small>
                        You review the records before they’re saved.
                      </small>
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
                          setEvidence({ from: date, to: date });
                          navigate("records");
                        }}
                      >
                        <small>Money in · {dayLabel}</small>
                        <Amount value={dayReport!.received} hidden={hidden} />
                        <small>Including old-balance payments</small>
                      </button>
                      <button
                        className={s.balanceStat}
                        onClick={() => {
                          setFilter("out");
                          setEvidence({ from: date, to: date });
                          navigate("records");
                        }}
                      >
                        <small>Money out · {dayLabel}</small>
                        <Amount value={dayReport!.paid} hidden={hidden} />
                        <small>Transfers between accounts excluded</small>
                      </button>
                    </div>
                    <div className={s.homeGrid}>
                      <section>
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
                            ["Money in", dayReport!.received],
                            ["Money out", dayReport!.paid],
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
                                            (D(dayReport!.received).gte(
                                              dayReport!.paid,
                                            )
                                              ? D(dayReport!.received)
                                              : D(dayReport!.paid)
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
                            {dayLabel}. Money in minus money out:{" "}
                            <Amount value={dayReport!.net} hidden={hidden} />.
                            This is
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
                              days you checked in
                            </p>
                            <small>
                              Anything else to add? A check-in only marks the
                              day you looked. You can catch up on another day
                              whenever you remember it.
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
                            <small> marked for this goal, not moved</small>
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
                        questions,
                        calculations,
                        questionsPreserved: true,
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
                        setQuestions(withSuggestions(d.questions ?? []));
                        setCalculations(d.calculations ?? []);
                        setNeedsFreshReview(
                          d.questionsPreserved === false && d.events.length > 0,
                        );
                        setStatus(
                          d.questionsPreserved === false && d.events.length
                            ? "Draft restored. This older backup did not keep unanswered questions, so check every record before saving."
                            : "Draft restored. Check the words and records before saving.",
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
                        This demo can read the two sample stories.
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
                  <BatchReview
                    heading={heading}
                    questions={questions}
                    calculations={calculations}
                    confirmCalculation={(id, amount, note) => {
                      if (pending) return;
                      if (text.length + note.length + 32 > 12000) {
                        setError(
                          "Shorten your story a little so we can keep the calculation with it.",
                        );
                        return;
                      }
                      changeDraft();
                      const recordedOn = calculations?.find(
                        (c) => c.recordId === id,
                      )?.recordedOn;
                      setEvents((prev) =>
                        prev.map((e) =>
                          e.id === id
                            ? { ...e, amount, date: recordedOn || e.date }
                            : e,
                        ),
                      );
                      setQuestions((prev) =>
                        prev.filter(
                          (q) => q.recordId !== id || q.field !== "amount",
                        ),
                      );
                      setText(
                        (prev) =>
                          prev.trimEnd() + "\n\nConfirmed with your records:\n" + note,
                      );
                    }}
                    events={events}
                    replaceIds={replaceIds}
                    reason={reason}
                    pending={!!pending}
                    busy={busy}
                    hidden={hidden}
                    text={text}
                    w={w}
                    allowDuplicates={allowDuplicates}
                    recordRows={rows(events, true)}
                    manual={manual}
                    needsFreshReview={needsFreshReview}
                    acceptFreshReview={() => setNeedsFreshReview(false)}
                    onCreateAccount={(recordId, field, input) => {
                      if (pending) return;
                      let account;
                      try {
                        account = accountDraft({
                          ...input,
                          existingNames: w.accounts.map((item) => item.name),
                        });
                      } catch (e) {
                        setError((e as Error).message);
                        return;
                      }
                      const id = crypto.randomUUID();
                      void perform({
                        action: "account",
                        workspaceId: w.id,
                        expectedVersion: w.version,
                        key: crypto.randomUUID(),
                        account: { id, ...account },
                      })
                        .then(() => {
                          changeDraft();
                          setEvents((prev) =>
                            prev.map((item) =>
                              item.id === recordId
                                ? { ...item, [field]: id }
                                : item,
                            ),
                          );
                          setQuestions((prev) =>
                            prev.filter(
                              (q) => q.recordId !== recordId || q.field !== field,
                            ),
                          );
                        })
                        .catch(() => {});
                    }}
                    onCreateBalance={(recordId, input) => {
                      if (pending) return;
                      const payment = events.find((item) => item.id === recordId);
                      if (!payment) return;
                      let opening;
                      try {
                        opening = openingForSettlement(payment, input);
                      } catch (e) {
                        setError((e as Error).message);
                        return;
                      }
                      changeDraft();
                      setEvents((prev) => [
                        ...prev.map((item) =>
                          item.id === recordId
                            ? {
                                ...item,
                                obligationId: opening.id,
                                party: opening.party,
                              }
                            : item,
                        ),
                        opening,
                      ]);
                      setQuestions((prev) =>
                        prev.filter(
                          (q) =>
                            q.recordId !== recordId || q.field !== "obligationId",
                        ),
                      );
                    }}
                    onAnswer={(recordId, field, patch, note) => {
                      if (pending) return;
                      let next = patch;
                      if (patch.amount !== undefined) {
                        try {
                          next = {
                            ...patch,
                            amount: money(parseEntryAmount(patch.amount), true),
                          };
                        } catch (e) {
                          setError((e as Error).message);
                          return;
                        }
                      }
                      if (note && text.length + note.length + 8 > 12000) {
                        setError(
                          "Shorten your story a little so we can keep this answer with it.",
                        );
                        return;
                      }
                      changeDraft();
                      setEvents((prev) =>
                        prev.map((item) =>
                          item.id === recordId ? { ...item, ...next } : item,
                        ),
                      );
                      setQuestions((prev) =>
                        prev.filter((q) => {
                          if (q.recordId !== recordId) return true;
                          if (q.field === field) return false;
                          if (next.accountId === null && q.field === "accountId")
                            return false;
                          return true;
                        }),
                      );
                      if (note)
                        setText((prev) => prev.trimEnd() + "\n\n" + note);
                    }}
                    setReason={setReason}
                    changeDraft={changeDraft}
                    setAllowDuplicates={setAllowDuplicates}
                    recover={recover}
                    saveBatch={saveBatch}
                    onBack={() => navigate("capture")}
                    onDiscard={() => setModal("discard")}
                  />
                )}
                {page === "records" && (
                  <>
                    <div className={s.pageHead}>
                      <div>
                        <h1 ref={heading} tabIndex={-1}>
                          Your records
                        </h1>
                        <p>Find, review or correct a saved record.</p>
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
                        aria-label="Filter by account"
                        value={accountFilter}
                        onChange={(e) => setAccountFilter(e.target.value)}
                      >
                        <option value="">All accounts</option>
                        {w.accounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.name}
                          </option>
                        ))}
                      </select>
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
                      {(search || filter !== "all" || accountFilter || evidence) && (
                        <Button
                          onClick={() => {
                            setSearch("");
                            setFilter("all");
                            setAccountFilter("");
                            setEvidence(null);
                          }}
                        >
                          Reset filters
                        </Button>
                      )}
                    </div>
                    {evidence && (
                      <p>
                        Showing {rangeLabel(evidence.from, evidence.to)}.{" "}
                        <Button onClick={() => setEvidence(null)}>
                          Show all dates
                        </Button>
                      </p>
                    )}
                    {Object.entries(
                      filtered.reduce<Record<string, typeof filtered>>(
                        (groups, record) => {
                          (groups[record.date] ??= []).push(record);
                          return groups;
                        },
                        {},
                      ),
                    )
                      .sort(([left], [right]) => right.localeCompare(left))
                      .map(([day, records]) => (
                        <section key={day}>
                          <h2>
                            {day === today
                              ? `Today · ${readingDate(day)}`
                              : readingDate(day)}
                          </h2>
                          {rows(records)}
                        </section>
                      ))}
                    {!filtered.length && (
                      <p className={s.empty}>
                        {search || filter !== "all" || accountFilter || evidence
                          ? "No records match these filters. Try another date or clear the filters."
                          : "No records in this workspace yet. Missing activity is not treated as zero."}
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
                      <h2>People & balances</h2>
                      <p>People owe you, and amounts you owe.</p>
                      <Button onClick={() => setModal("workspace-tools")}>
                        Add a person or a due date
                      </Button>
                      {!obligations(w).some((o) => D(o.remaining).gt(0)) && (
                        <p>Nothing is still owed.</p>
                      )}
                      {obligations(w)
                        .filter((o) => D(o.remaining).gt(0))
                        .map((o) => (
                        <div className={s.settingsRow} key={o.id}>
                          <div>
                            <strong>
                              {hidden
                                ? "Name hidden"
                                : o.party.replace(/\s*(?:\.{3}|…)+$/u, "")}
                            </strong>
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
                              "Balance from before CashNarra",
                              null,
                              { date },
                            ),
                          )
                        }
                      >
                        Add a balance from before CashNarra
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
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            value === "day" ||
                            value === "week" ||
                            value === "month"
                          )
                            setPeriod(value);
                        }}
                      >
                        <option value="day">Daily</option>
                        <option value="week">Weekly</option>
                        <option value="month">Monthly</option>
                      </select>
                      <input
                        aria-label="Story date"
                        type="date"
                        value={storyDate}
                        onChange={(e) => {
                          if (calendarDate(e.target.value))
                            setStoryDate(e.target.value);
                        }}
                      />
                    </div>
                    <section className={s.storyCover}>
                      <small>
                        {hidden ? "Workspace" : w.name} · {view.heading} · GHS
                      </small>
                      {storyReport ? (
                        <>
                          <h2>Here’s what moved this period.</h2>
                          <div className={s.movement}>
                            <div data-metric="received">
                              <span>Money received</span>
                              <Amount
                                value={storyReport.received}
                                hidden={hidden}
                              />
                            </div>
                            <div data-metric="paid">
                              <span>Money paid out</span>
                              <Amount value={storyReport.paid} hidden={hidden} />
                            </div>
                            <div
                              data-metric="net"
                              data-sign={
                                D(storyReport.net).isNegative()
                                  ? "out"
                                  : D(storyReport.net).isZero()
                                    ? "even"
                                    : "in"
                              }
                            >
                              <span>Net movement</span>
                              <Amount value={storyReport.net} hidden={hidden} />
                            </div>
                          </div>
                          <p>
                            Based on{" "}
                            {
                              storyReport.records.filter(
                                (x) => !x.kind.startsWith("opening_"),
                              ).length
                            }{" "}
                            saved records. Unrecorded activity may be missing.
                            Net movement is money received minus money paid out.
                            It is not profit.
                          </p>
                        </>
                      ) : (
                        <>
                          <h2>These dates have not arrived.</h2>
                          <p>
                            Saved records with these dates are listed below.
                            They are not treated as money already received or
                            owed.
                          </p>
                        </>
                      )}
                      <small>
                        Based on what you have entered. Unrecorded days may
                        still have activity.
                      </small>
                    </section>
                    {storyReport && (
                      <section className={s.chapter}>
                        <h2>What this period shows</h2>
                        <p>
                          Money in minus money out was{" "}
                          <Amount value={storyReport.net} hidden={hidden} />.
                        </p>
                        <ul>
                          {storyReport.records
                            .filter((record) =>
                              [
                                "expense",
                                "stock",
                                "asset",
                                "owner_out",
                                "interest",
                                "payable_payment",
                                "loan_principal",
                              ].includes(record.kind),
                            )
                            .sort((left, right) =>
                              D(right.amount).cmp(D(left.amount)),
                            )
                            .slice(0, 3)
                            .map((record) => (
                              <li key={record.id}>
                                {record.description}:{" "}
                                <Amount value={record.amount} hidden={hidden} />
                              </li>
                            ))}
                        </ul>
                        <p>
                          {storyReport.records.some(
                            (record) => record.kind === "credit_sale",
                          ) ? (
                            <>
                              Unpaid sales in this period:{" "}
                              <Amount
                                value={sum(
                                  storyReport.records
                                    .filter(
                                      (record) => record.kind === "credit_sale",
                                    )
                                    .map((record) => record.amount),
                                )}
                                hidden={hidden}
                              />
                              .{" "}
                            </>
                          ) : (
                            "No unpaid sales are recorded in this period. "
                          )}
                          Still owed through this date:{" "}
                          <Amount value={storyReport.userOwes} hidden={hidden} />
                          .
                        </p>
                      </section>
                    )}
                    {storyReport && (
                      <section className={s.chapter}>
                        <h2>Supporting records</h2>
                        <Button
                          onClick={() => {
                            setFilter("in");
                            setEvidence({
                              from: view.from!,
                              to: view.to!,
                            });
                            navigate("records");
                          }}
                        >
                          See money received
                        </Button>
                        <Button
                          onClick={() => {
                            setFilter("out");
                            setEvidence({
                              from: view.from!,
                              to: view.to!,
                            });
                            navigate("records");
                          }}
                        >
                          See money paid out
                        </Button>
                        <details>
                          <summary>How we worked this out</summary>
                          <p>
                            {storyReport.exclusions} Workspace version{" "}
                            {storyReport.version}; period{" "}
                            {rangeLabel(view.from!, view.to!)}; Africa/Accra.
                          </p>
                          {rows(storyReport.records)}
                        </details>
                      </section>
                    )}
                    {storyReport && (
                      <section className={s.chapter}>
                        <h2>Sales and money received</h2>
                        <p>
                          Sales value:{" "}
                          <Amount
                            value={storyReport.sales}
                            hidden={hidden}
                            onInspect={() => setModal("trace")}
                          />
                          . This includes credit sales. Old-balance payments,
                          loans and owner money are separate from sales.
                        </p>
                        <div className={s.metrics}>
                          <div>
                            <small>{view.peopleOweLabel}</small>
                            <Amount
                              value={storyReport.peopleOwe}
                              hidden={hidden}
                              onInspect={() => setModal("trace")}
                            />
                          </div>
                          <div>
                            <small>{view.oweLabel}</small>
                            <Amount
                              value={storyReport.userOwes}
                              hidden={hidden}
                              onInspect={() => setModal("trace")}
                            />
                          </div>
                        </div>
                        {view.status === "so-far" && (
                          <div>
                            <h3>Recorded for later dates</h3>
                            {laterRecords.length ? (
                              rows(laterRecords)
                            ) : (
                              <p>
                                No saved records are dated after{" "}
                                {readingDate(view.to!)} in this period.
                              </p>
                            )}
                          </div>
                        )}
                        {obligations(w)
                          .filter(
                            (o) =>
                              D(o.remaining).gt(0) && o.date > view.nominalTo,
                          )
                          .map((o) => (
                            <p key={o.id}>
                              {hidden
                                ? "A balance"
                                : o.party.replace(/\s*(?:\.{3}|…)+$/u, "")}{" "}
                              · <Amount value={o.remaining} hidden={hidden} /> is
                              recorded on {readingDate(o.date)}, after{" "}
                              {readingDate(view.nominalTo)}. It is not included
                              in the totals above.
                            </p>
                          ))}
                        <Button onClick={() => navigate("records")}>
                          See what’s still owed
                        </Button>
                      </section>
                    )}
                    {!storyReport && (
                      <section className={s.chapter}>
                        <h2>Recorded for later dates</h2>
                        {laterRecords.length ? (
                          rows(laterRecords)
                        ) : (
                          <p>No saved records use these dates.</p>
                        )}
                      </section>
                    )}
                    {storyReport && (
                      <section className={s.chapter}>
                        <h2>What these numbers are not</h2>
                        {ai && (
                          <PeriodExplanation
                            key={w.id + view.from + view.to + w.version}
                            workspaceId={w.id}
                            from={view.from!}
                            to={view.to!}
                            onRecord={(id) => {
                              setSelected(
                                w.records.find((r) => r.id === id) ?? null,
                              );
                              setModal("detail");
                            }}
                          />
                        )}
                        <p>
                          {view.balanceLabel}:{" "}
                          <Amount
                            value={storyReport.total}
                            hidden={hidden}
                            onInspect={() => setModal("trace")}
                          />
                          . Starting balances plus later records through this
                          date. Not checked against your bank or MoMo.
                        </p>
                        <p>
                          {w.type === "Business"
                            ? "Money in minus money out is not profit. Profit stays unknown until you review the cost of what was sold and anything else the records do not contain."
                            : "This personal workspace does not calculate profit. It shows money in, money out and what is still owed."}
                        </p>
                        {w.type === "Business" && view.from && view.to && (
                          <Button onClick={() => setModal("profit")}>
                            Review profit or loss
                          </Button>
                        )}
                        <Button onClick={() => navigate("accounts")}>
                          See how this balance adds up
                        </Button>
                        <Button onClick={() => setModal("checkin")}>
                          Review this period’s activity
                        </Button>
                      </section>
                    )}
                  </>
                )}
                {page === "accounts" && (
                  <>
                    <div className={s.pageHead}>
                      <div>
                        <h1 ref={heading} tabIndex={-1}>
                          Your recorded accounts
                        </h1>
                        <p>
                          Balances based on what you’ve entered—not linked to
                          your bank or MoMo.
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
                          <span className={s.accountMark}>
                            {a.type === "Cash" ? (
                              <Wallet size={20} aria-hidden />
                            ) : a.type === "MoMo" ? (
                              <Smartphone size={20} aria-hidden />
                            ) : (
                              <Landmark size={20} aria-hidden />
                            )}
                            <span>{a.type}</span>
                          </span>
                          <h2 style={{ marginTop: 12 }}>
                            {hidden ? "Account" : a.name}
                          </h2>
                          <Amount
                            value={accountBalance(w, a.id)}
                            hidden={hidden}
                            large
                          />
                          <p>
                            {a.opening === null
                              ? "Opening amount unknown"
                              : "Opening recorded"}
                            {" · "}
                            Manually tracked · GHS
                          </p>
                          <details>
                            <summary>
                              Starting balance and later records
                            </summary>
                            <p>
                              Starting balance on {a.openingDate}:{" "}
                              <Amount value={a.opening} hidden={hidden} />
                            </p>
                            {a.opening !== null && (
                              <Button
                                onClick={() => {
                                  setAccountId(a.id);
                                  setModal("opening");
                                }}
                              >
                                Check starting balance
                              </Button>
                            )}
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
                              setAccountFilter(a.id);
                              setFilter("all");
                              setEvidence(null);
                              navigate("records");
                            }}
                          >
                            View activity
                          </Button>
                          {a.opening === null && (
                            <Button
                              onClick={() => {
                                setAccountId(a.id);
                                setModal("opening");
                              }}
                            >
                              Check starting balance
                            </Button>
                          )}
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
                          Your goals
                        </h1>
                        <p>
                          Mark money you have set aside. A mark does not move
                          or reserve money.
                        </p>
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
                      const remaining = D(g.target).minus(f.assigned);
                      const percent = D(g.target).eq(0)
                        ? "0.0"
                        : D(f.assigned).div(g.target).mul(100).toFixed(1);
                      return (
                        <div className={s.goalGrid} key={g.id}>
                          <section className={s.panel}>
                            <span className={s.badge}>
                              Tracked here, not moved
                            </span>
                            <h2 style={{ marginTop: 18 }}>{g.name}</h2>
                            <small>Money you've set aside in CashNarra</small>
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
                              {hidden ? "" : ` · ${percent}%`}
                            </p>
                            <p>
                              {remaining.lte(0)
                                ? "The marked amount has reached the target."
                                : <>
                                    Remaining{" "}
                                    <Amount
                                      value={remaining.toFixed(2)}
                                      hidden={hidden}
                                    />
                                    .
                                  </>}
                            </p>
                            <p>
                              This does not move or reserve money in your bank
                              or MoMo.
                            </p>
                            <progress
                              aria-label={`${g.name} progress`}
                              max={100}
                              value={
                                hidden
                                  ? 0
                                  : D(percent).clamp(0, 100).toNumber()
                              }
                            />
                            <div className={s.actions}>
                              <Button
                                primary
                                onClick={() => {
                                  setGoalId(g.id);
                                  setModal("allocation");
                                }}
                              >
                                Assign money
                              </Button>
                              <Button
                                onClick={() => {
                                  setGoalId(g.id);
                                  setModal("scenario");
                                }}
                              >
                                Try a monthly amount
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
                            <small>If you keep adding money at this pace</small>
                            <h3 style={{ marginTop: 10 }}>
                              {f.count === null
                                ? f.reason.startsWith("Check the last three")
                                  ? "A pace estimate needs three reviewed full months."
                                  : "No pace estimate from these marks"
                                : f.count === 0
                                  ? "You’ve reached this goal"
                                  : `About ${f.count} months at this pace`}
                            </h3>
                            {f.period && (
                              <p>
                                Around {f.period} at{" "}
                                <Amount value={f.pace} hidden={hidden} /> per
                                month.
                              </p>
                            )}
                            <p>{f.reason}</p>
                            <details>
                              <summary>How we worked this out</summary>
                              <p>
                                Your money stays in your account. This estimate
                                starts on{" "}
                                {new Date(
                                  date + "T12:00:00Z",
                                ).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  timeZone: "UTC",
                                })}{" "}
                                and assumes you add money each month towards the
                                same target.
                              </p>
                              <p>
                                It leaves out withdrawals, interest, fees,
                                returns and price changes. Money marked for a
                                goal is not locked away by your bank or MoMo
                                provider.
                              </p>
                            </details>
                            <details>
                              <summary>
                                Money you’ve put towards this goal
                              </summary>
                              {g.allocations.map((a) => (
                                <p key={a.id}>
                                  {new Date(
                                    a.date + "T12:00:00Z",
                                  ).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    timeZone: "UTC",
                                  })}{" "}
                                  · <Amount value={a.amount} hidden={hidden} />
                                </p>
                              ))}
                            </details>
                          </section>
                        </div>
                      );
                    })}
                  </>
                )}
                {page === "settings" && (
                  <>
                    <h1 ref={heading} tabIndex={-1}>
                      Settings
                    </h1>
                    <p>Appearance, drafts, and your data.</p>
                    <section className={s.settingsGroup}>
                      <h2>Appearance</h2>
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
                          <p>
                            Hides amounts on this screen only. It does not
                            encrypt or delete them.
                          </p>
                        </div>
                        <Button onClick={() => setHidden(!hidden)}>
                          {hidden ? "Show amounts" : "Hide amounts"}
                        </Button>
                      </div>
                    </section>
                    <section className={s.settingsGroup}>
                      <h2>Recording and drafts</h2>
                      <div className={s.settingsRow}>
                        <div>
                          <strong>Shared device</strong>
                          <p>
                            {persistent
                              ? "Keep unfinished stories on this device."
                              : "Unfinished stories are not kept on this device."}{" "}
                            Turning this on clears stored drafts. Saved records
                            stay.
                          </p>
                        </div>
                        <Button onClick={() => setModal("shared-device")}>
                          Use shared-device mode
                        </Button>
                      </div>
                      <div className={s.settingsRow}>
                        <div>
                          <strong>How long to keep your original words</strong>
                          <p>
                            Your saved amounts and correction history are kept
                            separately. Removing the words now is a separate
                            action.
                          </p>
                        </div>
                        <select
                          aria-label="Narration retention"
                          value={w.retentionDays}
                          onChange={(e) =>
                            simple("retention", { days: Number(e.target.value) })
                          }
                        >
                          {w.retentionDays === 0 && (
                            <option value={0}>
                              Original words already removed
                            </option>
                          )}
                          <option value={30}>30 days</option>
                          <option value={7}>7 days</option>
                        </select>
                        <Button onClick={() => setModal("retention-now")}>
                          Remove original words now
                        </Button>
                      </div>
                    </section>
                    <section className={s.settingsGroup}>
                      <h2>Review rhythm</h2>
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
                    </section>
                    <section className={s.settingsGroup}>
                      <h2>People, due dates and goals</h2>
                      <div className={s.settingsRow}>
                        <div>
                          <strong>People, due dates and goals</strong>
                          <p>
                            Names you reuse, when a balance is due, and the
                            months you have checked for a goal.
                          </p>
                        </div>
                        <Button onClick={() => setModal("workspace-tools")}>
                          Edit people and dates
                        </Button>
                      </div>
                    </section>
                    <section className={s.settingsGroup}>
                      <h2>Your data</h2>
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
                          Request a copy of my data
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
          {spaceSummaries.map((x) => (
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
                void refresh(x.id)
                  .then(() => navigate("today"))
                  .catch((e) => setError(e.message));
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
            <label htmlFor="opening">Starting amount · GHS</label>
            <input
              id="opening"
              name="amount"
              inputMode="decimal"
              placeholder="Enter a known starting amount"
            />
            <label className={s.checkLabel}>
              <input type="checkbox" name="unknown" defaultChecked />I don’t
              know the starting balance yet
            </label>
            <label htmlFor="opening-date">Starting date</label>
            <input
              id="opening-date"
              name="date"
              type="date"
              defaultValue={date}
              required
            />
            <p>Choose a date before the activity you want to record.</p>
            <Button primary type="submit" disabled={busy}>
              Add account
            </Button>
          </form>
        </Dialog>
      )}
      {modal === "trace" && w && view.from && view.to && (
        <Dialog title="Behind these figures" onClose={() => setModal("")}>
          <ReportTrace
            workspace={w}
            from={view.from}
            to={view.to}
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
            spaces={spaceSummaries}
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
          title="Check your starting balance"
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
              This changes the starting balance you entered for{" "}
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
              Save starting balance
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
              You can mark money for this goal later. It will stay in your
              account.
            </p>
            <Button primary type="submit" disabled={busy}>
              Create goal
            </Button>
          </form>
        </Dialog>
      )}
      {modal === "allocation" && goal && w && (
        <Dialog
          title={`Mark money · ${goal.name}`}
          onClose={() => setModal("")}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              try {
                const parsed = money(
                  parseEntryAmount(String(f.get("amount"))),
                  true,
                );
                simple("allocation", {
                  goalId: goal.id,
                  amount:
                    f.get("direction") === "take"
                      ? D(parsed).neg().toFixed(2)
                      : parsed,
                  date: f.get("date"),
                });
              } catch (err) {
                setError((err as Error).message);
              }
            }}
          >
            <label htmlFor="allocation-direction">What should this mark do?</label>
            <select id="allocation-direction" name="direction" defaultValue="put">
              <option value="put">Put towards this goal</option>
              <option value="take">Take off this goal</option>
            </select>
            <label htmlFor="allocation">Amount · GHS</label>
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
              {(() => {
                const account = w.accounts.find(
                  (item) => item.id === goal.accountId,
                );
                const available = account
                  ? accountBalance(w, account.id)
                  : null;
                const markedHere = sum(goal.allocations.map((item) => item.amount));
                const markedElsewhere = sum(
                  w.goals
                    .filter(
                      (item) =>
                        item.id !== goal.id &&
                        item.accountId === goal.accountId,
                    )
                    .flatMap((item) =>
                      item.allocations.map((entry) => entry.amount),
                    ),
                );
                return `${account?.name ?? "This account"} has ${
                  available === null ? "an unknown balance" : formatMoney(available)
                }. ${formatMoney(markedHere)} is already marked for this goal, and ${formatMoney(markedElsewhere)} is marked for other goals on the same account. A mark is a note. It does not move money or protect savings at the bank.`;
              })()}
            </p>
            <Button primary type="submit" disabled={busy}>
              Save mark
            </Button>
          </form>
        </Dialog>
      )}
      {modal === "goal-review" && goal && (
        <Dialog title="Review a month for this goal" onClose={() => setModal("")}>
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
              Month checked, even if you added no money
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
            <details>
              <summary>How this affects the estimate</summary>
              <p>
                Review means you have checked the whole month, including quiet
                days. Leave a month unchecked if you are still missing
                information.
              </p>
              <ol>
                <li>
                  Check Records for missing activity, mistakes and repeated
                  entries.
                </li>
                <li>
                  Check the money you marked for this goal. Marking nothing is
                  different from not knowing.
                </li>
                <li>
                  Check unpaid balances and other payments you need to make
                  before setting more money aside.
                </li>
              </ol>
              <p>
                CashNarra uses the middle amount from the last three full
                months you checked. It cannot confirm that your records are
                complete or that you can afford the next amounts.
              </p>
              <p>
                Missing months are not zero. This confirms review, not
                affordability.
              </p>
            </details>
            <Button primary type="submit" disabled={busy}>
              Record review
            </Button>
          </form>
        </Dialog>
      )}
      {modal === "scenario" && goal && (
        <Dialog
          title="What if you added a little more?"
          onClose={() => setModal("")}
        >
          <span className={s.badge}>
            Just a try · your saved records stay as they are
          </span>
          <label htmlFor="scenario">Monthly amount to try · GHS</label>
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
                      ? "No date yet"
                      : `About ${f.count} months`}
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
              Anything else to add? I’m done for today is optional. You can
              catch up on another day later. A check-in does not mean your
              finances are complete.
            </p>
            <Button primary type="submit">
              Record check-in
            </Button>
          </form>
        </Dialog>
      )}
      {modal === "workspace-tools" && w && (
        <Dialog
          title="People, due dates and goals"
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
      {modal === "shared-device" && (
        <Dialog
          title="Clear drafts on this device?"
          onClose={() => setModal("")}
        >
          <p>
            Shared-device mode stops keeping unfinished stories on this device
            and clears the ones already stored here. Saved records stay.
          </p>
          <div className={s.actions}>
            <Button onClick={() => setModal("")}>Stay</Button>
            <Button
              primary
              onClick={async () => {
                setPersistent(false);
                await clearDrafts()
                  .then(() =>
                    setStatus("Shared-device mode. Stored drafts cleared."),
                  )
                  .catch((e) => setError(e.message));
                setModal("");
              }}
            >
              Clear drafts and use shared-device mode
            </Button>
          </div>
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
              disabled={busy}
              onClick={async () => {
                if (pending || retryOperation) {
                  setError("Check the unconfirmed action before signing out.");
                  setModal("");
                  return;
                }
                setBusy(true);
                try {
                  if (!demo) {
                    const { error: signOutError } = await supabase().auth.signOut();
                    if (signOutError) throw signOutError;
                  }
                  const response = await fetch("/api/logout", { method: "POST" });
                  if (!response.ok)
                    throw new Error(
                      "Sign-out did not finish. You are still signed in. Try again.",
                    );
                  await clearDrafts();
                  const channel = new BroadcastChannel("cashnarra-session");
                  channel.postMessage("signed-out");
                  channel.close();
                  setText("");
                  setEvents([]);
                  location.href = "/";
                } catch (e) {
                  setError(
                    (e as Error).message ||
                      "Sign-out did not finish. Your unfinished story is still on this device.",
                  );
                } finally {
                  setBusy(false);
                }
              }}
            >
              Sign out
            </Button>
          </div>
        </Dialog>
      )}
      {modal === "voice" && w && (
        <Dialog
          title="A short story, in your voice"
          onClose={() => {
            if (voiceWork) setVoiceLeave(true);
            else {
              setVoiceLeave(false);
              setModal("");
            }
          }}
        >
          <VoiceCapture
            transcriptionEnabled={voice}
            workspaceId={w.id}
            onWork={setVoiceWork}
            onTranscript={(value) => {
              changeDraft(text ? text + " " + value : value);
              setVoiceWork(false);
              setVoiceLeave(false);
              navigate("capture");
            }}
          />
          {voiceLeave && (
            <div className={s.notice}>
              <p>
                This recording or the words you typed are still here. Closing
                now discards them.
              </p>
              <div className={s.actions}>
                <Button onClick={() => setVoiceLeave(false)}>
                  Keep working
                </Button>
                <Button
                  onClick={() => {
                    setVoiceLeave(false);
                    setVoiceWork(false);
                    setModal("");
                  }}
                >
                  Discard and close
                </Button>
              </div>
            </div>
          )}
          <Button
            onClick={() => {
              if (voiceWork) setVoiceLeave(true);
              else navigate("capture");
            }}
          >
            Type your story
          </Button>
        </Dialog>
      )}
      {modal === "retention-now" && (
        <Dialog
          title="Remove the original words now?"
          onClose={() => setModal("")}
        >
          <p>
            This removes the saved narration in this workspace. The financial
            records and correction history stay. You can cancel and keep the
            words.
          </p>
          <div className={s.actions}>
            <Button onClick={() => setModal("")}>Cancel</Button>
            <Button
              primary
              disabled={busy}
              onClick={() => simple("retention", { days: 0 })}
            >
              Remove original words now
            </Button>
          </div>
        </Dialog>
      )}
      {modal === "profit" && w && view.from && view.to && (
        <Dialog title="Profit or loss" wide onClose={() => setModal("")}>
          <ProfitReview
            workspace={w}
            from={view.from}
            to={view.to}
            today={today}
            hidden={hidden}
            onClose={() => setModal("")}
          />
        </Dialog>
      )}
      {modal === "export" && w && (
        <ExportDialog
          workspace={w}
          summaries={spaceSummaries}
          range={exportRange}
          today={today}
          hidden={hidden}
          onClose={() => setModal("")}
          onDone={(message) => {
            setError("");
            setStatus(message);
            setModal("");
          }}
          onError={setError}
        />
      )}
    </>
  );
}

function ExportDialog({
  workspace,
  summaries,
  range,
  today,
  hidden,
  onClose,
  onDone,
  onError,
}: {
  workspace: Workspace;
  summaries: WorkspaceSummary[];
  range: { from: string; to: string } | null;
  today: string;
  hidden: boolean;
  onClose: () => void;
  onDone: (message: string) => void;
  onError: (message: string) => void;
}) {
  const known = summaries.some((item) => item.id === workspace.id)
    ? summaries
    : [{ id: workspace.id, name: workspace.name }, ...summaries];
  const others = known.filter((item) => item.id !== workspace.id);
  const opening = exportChoiceFor(range, today);
  const [scope, setScope] = useState<ExportScope>("this");
  const [otherId, setOtherId] = useState(others[0]?.id ?? "");
  const [preset, setPreset] = useState<ExportPreset>(opening.preset);
  const [span, setSpan] = useState<ExportSpan>(opening.span);
  const [day, setDay] = useState(opening.day);
  const [from, setFrom] = useState(opening.from);
  const [to, setTo] = useState(opening.to);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");
  const dates = exportWindow(preset, span, today, { day, from, to });
  const ready =
    scope === "this" ||
    (scope === "another" && others.some((item) => item.id === otherId)) ||
    (scope === "all" && others.length > 0);
  async function download(type: "csv" | "pdf" | "xlsx") {
    if (!dates.from || !dates.to || !ready) return;
    setBusy(true);
    setProblem("");
    try {
      const targets = exportFileTargets(
        workspace.id,
        known,
        scope,
        otherId,
        hidden,
      );
      const { downloadReport } = await import("@/lib/exports");
      for (const target of targets) {
        const full =
          target.id === workspace.id
            ? workspace
            : await savedWorkspace(target.id);
        await downloadReport(full, dates.from, dates.to, type, target.mark);
      }
      onDone(
        targets.length > 1
          ? "Downloads started. One file for each workspace. Check your Downloads folder. If a file is missing, allow multiple downloads for this site."
          : "Download started. Check your Downloads folder.",
      );
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "The export did not start.";
      setProblem(message);
      onError(message);
    } finally {
      setBusy(false);
    }
  }
  const formats = (
    <div className={s.actions}>
      {(["csv", "pdf", "xlsx"] as const).map((type) => (
        <Button
          key={type}
          disabled={busy || !ready || !dates.from || !dates.to}
          onClick={() => download(type)}
        >
          {type.toUpperCase()}
        </Button>
      ))}
    </div>
  );
  return (
    <Dialog
      title="Export your records"
      onClose={onClose}
      actions={formats}
    >
      <>
          <p>
            Amounts are in GHS. The file contains private financial
            information. Anyone you share it with can pass it on.
          </p>
          {hidden && (
            <p className={s.exportNote}>
              Amounts are hidden on screen. The file will still contain them.
            </p>
          )}
          <fieldset className={s.exportChoices}>
            <legend>Which records?</legend>
            <label>
              <input
                type="radio"
                name="export-scope"
                checked={scope === "this"}
                onChange={() => setScope("this")}
              />
              This workspace
              {hidden ? "" : ` — ${workspace.name}`}
            </label>
            <label>
              <input
                type="radio"
                name="export-scope"
                checked={scope === "another"}
                disabled={!others.length}
                onChange={() => setScope("another")}
              />
              <span>
                Another workspace
                {scope === "another" && others.length > 0 && (
                  <select
                    aria-label="Other workspace"
                    value={otherId}
                    onChange={(event) => setOtherId(event.target.value)}
                  >
                    {others.map((item) => (
                      <option key={item.id} value={item.id}>
                        {hidden ? "Workspace" : item.name}
                      </option>
                    ))}
                  </select>
                )}
              </span>
            </label>
            <label>
              <input
                type="radio"
                name="export-scope"
                checked={scope === "all"}
                disabled={!others.length}
                onChange={() => setScope("all")}
              />
              All your workspaces
            </label>
          </fieldset>
          <fieldset className={s.exportChoices}>
            <legend>Which dates?</legend>
            {(
              [
                ["today", "Today"],
                ["week", "This week"],
                ["month", "This month"],
                ["year", "This year"],
                ["specify", "Specify"],
              ] as const
            ).map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="export-dates"
                  checked={preset === value}
                  onChange={() => setPreset(value)}
                />
                {label}
              </label>
            ))}
            {preset === "specify" && (
              <div className={s.exportDates}>
                <label>
                  <input
                    type="radio"
                    name="export-span"
                    checked={span === "day"}
                    onChange={() => setSpan("day")}
                  />
                  One day
                </label>
                <label>
                  <input
                    type="radio"
                    name="export-span"
                    checked={span === "range"}
                    onChange={() => setSpan("range")}
                  />
                  A range of dates
                </label>
                {span === "day" ? (
                  <input
                    aria-label="Date"
                    type="date"
                    value={day}
                    onChange={(event) => setDay(event.target.value)}
                  />
                ) : (
                  <>
                    <input
                      aria-label="From"
                      type="date"
                      value={from}
                      onChange={(event) => setFrom(event.target.value)}
                    />
                    <input
                      aria-label="To"
                      type="date"
                      value={to}
                      onChange={(event) => setTo(event.target.value)}
                    />
                  </>
                )}
              </div>
            )}
          </fieldset>
          <p className={s.exportNote}>{dates.label}</p>
          <p className={s.exportNote}>
            {others.length
              ? "All downloads a separate file for each of your workspaces. The records are not mixed into one ledger. The same dates are used for every file."
              : "You only have this workspace."}{" "}
            PDF is for reading or printing, Excel for working with the numbers,
            and CSV for importing records into another tool.
          </p>
          {problem && <p role="alert">{problem}</p>}
      </>
    </Dialog>
  );
}

async function savedWorkspace(id: string) {
  const response = await fetch(
    `/api/workspaces?workspace=${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
  const body = (await response.json().catch(() => ({}))) as {
    error?: string;
    workspace?: Workspace;
  };
  if (!response.ok || !body.workspace)
    throw new Error(body.error || "That workspace could not be opened.");
  return body.workspace;
}
