"use client";
import { Fragment, useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  House,
  NotebookText,
  BookOpen,
  Target,
  Landmark,
  Wallet,
  Smartphone,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Plus,
  ChevronDown,
  Mic,
} from "lucide-react";
import { Button, Amount, Dialog, FormDialog, RecordRow } from "./ui";
import ProfitReview from "./profit-review";
import RecordForm from "./record-form";
import BatchReview from "./batch-review";
import MoveForm from "./move-form";
import VoiceCapture from "./voice-capture";
import PeriodExplanation from "./period-explanation";
import { PlanUsage } from "./plan-usage";
import { planUsageModel } from "@/domain/customer-plans";
import ReportTrace from "./report-trace";
import WorkspaceTools from "./workspace-tools";
import DraftBackup from "./draft-backup";
import { RecordsTabContext } from "@/lib/records-context";
import StoryLog from "./story-log";
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
  { id: "today", label: "Home", Icon: House },
  { id: "records", label: "Records", Icon: NotebookText },
  { id: "stories", label: "Money Stories", Icon: BookOpen },
  { id: "plan", label: "Plan", Icon: Target },
];
/** Draft and reading progress belong with the story, not on every screen. */
const storyPages = ["today", "capture", "review"];
const recordsPages = ["records", "people", "accounts"];
/** Views that may live in the address bar and survive a refresh or a link. */
const linkablePages = [
  "records",
  "people",
  "accounts",
  "stories",
  "plan",
  "settings",
  "usage",
];
function pageFromUrl(search: string) {
  const view = new URLSearchParams(search).get("view") ?? "";
  return linkablePages.includes(view) ? view : "today";
}
function urlFor(page: string) {
  return linkablePages.includes(page) ? `/app?view=${page}` : "/app";
}
type HistoryEntry = { page?: string; modal?: string };
type InstallPromptEvent = Event & { prompt: () => Promise<unknown> };
const storyStatus = /^(Draft|Recovered draft|Waiting|Needs clarification|Understood|Saving|Save )/;
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
    [voiceSeconds, setVoiceSeconds] = useState(60),
    [transcriptionProvider, setTranscriptionProvider] = useState<
      "groq" | null
    >(null),
    [page, setPage] = useState(() =>
      typeof window === "undefined"
        ? "today"
        : pageFromUrl(window.location.search),
    ),
    [loaded, setLoaded] = useState(false),
    [openingFailed, setOpeningFailed] = useState(false),
    [error, setError] = useState(""),
    [status, setStatus] = useState(""),
    [receipt, setReceipt] = useState<{ page: string; message: string } | null>(
      null,
    ),
    [busy, setBusy] = useState(false),
    [hidden, setHidden] = useState(false),
    [theme, setTheme] = useState("light"),
    [modalState, setModalState] = useState({ name: "", revision: 0 }),
    [errorDialog, setErrorDialog] = useState<number | null>(null),
    [toolSection, setToolSection] = useState<"people" | "goals">("people"),
    [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(
      null,
    ),
    [standalone, setStandalone] = useState(false),
    [updateWaiting, setUpdateWaiting] = useState<ServiceWorker | null>(null),
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
    [retryOperation, setRetryOperation] = useState<Operation | null>(null),
    [lastSaved, setLastSaved] = useState<{ ids: string[]; date: string } | null>(
      null,
    );
  const revisionRef = useRef(0),
    draftReady = useRef(false),
    heading = useRef<HTMLHeadingElement>(null),
    savedPanel = useRef<HTMLElement>(null);
  const [spaceSummaries, setSpaceSummaries] = useState<WorkspaceSummary[]>([]);
  const loadRevision = useRef(0);
  // Reading positions stay in this tab and are scoped to the workspace.
  const recordsPosition = useRef<Record<string, { top: number; recordId?: string }>>({});
  const [recordsTab] = useState(() => new RecordsTabContext());
  const [recordsContextUnavailable, setRecordsContextUnavailable] = useState(false);
  const w = spaces.find((w) => w.id === wid);
  const goal = w?.goals.find((g) => g.id === goalId);
  const modal = modalState.name;
  const setModal = useCallback((name: string) => {
    setModalState((current) =>
      current.name === name ? current : { name, revision: current.revision + 1 },
    );
  }, []);
  function reportError(message: string) {
    setError(message);
    setErrorDialog(message && modal ? modalState.revision : null);
  }
  const formModal = [
    "account",
    "goal",
    "opening",
    "allocation",
    "goal-review",
    "checkin",
  ].includes(modal);
  const dialogError = errorDialog === modalState.revision ? error : "";
  const dialogRecovery =
    retryOperation && retryOperation.action !== "batch"
      ? () => {
          void checkChangeResult();
        }
      : undefined;
  const formDialogProps = {
    busy,
    error: dialogError,
    recover: dialogRecovery,
    onClose: () => setModal(""),
  };
  const recoveryFooter = dialogRecovery ? (
    <>
      <Button onClick={() => setModal("")}>Close</Button>
      <Button primary disabled={busy} onClick={dialogRecovery}>
        {busy ? "Checking change…" : "Check change result"}
      </Button>
    </>
  ) : undefined;
  const recoveryDialog = [
    "workspace",
    "deletion",
    "retention-now",
    "logout",
    "discard",
  ].includes(modal);
  const recoveryError =
    dialogError ||
    (dialogRecovery
      ? "An earlier change is not confirmed. Check its original request before making another change."
      : "");
  const refresh = useCallback(async (target: string) => {
    const request = ++loadRevision.current;
    const res = await fetch("/api/workspaces?view=summaries", {
        cache: "no-store",
      }),
      data = await res.json();
    if (!res.ok) throw Object.assign(new Error(data.error), { session: res.status === 401 });
    if (request !== loadRevision.current) return data;
    const allowed = data.workspaces.map((workspace: WorkspaceSummary) => workspace.id);
    const selectedId = data.workspaces.some(
      (x: WorkspaceSummary) => x.id === target,
    )
      ? target
      : (recordsTab.preferredWorkspace(data.userId, allowed) || data.workspaces[0]?.id || "");
    let selected: Workspace | null = null;
    if (selectedId) {
      const response = await fetch(
        `/api/workspaces?workspace=${encodeURIComponent(selectedId)}`,
        { cache: "no-store" },
      );
      const state = await response.json();
      if (!response.ok) throw Object.assign(new Error(state.error), { session: response.status === 401 });
      selected = state.workspace;
    }
    if (request !== loadRevision.current) return data;
    if (selected) {
      const switched = !recordsTab.matches(data.userId, selected.id);
      const context = recordsTab.activate(data.userId, selected, allowed);
      if (switched) {
        setSearch(context.search);
        setFilter(context.filter);
        setAccountFilter(context.accountId);
        setEvidence(context.range);
        recordsPosition.current[selected.id] = { top: context.top, recordId: context.recordId };
      }
    } else recordsTab.clear();
    setSpaceSummaries(data.workspaces);
    setSpaces(selected ? [selected] : []);
    setOwner(data.userId);
    setDemo(data.demo);
    setAi(data.aiEnabled);
    setVoice(data.voiceEnabled);
    setVoiceSeconds(data.voiceNoteSeconds === 120 ? 120 : 60);
    setTranscriptionProvider(
      data.transcriptionProvider === "groq" ? "groq" : null,
    );
    setWid(selectedId);
    return data;
  }, [recordsTab]);
  const composeWanted = useRef(false);
  useEffect(() => {
    Promise.resolve()
      .then(() => refresh(""))
      .then((data) => {
        if (data.demo) {
          setDate("2026-10-13");
          setStoryDate("2026-10-13");
        }
      })
      .catch((e) => {
        setOpeningFailed(!e.session);
        if (e.session) {
          recordsTab.clear();
          setError("Sign in again to open your records.");
        }
      })
      .finally(() => setLoaded(true));
    if ("serviceWorker" in navigator)
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // A new worker waits until the app says so, never mid-task.
          const watch = (worker: ServiceWorker | null) =>
            worker?.addEventListener("statechange", () => {
              if (
                worker.state === "installed" &&
                navigator.serviceWorker.controller
              )
                setUpdateWaiting(worker);
            });
          if (registration.waiting && navigator.serviceWorker.controller)
            setUpdateWaiting(registration.waiting);
          registration.addEventListener("updatefound", () =>
            watch(registration.installing),
          );
        })
        .catch(() => {});
  }, [refresh, recordsTab]);
  useEffect(() => {
    // Installed launches and the browser's own install offer.
    const media = window.matchMedia("(display-mode: standalone)");
    const sync = () => setStandalone(media.matches);
    sync();
    media.addEventListener("change", sync);
    const offer = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as InstallPromptEvent);
    };
    const installed = () => setInstallPrompt(null);
    window.addEventListener("beforeinstallprompt", offer);
    window.addEventListener("appinstalled", installed);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("beforeinstallprompt", offer);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);
  const eventsRef = useRef<EventInput[]>([]);
  useEffect(() => {
    eventsRef.current = events;
  }, [events]);
  const voiceGuard = useRef({ page: "today", active: false });
  useEffect(() => {
    voiceGuard.current = { page, active: modal === "voice" && voiceWork };
  }, [page, modal, voiceWork]);
  useEffect(() => {
    // The address names the view; the Back gesture walks the same history.
    const params = new URLSearchParams(window.location.search);
    if (params.get("compose")) composeWanted.current = true;
    const onPop = (e: PopStateEvent) => {
      if (voiceGuard.current.active) {
        // Back during a recording asks first, exactly like Close does.
        const { page: current } = voiceGuard.current;
        window.history.pushState(
          { page: current, modal: "voice" },
          "",
          urlFor(current),
        );
        setVoiceLeave(true);
        return;
      }
      const entry: HistoryEntry = e.state ?? {};
      const target = entry.page ?? pageFromUrl(window.location.search);
      setModal("");
      setPage((current) => {
        if (target === "review" || target === "capture")
          return eventsRef.current.length ? target : "today";
        return linkablePages.includes(target) || target === "today"
          ? target
          : current;
      });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [setModal]);
  useEffect(() => {
    if (!owner) return;
    const current: HistoryEntry = window.history.state ?? {};
    const same =
      current.page === page && (current.modal ?? "") === (modal || "");
    if (same) return;
    const entry: HistoryEntry = { page, modal: modal || "" };
    if (current.page === undefined) {
      window.history.replaceState(entry, "", urlFor(page));
    } else if (current.modal) {
      // Leaving a dialog: step back to the screen beneath it, or replace the
      // dialog entry when the screen itself changes.
      if (!modal && current.page === page) window.history.back();
      else window.history.replaceState(entry, "", urlFor(page));
    } else {
      window.history.pushState(entry, "", urlFor(page));
    }
  }, [owner, page, modal]);
  useEffect(() => {
    const channel = new BroadcastChannel("cashnarra-session");
    channel.onmessage = () => {
      recordsTab.clear();
      recordsPosition.current = {};
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
  }, [recordsTab, setModal]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (page === "today" && composeWanted.current) return;
      const position = recordsPosition.current[wid];
      const row = page === "records" && position?.recordId
        ? document.querySelector<HTMLElement>(`[data-record-id="${CSS.escape(position.recordId)}"]`)
        : null;
      const target = row ?? (page === "today" && lastSaved ? savedPanel.current : heading.current);
      const currentFocus = document.activeElement;
      if (currentFocus instanceof HTMLElement && currentFocus.matches("input, textarea, select") && currentFocus.closest("#main")) return;
      target?.focus({ preventScroll: true });
      if (page === "records")
        window.scrollTo({ top: position?.top ?? 0, behavior: "instant" });
      else if (page === "today" && !lastSaved)
        window.scrollTo({ top: 0, behavior: "instant" });
      else target?.scrollIntoView({ block: "start", behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [page, wid, lastSaved]);
  useEffect(() => {
    if (!owner || !wid || !w || w.id !== wid) return;
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      const kept = recordsTab.save(owner, wid, { search, filter, accountId: accountFilter, range: evidence, top: recordsPosition.current[wid]?.top ?? 0, recordId: recordsPosition.current[wid]?.recordId });
      setRecordsContextUnavailable(!kept);
    });
    return () => { cancelled = true; };
  }, [owner, wid, w, search, filter, accountFilter, evidence, page, recordsTab]);
  useEffect(() => {
    if (page !== "records" || modal || !owner || !wid) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const save = () => {
      recordsTab.save(owner, wid, { search, filter, accountId: accountFilter, range: evidence, top: recordsPosition.current[wid]?.top ?? 0, recordId: recordsPosition.current[wid]?.recordId });
    };
    const remember = () => {
      recordsPosition.current[wid] = { ...recordsPosition.current[wid], top: window.scrollY };
      clearTimeout(timer);
      timer = setTimeout(save, 200);
    };
    const leaving = () => { remember(); clearTimeout(timer); save(); };
    window.addEventListener("scroll", remember, { passive: true });
    window.addEventListener("pagehide", leaving);
    return () => {
      clearTimeout(timer);
      save();
      window.removeEventListener("scroll", remember);
      window.removeEventListener("pagehide", leaving);
    };
  }, [page, wid, modal, owner, search, filter, accountFilter, evidence, recordsTab]);
  useEffect(() => {
    if (page === "records" && modal === "detail" && selected) {
      recordsPosition.current[wid] = {
        top: window.scrollY,
        recordId: selected.id,
      };
      recordsTab.save(owner, wid, { search, filter, accountId: accountFilter, range: evidence, top: window.scrollY, recordId: selected.id });
    }
  }, [page, wid, modal, selected, owner, search, filter, accountFilter, evidence, recordsTab]);
  useEffect(() => {
    // "Tell", "Type your story" and the home-screen shortcut land in the box.
    if (page !== "today" || modal || !composeWanted.current) return;
    const frame = requestAnimationFrame(() => {
      const box = document.getElementById("today-story");
      if (!(box instanceof HTMLTextAreaElement) || box.disabled) return;
      composeWanted.current = false;
      box.focus({ preventScroll: true });
      box.scrollIntoView({ block: "center", behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [page, modal, loaded, owner, wid]);

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
      if (nextText.trim()) setLastSaved(null);
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
    // The banner is only how the last save was shown. Saved rows, the
    // request key and an unconfirmed retry stay put.
    setReceipt(null);
    setStatus((current) => (current.startsWith("Saved") ? "" : current));
  }
  async function reopenRecords() {
    setLoaded(false);
    setOpeningFailed(false);
    try {
      const data = await refresh("");
      if (data.demo) { setDate("2026-10-13"); setStoryDate("2026-10-13"); }
    } catch (e) {
      const session = (e as Error & { session?: boolean }).session;
      setOpeningFailed(!session);
      if (session) { recordsTab.clear(); setError("Sign in again to open your records."); }
    }
    finally { setLoaded(true); }
  }
  function openComposer() {
    composeWanted.current = true;
    navigate("today");
    requestAnimationFrame(() => {
      const box = document.getElementById("today-story");
      if (box instanceof HTMLTextAreaElement && !box.disabled) {
        composeWanted.current = false;
        box.focus({ preventScroll: true });
        box.scrollIntoView({ block: "center" });
      }
    });
  }
  async function perform(operation: Operation) {
    if (retryOperation && retryOperation.key !== operation.key) {
      const message = "Resolve the unconfirmed action before making another change.";
      reportError(message);
      throw new Error(message);
    }
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
        recordsTab.clear();
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
      const failure = e as Error & { rejected?: boolean; session?: boolean };
      reportError(failure.rejected || failure.session
        ? failure.message
        : operation.action === "batch"
          ? "We couldn’t confirm the save. Your reviewed work is still here. Choose Check save result to check the original request safely."
          : "We couldn’t confirm that change. The original request is still here. Choose Check change result to recover it safely.");
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
  async function checkChangeResult() {
    if (!retryOperation) return;
    try {
      await perform(retryOperation);
      showReceipt("Saved · original action receipt confirmed");
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
      setError(navigator.onLine ? (e as Error).message : "");
      setStatus(
        navigator.onLine
          ? ""
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
  async function saved(receipt?: { recordIds?: string[] }) {
    setRetryOperation(null);
    setText("");
    setEvents([]);
    setReplaceIds([]);
    setQuestions([]);
    setPending(null);
    setAllowDuplicates(false);
    await draftStorage("delete", owner, wid).catch((e) => setError(e.message));
    setLastSaved({ ids: receipt?.recordIds ?? [], date });
    showReceipt("Saved · records confirmed", "today");
    setPage("today");
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
      const receipt = await perform(op);
      await saved(receipt);
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
    setError("");
    setStatus("Checking the original save…");
    try {
      const res = await fetch(
        `/api/workspaces?workspace=${encodeURIComponent(pending.workspaceId)}&request=${encodeURIComponent(pending.key)}`,
        { cache: "no-store" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.receipt) {
        await refresh(wid);
        await saved(data.receipt);
      } else {
        setStatus(
          "No receipt found. Retry will use the same reviewed request.",
        );
        const receipt = await perform(pending);
        await saved(receipt);
      }
    } catch (e) {
      setStatus("Save not confirmed.");
      setError((e as Error & { rejected?: boolean }).rejected
        ? (e as Error).message
        : "We still couldn’t confirm this save. Your reviewed work is kept here. Reconnect, then choose Check save result again. It uses the same request and won’t add the records twice.");
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
  const dayHasRecords = active.some((record) => record.date === date);
  const openBalances = w ? obligations(w).filter((o) => D(o.remaining).gt(0)) : [];
  const peopleOwe = sum(
    openBalances.filter((o) => o.direction === "receivable").map((o) => o.remaining),
  );
  const youOwe = sum(
    openBalances.filter((o) => o.direction === "payable").map((o) => o.remaining),
  );
  const savedRecords =
    w && lastSaved
      ? w.records.filter((r) => lastSaved.ids.includes(r.id) && !r.removed)
      : [];
  const savedDates = [...new Set(savedRecords.map((record) => record.date))].sort();
  const savedBalanceIds = new Set(savedRecords.flatMap((record) => record.obligationId ? [record.obligationId] : []));
  const savedConsequences = w
    ? obligations(w).filter((balance) => savedBalanceIds.has(balance.id)).map((balance) => {
        const name = hidden ? "This person" : balance.party.replace(/\s*(?:\.{3}|…)+$/u, "");
        const line = D(balance.remaining).gt(0)
          ? balance.direction === "receivable"
            ? `${name} now owes you ${hidden ? "an amount" : formatMoney(balance.remaining)} on this balance.`
            : `You now owe ${name} ${hidden ? "an amount" : formatMoney(balance.remaining)} on this balance.`
          : `This recorded balance with ${hidden ? "this person" : name} is now settled.`;
        return { id: balance.id, line };
      })
    : [];
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
  function rows(records: EventInput[], draft = false, showDate = true) {
    return records.map((record) => (
      <RecordRow
        key={record.id}
        record={record}
        hidden={hidden}
        showDate={showDate}
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
        onChange={draft ? () => manual(record) : undefined}
      />
    ));
  }
  const navigation = (mobile = false) => (
    <nav
      aria-label={mobile ? "Mobile navigation" : "Main navigation"}
      className={mobile ? s.bottomNav : s.topnav}
    >
      {nav.map(({ id, label, Icon }, index) => (
        <Fragment key={id}>
          {mobile && index === 2 && (
            <button
              type="button"
              className={`${s.navLink} ${s.navTell}`}
              aria-label="Tell what happened"
              onClick={() => {
                composeWanted.current = true;
                if (page === "today") {
                  const box = document.getElementById("today-story");
                  if (box instanceof HTMLTextAreaElement) {
                    composeWanted.current = false;
                    box.focus();
                    box.scrollIntoView({ block: "center" });
                  }
                } else navigate("today");
              }}
            >
              <span className={s.tellMark} aria-hidden />
              Tell
            </button>
          )}
          <button
            className={s.navLink}
            aria-current={
              page === id || (id === "records" && recordsPages.includes(page))
                ? "page"
                : undefined
            }
            onClick={() => navigate(id)}
          >
            <Icon size={20} aria-hidden />
            {mobile && id === "stories" ? "Stories" : label}
          </button>
        </Fragment>
      ))}
    </nav>
  );
  if (!loaded)
    return (
      <main className={s.landing}>
        <h1>Opening your records…</h1>
      </main>
    );
  if (openingFailed)
    return (
      <main className={s.landing}>
        <h1>Your records couldn’t load.</h1>
        <p role="alert">We couldn’t open your workspace. This does not mean your records are empty. Check your connection, then try again.</p>
        <Button primary onClick={() => void reopenRecords()}>Try loading records again</Button>
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
    <div className={s.appShell}>
      <a className={s.skip} href="#main">
        Skip to content
      </a>
      {demo && (
        <div className={s.strip}>
          Synthetic demo · fictional Ama Works data · no real AI calls
        </div>
      )}
      <header className={s.appbar}>
        <Link href="/" className={s.brand}>
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
        {navigation()}
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
            className={s.accountButton}
            aria-label="Workspace, accounts and settings"
            onClick={() => setModal("workspace")}
          >
            <span className={s.avatar} aria-hidden>
              {(w?.name ?? "Workspace")
                .split(/\s+/)
                .map((part) => part[0] ?? "")
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <strong>{hidden ? "Workspace" : (w?.name ?? "Workspace")}</strong>
            {w?.type && <small>{w.type}</small>}
            <ChevronDown size={16} aria-hidden />
          </button>
        </div>
      </header>
          <main id="main" className={s.content}>
            <div role="status" aria-live="polite">
              {receipt?.page === page && (
                <p className={s.status}>{receipt.message}</p>
              )}
              {status &&
                (storyPages.includes(page) || !storyStatus.test(status)) && (
                  <p className={status.startsWith("Saved") ? s.status : s.notice}>
                    {status}
                  </p>
                )}
            </div>
            {updateWaiting && (
              <div className={`${s.notice} ${s.updateNotice}`}>
                <p>
                  A newer version of CashNarra is ready. It opens the next time
                  you start the app, or refresh now. Your records are not
                  affected.
                </p>
                <Button
                  disabled={busy || !!pending || voiceWork}
                  onClick={() => {
                    navigator.serviceWorker.addEventListener(
                      "controllerchange",
                      () => window.location.reload(),
                      { once: true },
                    );
                    updateWaiting.postMessage("SKIP_WAITING");
                    setUpdateWaiting(null);
                  }}
                >
                  Refresh now
                </Button>
                <Button quiet onClick={() => setUpdateWaiting(null)}>
                  Later
                </Button>
              </div>
            )}
            {error && !formModal && modal !== "move" && modal !== "workspace-tools" && !(modal && dialogError) && (
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
            {retryOperation && retryOperation.action !== "batch" && !formModal && !recoveryDialog && modal !== "move" && modal !== "workspace-tools" && (
              <div className={s.notice}>
                <p>
                  The last action is not confirmed. Its original request is
                  preserved.
                </p>
                <Button
                  disabled={busy}
                  onClick={() => { void checkChangeResult(); }}
                >
                  {busy ? "Checking change…" : "Check change result"}
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
                  <div className={s.page}>
                    <div className={s.pageMain}>
                      {lastSaved && savedRecords.length > 0 && (
                        <section className={s.savedPanel} aria-label="Saved" ref={savedPanel} tabIndex={-1}>
                          <h2>
                            Saved{" "}
                            {savedRecords.length === 1
                              ? "1 record"
                              : `${savedRecords.length} records`}{" "}
                            for {savedDates.length > 1
                              ? rangeLabel(savedDates[0], savedDates[savedDates.length - 1])
                              : readingDate(savedDates[0] ?? lastSaved.date)}
                          </h2>
                          <p className={s.muted}>
                            They now count in your records and Money Stories.
                          </p>
                          {rows(savedRecords, false, savedDates.length > 1)}
                          {savedConsequences.map((result) => (
                            <p key={result.id} className={s.savedConsequence}>
                              {result.line}
                            </p>
                          ))}
                          <div className={s.actions}>
                            <Button
                              onClick={() => {
                                if (savedDates.length > 1) {
                                  setSearch("");
                                  setFilter("all");
                                  setAccountFilter("");
                                  setEvidence({ from: savedDates[0], to: savedDates[savedDates.length - 1] });
                                  navigate("records");
                                } else {
                                  setStoryDate(savedDates[0] ?? lastSaved.date);
                                  setPeriod("day");
                                  navigate("stories");
                                }
                              }}
                            >
                              {savedDates.length > 1 ? "View activity for these dates" : "Read the day’s story"}
                            </Button>
                            <Button quiet onClick={() => setLastSaved(null)}>
                              Done
                            </Button>
                          </div>
                        </section>
                      )}
                      <section
                        className={s.composer}
                        aria-labelledby="composer-title"
                      >
                        <div className={s.composerHead}>
                          <span className={s.eyebrow}>
                            {(hidden ? "Workspace" : w.name) +
                              " · " +
                              (date === today ? "Today" : readingDate(date))}
                          </span>
                          <label htmlFor="today-date" className={s.dateField}>
                            <span>Date of activity</span>
                            <input
                              id="today-date"
                              type="date"
                              value={date}
                              onChange={(e) => {
                                if (calendarDate(e.target.value))
                                  setDate(e.target.value);
                                changeDraft();
                              }}
                              disabled={!!pending || busy}
                            />
                          </label>
                        </div>
                        <h1 id="composer-title" ref={heading} tabIndex={-1}>
                          What happened with your money?
                        </h1>
                        <textarea
                          id="today-story"
                          aria-label="Your money story"
                          className={s.capture}
                          value={text}
                          maxLength={12000}
                          disabled={!!pending || busy}
                          placeholder="I sold 900 cash, paid 80 for delivery, and Abena paid 200 of what she owed…"
                          onChange={(e) => changeDraft(e.target.value)}
                        />
                        <div className={s.actions}>
                          <Button
                            primary
                            disabled={
                              busy || !!pending || (!text.trim() && !events.length)
                            }
                            onClick={() => {
                              if (events.length) navigate("review");
                              else void understand();
                            }}
                          >
                            {busy
                              ? "Reading your story…"
                              : events.length
                                ? "Finish your draft"
                                : "Understand my story"}
                          </Button>
                          <Button onClick={() => setModal("voice")}>
                            <Mic size={18} aria-hidden />
                            <span>Speak</span>
                          </Button>
                        </div>
                        <p className={s.hint}>
                          {voice
                            ? "Speak or type. You check the words and the records before anything is saved."
                            : "Transcription is not available yet. Type here, or record and type the words yourself."}
                          {events.length
                            ? " Your draft is waiting. Finish it to check the records."
                            : " Nothing is saved until you check the records."}
                        </p>
                        {demo && !ai && (
                          <p className={s.hint}>
                            This demo can read the two sample stories. Manual
                            records work for anything else.
                          </p>
                        )}
                        <div className={s.moreTools}>
                          <div className={s.actions}>
                            <Button
                              quiet
                              onClick={() => manual()}
                              disabled={!!pending}
                            >
                              Add a manual record
                            </Button>
                            {demo && (
                              <>
                                <Button quiet onClick={() => changeDraft(sample)}>
                                  Use the example
                                </Button>
                                <Button
                                  quiet
                                  onClick={() => changeDraft(unclearSample)}
                                >
                                  Try an unclear version
                                </Button>
                              </>
                            )}
                            <Button
                              quiet
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
                          <details>
                            <summary>Draft backup</summary>
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
                            <p className={s.hint}>
                              Off on shared devices. Browser storage is not a
                              backup.
                            </p>
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
                                pendingRequest:
                                  pending ?? retryOperation ?? undefined,
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
                                  d.questionsPreserved === false &&
                                    d.events.length > 0,
                                );
                                setStatus(
                                  d.questionsPreserved === false && d.events.length
                                    ? "Draft restored. This older backup did not keep unanswered questions, so check every record before saving."
                                    : "Draft restored. Check the words and records before saving.",
                                );
                                if (d.events.length || op) setPage("review");
                              }}
                            />
                            <p className={s.hint}>
                              Review names and sensitive details before processing.{" "}
                              <Link href="/privacy">Who processes your story?</Link>
                            </p>
                          </details>
                        </div>
                      </section>
                    </div>
                    <div className={s.pageLog}>
                      {!dayHasRecords && (
                        <div className={s.log}>
                          <div className={s.dayHead}>
                            <h2>{dayLabel}</h2>
                            <span>Nothing recorded yet</span>
                          </div>
                        </div>
                      )}
                      <StoryLog
                        workspace={w}
                        records={active as RecordEvent[]}
                        today={today}
                        hidden={hidden}
                        rows={(items, showDate) => rows(items, false, showDate)}
                        onSeeAll={() => navigate("records")}
                      />
                      {!active.length && (
                        <p className={s.empty}>
                          No records yet. Tell one story about today, or a day
                          you remember, and check the records it gives you.
                        </p>
                      )}
                    </div>
                    <aside className={s.pageAside} aria-label="In brief">
                      <section className={s.statBlock}>
                        <h2>
                          {date === today ? "Today so far" : `${dayLabel} in brief`}
                        </h2>
                        <button
                          className={s.statTotal}
                          onClick={() => navigate("accounts")}
                        >
                          <small>Recorded account balances</small>
                          <Amount value={total} hidden={hidden} />
                          <small>Cash, Bank & MoMo · manually tracked</small>
                        </button>
                        <button
                          className={s.stat}
                          onClick={() => {
                            setFilter("in");
                            setEvidence({ from: date, to: date });
                            navigate("records");
                          }}
                        >
                          <span>Money in · {dayLabel}</span>
                          {dayHasRecords ? (
                            <Amount value={dayReport!.received} hidden={hidden} />
                          ) : (
                            <small>No records for this day</small>
                          )}
                        </button>
                        <button
                          className={s.stat}
                          onClick={() => {
                            setFilter("out");
                            setEvidence({ from: date, to: date });
                            navigate("records");
                          }}
                        >
                          <span>Money out · {dayLabel}</span>
                          {dayHasRecords ? (
                            <Amount value={dayReport!.paid} hidden={hidden} />
                          ) : (
                            <small>No records for this day</small>
                          )}
                        </button>
                        <div className={s.stat}>
                          <span>Net movement</span>
                          {dayHasRecords ? (
                            <Amount value={dayReport!.net} hidden={hidden} />
                          ) : (
                            <small>Not recorded</small>
                          )}
                        </div>
                        <p className={s.hint}>
                          {dayHasRecords
                            ? "Money in minus money out. It is not profit, and transfers between your own accounts are left out."
                            : "No records for this day. That does not mean nothing happened."}
                        </p>
                        <button
                          className={s.sectionLink}
                          onClick={() => {
                            setStoryDate(date);
                            setPeriod("day");
                            navigate("stories");
                          }}
                        >
                          Read the day’s story →
                        </button>
                      </section>
                      <section className={s.statBlock}>
                        <h2>People</h2>
                        <button className={s.stat} onClick={() => navigate("people")}>
                          <span>Owe you</span>
                          <Amount value={peopleOwe} hidden={hidden} />
                        </button>
                        <button className={s.stat} onClick={() => navigate("people")}>
                          <span>You owe</span>
                          <Amount value={youOwe} hidden={hidden} />
                        </button>
                      </section>
                      {w.goals[0] &&
                        (() => {
                          const g = w.goals[0];
                          const f = forecast(g, date);
                          const percent = D(g.target).eq(0)
                            ? 0
                            : D(f.assigned).div(g.target).mul(100).clamp(0, 100).toNumber();
                          return (
                            <section className={s.goalPeek} aria-label="Goal">
                              <small>{g.name}</small>
                              <div className={s.goalBar} aria-hidden>
                                <span style={{ width: `${hidden ? 0 : percent}%` }} />
                              </div>
                              <strong className={s.goalAmount}>
                                <Amount value={f.assigned} hidden={hidden} />
                              </strong>
                              <small>
                                of <Amount value={g.target} hidden={hidden} /> set
                                aside · a mark, not money moved
                              </small>
                              <br />
                              <small>
                                {f.count === null
                                  ? "No pace estimate yet"
                                  : f.count === 0
                                    ? "Target reached"
                                    : `About ${f.count} ${f.count === 1 ? "month" : "months"} at this pace`}
                              </small>
                              <br />
                              <Button onClick={() => navigate("plan")}>
                                Open your plan →
                              </Button>
                            </section>
                          );
                        })()}
                      {w.preferences?.showRhythm !== false && (
                        <section className={`${s.statBlock} ${s.rhythm}`}>
                          <h2>Your rhythm</h2>
                          <p>
                            {(() => {
                              const days = w.checkins.filter(
                                (c) => c.kind !== "rest",
                              ).length;
                              return `${days} ${days === 1 ? "day" : "days"} you checked in`;
                            })()}
                          </p>
                          <p className={s.hint}>
                            A check-in only marks the day you looked. Catch up on
                            another day whenever you remember it.
                          </p>
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
                            A moment for your money? Check today, or catch up on
                            a day you remember. No rush.
                          </p>
                        )}
                    </aside>
                  </div>
                )}
                {page === "review" && (
                  <>
                  {replaceIds.length > 0 && (
                    <div className={s.actions}>
                      <Button quiet onClick={() => navigate("records")}>Back to records</Button>
                      <span className={s.hint}>Your correction draft stays here until you save or discard it.</span>
                    </div>
                  )}
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
                    recordRows={rows(events, true, new Set(events.map((record) => record.date)).size !== 1)}
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
                    onBack={openComposer}
                    onDiscard={() => setModal("discard")}
                  />
                  </>
                )}
                {recordsPages.includes(page) && (
                  <>
                    <div className={s.pageIntro}>
                      <div>
                        <h1 ref={heading} tabIndex={-1}>
                          {page === "records"
                            ? "Your records"
                            : page === "people"
                              ? "People & balances"
                              : "Your recorded accounts"}
                        </h1>
                        <p>
                          {page === "records"
                            ? "Find, check or correct a saved record."
                            : page === "people"
                              ? "Who owes you, who you owe, and the records behind each balance."
                              : "Balances based on what you’ve entered. Not linked to your bank or MoMo."}
                        </p>
                      </div>
                      {page === "records" && (
                        <div className={s.actions}>
                          <Button onClick={() => setModal("export")}>Export</Button>
                          <Button primary onClick={() => manual()}>
                            <Plus size={16} /> Add record
                          </Button>
                        </div>
                      )}
                      {page === "people" && (
                        <Button onClick={() => { setToolSection("people"); setModal("workspace-tools"); }}>
                          Add a person or a due date
                        </Button>
                      )}
                      {page === "accounts" && (
                        <Button primary onClick={() => setModal("account")}>
                          Add account
                        </Button>
                      )}
                    </div>
                    <nav className={s.segmented} aria-label="Records views">
                      {(
                        [
                          ["records", "Records"],
                          ["people", "People"],
                          ["accounts", "Accounts"],
                        ] as const
                      ).map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          aria-current={page === id ? "page" : undefined}
                          onClick={() => navigate(id)}
                        >
                          {label}
                        </button>
                      ))}
                    </nav>
                    {page === "records" && (
                      <>
                    <div
                      className={`${s.toolbar} ${s.recordFilters}`}
                      role="search"
                      aria-label="Records filters"
                    >
                      <input
                        type="search"
                        aria-label="Search records"
                        maxLength={300}
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
                    <p className={s.recordsSummary}>
                      {filtered.length} of {active.length} saved {active.length === 1 ? "record" : "records"} shown
                      {accountFilter ? " · account filter applied" : " · all accounts"}.
                    </p>
                    {recordsContextUnavailable && <p role="status" className={s.hint}>Your filters are kept for now, but refreshing this page will reset them.</p>}
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
                          <h2 className={s.dayHeading}>
                            {day === today
                              ? `Today · ${readingDate(day)}`
                              : readingDate(day)}
                          </h2>
                          {rows(records, false, false)}
                        </section>
                      ))}
                    {!filtered.length && (
                      <section className={s.empty} aria-label="Records result">
                        <h2>{active.length ? "No matching records" : "No saved records yet"}</h2>
                        <p>{active.length
                          ? "Your saved records are still here. Change your search or use Reset filters to see them."
                          : "Tell a money story or add a record when you’re ready. Missing activity does not mean zero."}</p>
                      </section>
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
                      </>
                    )}
                    {page === "people" && (
                      <section className={s.debtGroup}>
                      {!obligations(w).some((o) => D(o.remaining).gt(0)) && (
                        <p>No unpaid balances in your saved records. Add any balances you haven’t recorded yet.</p>
                      )}
                      {(["receivable", "payable"] as const).map((direction) => {
                        const open = obligations(w).filter(
                          (o) =>
                            o.direction === direction && D(o.remaining).gt(0),
                        );
                        if (!open.length) return null;
                        return (
                          <div key={direction}>
                            <h3>
                              {direction === "receivable"
                                ? "People owe you"
                                : "You owe"}
                            </h3>
                            {open.map((o) => {
                              const due = debtDate(w, o.id);
                              const overdue = !!due && due < today;
                              return (
                                <div className={s.debtRow} key={o.id}>
                                  <div>
                                    <strong>
                                      {hidden
                                        ? "Name hidden"
                                        : o.party.replace(
                                            /\s*(?:\.{3}|…)+$/u,
                                            "",
                                          )}
                                    </strong>
                                    <small>
                                      {direction === "receivable"
                                        ? "Owes you since "
                                        : "You have owed since "}
                                      {readingDate(o.date)}
                                      {due
                                        ? ` · due ${readingDate(due)}${overdue ? " · past the date you set" : ""}`
                                        : ""}
                                    </small>
                                  </div>
                                  <Amount value={o.remaining} hidden={hidden} />
                                  <div className={s.debtActions}>
                                    <Button
                                      quiet
                                      onClick={() =>
                                        manual(
                                          event(
                                            direction === "receivable"
                                              ? "receivable_payment"
                                              : [
                                                    "loan_received",
                                                    "opening_loan",
                                                  ].includes(
                                                    w.records.find(
                                                      (r) => r.id === o.id,
                                                    )?.kind ?? "",
                                                  )
                                                ? "loan_principal"
                                                : "payable_payment",
                                            "",
                                            `${o.party} balance payment`,
                                            null,
                                            {
                                              date,
                                              party: o.party,
                                              obligationId: o.id,
                                            },
                                          ),
                                        )
                                      }
                                    >
                                      Record payment
                                    </Button>
                                    <Button
                                      quiet
                                      onClick={() => {
                                        setSelected(
                                          w.records.find((r) => r.id === o.id) ??
                                            null,
                                        );
                                        setModal("detail");
                                      }}
                                    >
                                      View original balance
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                      <div className={s.actions}>
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
                      </div>
                      </section>
                    )}
                    {page === "accounts" && (
                      <>
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
                    <small>Recorded total</small>
                    <div>
                      <Amount value={total} hidden={hidden} large />
                    </div>
                    <div className={s.accountGrid}>
                      {w.accounts.map((a) => (
                        <article key={a.id} className={s.panel}>
                          <div className={s.accountHeading}>
                            {a.type === "Cash" ? (
                              <Wallet size={20} aria-hidden />
                            ) : a.type === "MoMo" ? (
                              <Smartphone size={20} aria-hidden />
                            ) : (
                              <Landmark size={20} aria-hidden />
                            )}
                            <h2>{hidden ? "Account" : a.name}</h2>
                          </div>
                          {(hidden || a.name.trim().toLocaleLowerCase() !== a.type.toLocaleLowerCase()) && (
                            <p>{a.type === "Bank" ? "Bank account" : a.type}</p>
                          )}
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
                  </>
                )}
                {page === "stories" && (
                  <>
                    <div className={s.pageIntro}>
                      <div>
                        <h1 ref={heading} tabIndex={-1}>
                          Money Stories
                        </h1>
                        <p>What moved in a day, a week or a month, with the records behind every figure.</p>
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
                              <span>Money in</span>
                              <Amount
                                value={storyReport.received}
                                hidden={hidden}
                              />
                            </div>
                            <div data-metric="paid">
                              <span>Money out</span>
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
                            saved {storyReport.records.filter((x) => !x.kind.startsWith("opening_")).length === 1 ? "record" : "records"}. Unrecorded activity may be missing.
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
                      {storyReport ? null : (
                        <small>
                          Based on what you have entered. Unrecorded days may
                          still have activity.
                        </small>
                      )}
                    </section>
                    {storyReport && (
                      <section className={s.chapter}>
                        <h2>What this period shows</h2>
                        <p>The largest amounts paid out.</p>
                        <div className={s.lineList}>
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
                              <p key={record.id}>
                                <span>{record.description}</span>
                                <Amount value={record.amount} hidden={hidden} />
                              </p>
                            ))}
                        </div>
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
                        <div className={s.actions}>
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
                        </div>
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
                        <div className={s.actions}>
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
                        </div>
                      </section>
                    )}
                  </>
                )}
                {page === "plan" && (
                  <>
                    <div className={s.pageIntro}>
                      <div>
                        <h1 ref={heading} tabIndex={-1}>
                          Your goals
                        </h1>
                        <p>
                          Mark money you have set aside and see what a monthly
                          amount could do. A mark does not move or reserve money.
                        </p>
                      </div>
                      <div className={s.actions}>
                        {!w.accounts.length ? <Button primary onClick={() => setModal("account")}>Add account</Button> : <Button primary={!w.goals.length} onClick={() => setModal("goal")}>
                          New goal
                        </Button>}
                        {!!w.goals.length && <Button onClick={() => { setToolSection("goals"); setModal("workspace-tools"); }}>
                          Edit goals
                        </Button>}
                      </div>
                    </div>
                    {!w.goals.length && (
                      <p className={s.empty}>
                        {w.accounts.length ? "Goals are optional. Start with a name and a fixed target." : "Goals are optional. Add an account first so you can track the money you mark for a goal."}
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
                            <div className={s.goalHeader}>
                              <h2>{g.name}</h2>
                              <span className={s.goalMarker}>Tracked here, not moved</span>
                            </div>
                            <dl className={s.goalFacts}>
                              <div>
                                <dt>Target</dt>
                                <dd>
                                  <Amount value={g.target} hidden={hidden} />
                                </dd>
                              </div>
                              <div>
                                <dt>Set aside</dt>
                                <dd>
                                  <Amount value={f.assigned} hidden={hidden} />
                                </dd>
                              </div>
                              <div>
                                <dt>Remaining</dt>
                                <dd>
                                  <Amount
                                    value={
                                      remaining.lte(0)
                                        ? "0.00"
                                        : remaining.toFixed(2)
                                    }
                                    hidden={hidden}
                                  />
                                </dd>
                              </div>
                            </dl>
                            <p>
                              {remaining.lte(0)
                                ? "The marked amount has reached the target."
                                : hidden
                                  ? "The share of the target is hidden with the amounts."
                                  : `${percent}% of the target is marked.`}
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
                                Explore what-if
                              </Button>
                              <Button
                                quiet
                                onClick={() => {
                                  setGoalId(g.id);
                                  setModal("goal-review");
                                }}
                              >
                                Review history
                              </Button>
                            </div>
                            <div className={s.goalForecast}>
                            <small>If you keep adding money at this pace</small>
                            <h3>
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
                                Around{" "}
                                {new Intl.DateTimeFormat("en-GB", {
                                  month: "long",
                                  year: "numeric",
                                  timeZone: "UTC",
                                }).format(
                                  new Date(
                                    Date.UTC(
                                      Number(f.period.slice(0, 4)),
                                      Number(f.period.slice(5, 7)) - 1,
                                      1,
                                    ),
                                  ),
                                )}{" "}
                                at <Amount value={f.pace} hidden={hidden} /> a
                                month.
                              </p>
                            )}
                            <p>{f.reason}</p>
                            </div>
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
                {page === "usage" && (
                  <PlanUsage
                    headingRef={heading}
                    model={planUsageModel({
                      now: new Date(),
                      workspaceCount: spaceSummaries.length,
                      voiceEnabled: voice,
                    })}
                  />
                )}
                {page === "settings" && (
                  <>
                    <div className={s.pageIntro}>
                      <div>
                        <h1 ref={heading} tabIndex={-1}>
                          Settings and privacy
                        </h1>
                        <p>How CashNarra looks, what it keeps, and your data.</p>
                      </div>
                    </div>
                    <section className={s.settingsGroup}>
                      <h2>Subscription</h2>
                      <div className={s.settingsRow}>
                        <div>
                          <strong>One plan for this account</strong>
                          <p>
                            Every workspace shares it. This is not a separate
                            bill for the workspace you have open.
                          </p>
                        </div>
                        <Button onClick={() => navigate("usage")}>
                          View plan and usage
                        </Button>
                      </div>
                    </section>
                    <section className={s.settingsGroup}>
                      <h2>Appearance</h2>
                      <div className={s.settingsRow}>
                        <div>
                          <strong>Light or dark</strong>
                          <p>Choose the look you find easier to read.</p>
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
                          <strong>Drafts on this device</strong>
                          <p>
                            {persistent
                              ? "Unfinished stories are kept on this device."
                              : "Unfinished stories are not kept on this device."}{" "}
                            Clearing device drafts keeps your saved financial records.
                          </p>
                        </div>
                        <Button onClick={() => setModal("shared-device")}>
                          Clear stored drafts
                        </Button>
                      </div>
                      <div className={s.settingsRow}>
                        <div>
                          <strong>Keep original stories for</strong>
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
                      </div>
                    </section>
                    <section className={s.settingsGroup}>
                      <h2>Data and privacy</h2>
                      <div className={`${s.settingsRow} ${s.settingsDanger}`}>
                        <div>
                          <strong>Delete original stories</strong>
                          <p>
                            This removes the saved narration in this workspace.
                            The financial records and correction history stay.
                          </p>
                        </div>
                        <Button onClick={() => setModal("retention-now")}>
                          Delete original stories
                        </Button>
                      </div>
                    </section>
                    <section className={s.settingsGroup}>
                      <h2>Reminders</h2>
                      <div className={s.settingsRow}>
                        <div>
                          <strong>Check-in and catch-up</strong>
                          <p>
                            Choose when you’d like to check your records.
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
                          <p>
                            Names you reuse, when a balance is due, and the
                            months you have checked for a goal.
                          </p>
                        </div>
                        <Button onClick={() => { setToolSection("people"); setModal("workspace-tools"); }}>
                          Edit people and dates
                        </Button>
                      </div>
                    </section>
                    <section className={s.settingsGroup}>
                      <h2>Your data</h2>
                      <p>
                        <Link href="/privacy">How your information is used</Link>
                      </p>
                      <div className={s.settingsRow}>
                        <div>
                          <strong>Private export</strong>
                          <p>Choose the dates and format for a file you download.</p>
                        </div>
                        <Button onClick={() => setModal("export")}>
                          Private export
                        </Button>
                      </div>
                      <div className={s.settingsRow}>
                        <div>
                          <strong>Copy of your data</strong>
                          <p>Record a request for a copy of your account data.</p>
                        </div>
                        <Button
                          onClick={() => simple("request", { kind: "access" })}
                        >
                          Request a copy of my data
                        </Button>
                      </div>
                      <div className={s.settingsRow}>
                        <div>
                          <strong>Account-data deletion</strong>
                          <p>Review what a deletion request includes before confirming.</p>
                        </div>
                        <Button onClick={() => setModal("deletion")}>
                          Request account-data deletion
                        </Button>
                      </div>
                      {w.requests.map((r) => (
                        <p key={r.id}>
                          {r.kind} request · {r.status} · {r.at.slice(0, 10)}
                        </p>
                      ))}
                      <p className={s.notice}>
                        Submitting a request adds it for review. No data is
                        automatically erased or emailed.
                      </p>
                    </section>
                    <section className={s.settingsGroup}>
                      <h2>Account</h2>
                      <div className={s.settingsRow}>
                        <div>
                          <strong>Sign out of this device</strong>
                          <p>
                            Your saved records stay in your account. Finish or
                            copy an unfinished story first.
                          </p>
                        </div>
                        <Button onClick={() => setModal("logout")}>
                          Sign out
                        </Button>
                      </div>
                    </section>
                  </>
                )}
              </>
            )}
      </main>
      {navigation(true)}
      {modal === "record" && editing && w && (
        <Dialog
          title="Check this record"
          onClose={() => setModal("")}
          footer={
            <>
              <Button onClick={() => setModal("")}>Cancel</Button>
              <Button primary type="submit" form="cashnarra-record-editor">
                Review this record
              </Button>
            </>
          }
        >
          <RecordForm
            formId="cashnarra-record-editor"
            showActions={false}
            initial={editing}
            workspace={w}
            draft={{ events, replaceIds, reason, allowDuplicates }}
            hidden={hidden}
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
        <Dialog
          title="Your account"
          onClose={() => setModal("")}
          error={recoveryError}
          footer={recoveryFooter}
        >
          <span className={s.eyebrow}>Workspaces</span>
          <div className={s.menuList}>
            {spaceSummaries.map((x) => (
              <button
                key={x.id}
                type="button"
                className={s.button}
                aria-current={x.id === wid ? "true" : undefined}
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
                    .catch((e) =>
                      reportError(
                        e.session
                          ? e.message
                          : "That workspace could not be opened. Choose it again to retry. Your saved records are still here.",
                      ),
                    );
                }}
              >
                {hidden ? "Workspace" : x.name} · {x.type}
              </button>
            ))}
          </div>
          <p className={s.hint}>
            One plan covers every workspace on this account.
          </p>
          <span className={s.eyebrow}>This account</span>
          <div className={s.menuList}>
            <Button onClick={() => navigate("accounts")}>Manage accounts</Button>
            <Button onClick={() => navigate("usage")}>Plan and usage</Button>
            <Button onClick={() => navigate("settings")}>
              Settings and privacy
            </Button>
            <Button onClick={() => setModal("logout")}>Sign out</Button>
          </div>
          {installPrompt && !standalone && (
            <>
              <span className={s.eyebrow}>On this phone</span>
              <div className={s.menuList}>
                <Button
                  onClick={() => {
                    const offer = installPrompt;
                    setInstallPrompt(null);
                    void offer.prompt().catch(() => {});
                  }}
                >
                  Add to your home screen
                </Button>
              </div>
              <p className={s.hint}>
                Opens CashNarra like an app. Your records stay on the account, not
                on the phone.
              </p>
            </>
          )}
          <hr />
          <details className={s.workspaceCreate}>
            <summary>Create a workspace</summary>
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
              <label htmlFor="workspace-name">Name</label>
              <input id="workspace-name" name="name" maxLength={100} required />
              <label htmlFor="workspace-type">Use</label>
              <select id="workspace-type" name="type">
                <option>Business</option>
                <option>Personal</option>
              </select>
              <div className={s.actions}>
                <Button primary type="submit" disabled={busy || !!dialogRecovery}>
                  Create workspace
                </Button>
              </div>
            </form>
          </details>
        </Dialog>
      )}
      {modal === "account" && (
        <FormDialog
          title="Track an account"
          formId="cashnarra-account-form"
          actionLabel="Add account"
          {...formDialogProps}
        >
          <form
            id="cashnarra-account-form"
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
              <input type="checkbox" name="unknown" defaultChecked />I don’t know
              the starting balance yet
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
          </form>
        </FormDialog>
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
        <Dialog
          title={hidden ? "Selected record" : selected.description}
          onClose={() => setModal("")}
          footer={
            <>
              <Button onClick={() => setModal("")}>Close</Button>
              {!w.records.find((r) => r.id === selected.id)?.removed && (
                <Button primary onClick={() => beginCorrection(selected)}>
                  Correct record
                </Button>
              )}
            </>
          }
        >
          <div className={s.recordDetail}>
            <div>
              <Amount value={selected.amount} hidden={hidden} large />
              <p>
                {labels[selected.kind]} · {readingDate(selected.date)}
                {selected.accountId
                  ? ` · ${hidden ? "Account hidden" : (w.accounts.find((a) => a.id === selected.accountId)?.name ?? "")}`
                  : ""}
                {selected.party && !hidden ? ` · ${selected.party}` : ""}
              </p>
            </div>
            <section>
              <h3>From your story</h3>
              <blockquote>
                {hidden
                  ? "Source hidden"
                  : (w.sources.find((s) => s.id === selected.sourceId)?.text ??
                    "Original words removed according to your privacy setting")}
              </blockquote>
            </section>
            <section>
              {(() => {
                const changes = w.history.filter(
                  (h) =>
                    h.before.id === selected.id ||
                    h.replacementIds.includes(selected.id),
                );
                return (
                  <>
                    <h3>Correction history</h3>
                    {changes.length ? (
                      changes.map((h, i) => (
                        <p key={i}>
                          {readingDate(h.at.slice(0, 10))} ·{" "}
                          {hidden ? "Reason hidden" : h.reason}
                          <br />
                          Previous amount:{" "}
                          <Amount value={h.before.amount} hidden={hidden} />
                        </p>
                      ))
                    ) : (
                      <p className={s.muted}>No corrections yet.</p>
                    )}
                  </>
                );
              })()}
            </section>
            <details className={s.reference}>
              <summary>Reference</summary>
              <small>Record {selected.id}</small>
            </details>
            {!w.records.find((r) => r.id === selected.id)?.removed && (
              <div className={s.actions}>
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
          </div>
        </Dialog>
      )}
      {modal === "move" && selected && w && (
        <MoveForm
          source={w}
          spaces={spaceSummaries}
          record={selected}
          hidden={hidden}
          originalRequest={retryOperation}
          onClose={() => setModal("")}
          onMove={async (data) => {
            await perform(data as Operation);
            setModal("");
          }}
        />
      )}
      {modal === "opening" && w && (
        <FormDialog
          title="Check your starting balance"
          formId="cashnarra-opening-form"
          actionLabel="Save starting balance"
          {...formDialogProps}
        >
          <form
            id="cashnarra-opening-form"
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
            <p className={s.formContext}>
              {hidden ? "Workspace" : w.name} ·{" "}
              {hidden
                ? "Account"
                : w.accounts.find((a) => a.id === accountId)?.name}{" "}
              · {w.currency}
              {w.accounts.find((a) => a.id === accountId)?.openingDate
                ? ` · ${readingDate(w.accounts.find((a) => a.id === accountId)!.openingDate)}`
                : ""}
            </p>
            <p>
              This changes the starting balance for this account and affected
              earlier reports. It is not new income.
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
            {w.openingHistory
              ?.filter((h) => h.before.id === accountId)
              .map((h, i) => (
                <p key={i}>
                  {h.at} · {hidden ? "Reason hidden" : h.reason}:{" "}
                  <Amount value={h.before.opening} hidden={hidden} /> →{" "}
                  <Amount value={h.after.opening} hidden={hidden} />
                </p>
              ))}
          </form>
        </FormDialog>
      )}{" "}
      {modal === "goal" && w && (
        <FormDialog
          title="What are you working towards?"
          formId="cashnarra-goal-form"
          actionLabel="Create goal"
          {...formDialogProps}
        >
          <form
            id="cashnarra-goal-form"
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
          </form>
        </FormDialog>
      )}
      {modal === "allocation" && goal && w && (
        <FormDialog
          title={`Mark money · ${goal.name}`}
          formId="cashnarra-allocation-form"
          actionLabel="Save mark"
          {...formDialogProps}
        >
          <form
            id="cashnarra-allocation-form"
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
                reportError((err as Error).message);
              }
            }}
          >
            <p className={s.formContext}>
              {hidden ? "Workspace" : w.name} ·{" "}
              {hidden
                ? "Account"
                : w.accounts.find((a) => a.id === goal.accountId)?.name}{" "}
              · {w.currency}
            </p>
            <label htmlFor="allocation-direction">
              What should this mark do?
            </label>
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
            {(() => {
              const account = w.accounts.find(
                (item) => item.id === goal.accountId,
              );
              const available = account ? accountBalance(w, account.id) : null;
              const markedHere = sum(goal.allocations.map((item) => item.amount));
              const markedElsewhere = sum(
                w.goals
                  .filter(
                    (item) =>
                      item.id !== goal.id && item.accountId === goal.accountId,
                  )
                  .flatMap((item) =>
                    item.allocations.map((entry) => entry.amount),
                  ),
              );
              return (
                <section
                  className={s.allocationFacts}
                  aria-label="Goal mark context"
                >
                  <p>On this account</p>
                  <dl>
                    <div>
                      <dt>Recorded balance</dt>
                      <dd>
                        <Amount value={available} hidden={hidden} />
                      </dd>
                    </div>
                    <div>
                      <dt>Marked for this goal</dt>
                      <dd>
                        <Amount value={markedHere} hidden={hidden} />
                      </dd>
                    </div>
                    <div>
                      <dt>Marked for other goals</dt>
                      <dd>
                        <Amount value={markedElsewhere} hidden={hidden} />
                      </dd>
                    </div>
                  </dl>
                  <p className={s.hint}>
                    A mark is a note. It does not move or reserve money.
                  </p>
                </section>
              );
            })()}
          </form>
        </FormDialog>
      )}
      {modal === "goal-review" && goal && (
        <FormDialog
          title="Review a month for this goal"
          formId="cashnarra-goal-review-form"
          actionLabel="Record review"
          {...formDialogProps}
        >
          <form
            id="cashnarra-goal-review-form"
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
            <p className={s.formContext}>{goal.name}</p>
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
                  Check unpaid balances and other payments you need to make before
                  setting more money aside.
                </li>
              </ol>
              <p>
                CashNarra uses the middle amount from the last three full months
                you checked. It cannot confirm that your records are complete or
                that you can afford the next amounts.
              </p>
              <p>
                Missing months are not zero. This confirms review, not
                affordability.
              </p>
            </details>
          </form>
        </FormDialog>
      )}
      {modal === "scenario" && goal && (
        <Dialog
          title="What if you saved a different amount?"
          onClose={() => setModal("")}
        >
          <p>See how a different monthly amount could change your goal date.</p>
          <span className={s.badge}>
            Just a try · your saved records stay as they are
          </span>
          {(() => {
            const summarise = (f: ReturnType<typeof forecast>) =>
              f.count === null
                ? "No date yet"
                : f.count === 0
                  ? "Already reached"
                  : f.period
                    ? `About ${f.count} ${f.count === 1 ? "month" : "months"} · around ${new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(Number(f.period.slice(0, 4)), Number(f.period.slice(5, 7)) - 1, 1)))}`
                    : `About ${f.count} months`;
            const recorded = forecast(goal, date);
            let tried: ReturnType<typeof forecast> | null = null;
            let problem = "";
            try {
              tried = forecast(goal, date, scenario);
            } catch {
              problem = "Enter an amount with up to two decimal places.";
            }
            return (
              <>
                <div className={s.compare}>
                  <div>
                    <small>Recorded pace</small>
                    {recorded.pace && recorded.count !== null ? (
                      <>
                        <strong>{summarise(recorded)}</strong>
                        <span>
                          At <Amount value={recorded.pace} hidden={hidden} /> a
                          month, from the months you checked.
                        </span>
                      </>
                    ) : (
                      <span>
                        There is no recorded monthly pace yet. You can still try
                        an amount.
                      </span>
                    )}
                  </div>
                  <div>
                    <small>Your try</small>
                    {tried ? (
                      <>
                        <strong>{summarise(tried)}</strong>
                        <span>
                          At <Amount value={tried.pace ?? "0.00"} hidden={hidden} />{" "}
                          a month, the amount below.
                        </span>
                      </>
                    ) : (
                      <span role="alert">{problem}</span>
                    )}
                  </div>
                </div>
                <div className={s.field}>
                <label htmlFor="scenario">
                  Try a different amount{w ? ` · ${w.currency}` : ""}
                </label>
                <input
                  id="scenario"
                  value={scenario}
                  inputMode="decimal"
                  aria-invalid={problem ? true : undefined}
                  onChange={(e) => setScenario(e.target.value)}
                />
                {tried && <p className={s.hint}>{tried.reason}</p>}
                </div>
              </>
            );
          })()}
          <div className={s.actions}>
            <Button quiet onClick={() => setScenario("600.00")}>
              Reset to GH₵600.00
            </Button>
          </div>
        </Dialog>
      )}
      {modal === "checkin" && (
        <FormDialog
          title="Start with the day you remember"
          formId="cashnarra-checkin-form"
          actionLabel="Record check-in"
          {...formDialogProps}
        >
          <form
            id="cashnarra-checkin-form"
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
              Anything else to add? I’m done for today is optional. You can catch
              up on another day later. A check-in does not mean your finances are
              complete.
            </p>
          </form>
        </FormDialog>
      )}
      {modal === "workspace-tools" && w && (
        <Dialog
          title="People, due dates and goals"
          onClose={() => setModal("")}
          error={
            dialogError ||
            (dialogRecovery
              ? "An earlier change is not confirmed. Check its original request before editing these details."
              : "")
          }
          footer={recoveryFooter}
        >
          <fieldset
            className={s.formBody}
            disabled={busy || !!dialogRecovery}
            aria-label="Workspace details"
          >
            <WorkspaceTools
              w={w}
              hidden={hidden}
              busy={busy}
              startAt={toolSection}
              errorHandledByDialog
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
          </fieldset>
        </Dialog>
      )}
      {modal === "discard" && (
        <Dialog
          title="Discard this draft?"
          onClose={() => setModal("")}
          error={recoveryError}
          footer={
            recoveryFooter ?? (
              <>
                <Button onClick={() => setModal("")}>Cancel</Button>
                <Button
                  disabled={busy || !!dialogRecovery}
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
              </>
            )
          }
        >
          <p>
            Your confirmed records stay intact. Copy any unsaved words you need
            first.
          </p>
        </Dialog>
      )}
      {modal === "deletion" && (
        <Dialog
          title="Request account-data deletion"
          onClose={() => setModal("")}
          error={recoveryError}
          footer={
            recoveryFooter ?? (
              <>
                <Button onClick={() => setModal("")}>Cancel</Button>
                <Button
                  primary
                  disabled={busy || !!dialogRecovery}
                  onClick={() => simple("request", { kind: "deletion" })}
                >
                  Record deletion request
                </Button>
              </>
            )
          }
        >
          <p>
            This records your request. It does not delete your records now. Some
            financial records may need to be kept by law.
          </p>
        </Dialog>
      )}
      {modal === "shared-device" && (
        <Dialog
          title="Clear drafts on this device?"
          onClose={() => setModal("")}
          error={dialogError}
          footer={
            <>
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
            </>
          }
        >
          <p>
            Shared-device mode stops keeping unfinished stories on this device and
            clears the ones already stored here. Saved records stay.
          </p>
        </Dialog>
      )}
      {modal === "logout" && (
        <Dialog
          title="Sign out of this device?"
          onClose={() => setModal("")}
          error={recoveryError}
          footer={
            recoveryFooter ?? (
              <>
                {" "}
                <Button onClick={() => setModal("")}>Stay</Button>
                <Button
                  primary
                  disabled={busy || !!dialogRecovery}
                  onClick={async () => {
                    if (pending || retryOperation) {
                      setError(
                        "Check the unconfirmed action before signing out.",
                      );
                      setModal("");
                      return;
                    }
                    setBusy(true);
                    try {
                      if (!demo) {
                        const { error: signOutError } =
                          await supabase().auth.signOut();
                        if (signOutError) throw signOutError;
                      }
                      const response = await fetch("/api/logout", {
                        method: "POST",
                      });
                      if (!response.ok)
                        throw new Error(
                          "Sign-out did not finish. You are still signed in. Try again.",
                        );
                      recordsTab.clear();
                      recordsPosition.current = {};
                      await clearDrafts();
                      const channel = new BroadcastChannel("cashnarra-session");
                      channel.postMessage("signed-out");
                      channel.close();
                      setText("");
                      setEvents([]);
                      location.href = "/";
                    } catch (e) {
                      reportError(
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
              </>
            )
          }
        >
          <p>
            A complete draft file keeps edited records as well as your words. Keep
            the file private and restore it in the same account and workspace.
          </p>
          <Button onClick={downloadCompleteDraft}>Download complete draft</Button>
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
                  .catch(() => reportError("Select and copy the draft manually."))
              }
            >
              Copy draft
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
            transcriptionProvider={transcriptionProvider}
            maxSeconds={voiceSeconds}
            workspaceId={w.id}
            onWork={setVoiceWork}
            onTranscript={(value) => {
              changeDraft(text ? text + " " + value : value);
              setVoiceWork(false);
              setVoiceLeave(false);
              openComposer();
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
              else openComposer();
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
          error={recoveryError}
          footer={
            recoveryFooter ?? (
              <>
                <Button onClick={() => setModal("")}>Cancel</Button>
                <Button
                  primary
                  disabled={busy || !!dialogRecovery}
                  onClick={() => simple("retention", { days: 0 })}
                >
                  Remove original words now
                </Button>
              </>
            )
          }
        >
          <p>
            This removes the saved narration in this workspace. The financial
            records and correction history stay. You can cancel and keep the
            words.
          </p>
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
    </div>
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
  const scopeLabel = scope === "all"
    ? `${known.length} workspaces · one file for each`
    : hidden
      ? scope === "this" ? "This workspace" : "Another workspace"
      : scope === "this" ? workspace.name : others.find(item => item.id === otherId)?.name ?? "Choose a workspace";
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
          <section className={s.exportSummary} aria-label="Export scope">
            <strong>{scopeLabel}</strong>
            <p>{dates.label}</p>
            <p>All accounts are included. The Records search, account and type filters are not applied to this report.</p>
          </section>
          <p className={s.exportNote}>
            {scope === "all" && "The same dates are used for each file. Workspace records stay separate. "}
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

