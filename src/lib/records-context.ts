import { calendarDate } from "@/domain/dates";
import type { Workspace } from "@/domain/types";

export const RECORDS_CONTEXT_KEY = "cashnarra-records-context-v1";
const filters = [
  "all",
  "in",
  "out",
  "transfer",
  "credit_sale",
  "credit_expense",
] as const;
export type RecordsContext = {
  search: string;
  filter: string;
  accountId: string;
  range: { from: string; to: string } | null;
  top: number;
  recordId?: string;
};
type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type Entry = { workspaceId: string; context: RecordsContext };
type Saved = {
  version: 1;
  owner: string;
  activeWorkspaceId: string;
  entries: Entry[];
};
export const emptyRecordsContext = (): RecordsContext => ({
  search: "",
  filter: "all",
  accountId: "",
  range: null,
  top: 0,
});

function clean(value: unknown): RecordsContext {
  const v =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  const range = v.range as RecordsContext["range"];
  return {
    search: typeof v.search === "string" ? v.search.slice(0, 300) : "",
    filter: filters.includes(v.filter as (typeof filters)[number])
      ? (v.filter as string)
      : "all",
    accountId:
      typeof v.accountId === "string" && v.accountId.length <= 100
        ? v.accountId
        : "",
    range:
      range &&
      calendarDate(range.from) &&
      calendarDate(range.to) &&
      range.from <= range.to
        ? { from: range.from, to: range.to }
        : null,
    top:
      typeof v.top === "number" && Number.isFinite(v.top)
        ? Math.max(0, Math.min(v.top, 1_000_000))
        : 0,
    ...(typeof v.recordId === "string" && v.recordId.length <= 100
      ? { recordId: v.recordId }
      : {}),
  };
}

/** Private, bounded UI context in this tab. It never authorizes or stores records. */
export class RecordsTabContext {
  private owner = "";
  private allowed = new Set<string>();
  private saved: Saved | null = null;
  constructor(private storage: () => Store = () => window.sessionStorage) {}

  private read(owner: string): Saved {
    const empty: Saved = {
      version: 1,
      owner,
      activeWorkspaceId: "",
      entries: [],
    };
    try {
      const raw = this.storage().getItem(RECORDS_CONTEXT_KEY);
      if (!raw) return empty;
      if (raw.length > 32_768) throw new Error("Context too large");
      const value = JSON.parse(raw);
      if (
        value?.version !== 1 ||
        value.owner !== owner ||
        !Array.isArray(value.entries)
      )
        throw new Error("Context scope changed");
      return {
        ...empty,
        activeWorkspaceId:
          typeof value.activeWorkspaceId === "string"
            ? value.activeWorkspaceId
            : "",
        entries: value.entries
          .slice(-12)
          .flatMap((entry: Entry) =>
            entry &&
            typeof entry.workspaceId === "string" &&
            entry.workspaceId.length <= 100
              ? [
                  {
                    workspaceId: entry.workspaceId,
                    context: clean(entry.context),
                  },
                ]
              : [],
          ),
      };
    } catch {
      try {
        this.storage().removeItem(RECORDS_CONTEXT_KEY);
      } catch {}
      return empty;
    }
  }

  preferredWorkspace(owner: string, allowed: string[]): string {
    const saved =
      this.owner === owner && this.saved ? this.saved : this.read(owner);
    return allowed.includes(saved.activeWorkspaceId)
      ? saved.activeWorkspaceId
      : "";
  }

  matches(owner: string, workspaceId: string): boolean {
    return (
      this.owner === owner && this.saved?.activeWorkspaceId === workspaceId
    );
  }

  activate(
    owner: string,
    workspace: Workspace,
    allowed: string[],
  ): RecordsContext {
    const saved =
      this.owner === owner && this.saved ? this.saved : this.read(owner);
    this.owner = owner;
    this.allowed = new Set(allowed);
    this.saved = {
      ...saved,
      activeWorkspaceId: workspace.id,
      entries: saved.entries.filter((entry) =>
        this.allowed.has(entry.workspaceId),
      ),
    };
    const context = clean(
      this.saved.entries.find((entry) => entry.workspaceId === workspace.id)
        ?.context,
    );
    if (!workspace.accounts.some((account) => account.id === context.accountId))
      context.accountId = "";
    if (
      !workspace.records.some(
        (record) => !record.removed && record.id === context.recordId,
      )
    )
      delete context.recordId;
    return context;
  }

  save(owner: string, workspaceId: string, context: RecordsContext): boolean {
    // A stale scroll/pagehide callback cannot recreate private state after logout.
    if (
      !owner ||
      owner !== this.owner ||
      !this.saved ||
      !this.allowed.has(workspaceId)
    )
      return false;
    this.saved.entries = [
      ...this.saved.entries.filter(
        (entry) => entry.workspaceId !== workspaceId,
      ),
      { workspaceId, context: clean(context) },
    ].slice(-12);
    try {
      this.storage().setItem(RECORDS_CONTEXT_KEY, JSON.stringify(this.saved));
      return true;
    } catch {
      return false;
    }
  }

  clear(): void {
    this.owner = "";
    this.allowed.clear();
    this.saved = null;
    try {
      this.storage().removeItem(RECORDS_CONTEXT_KEY);
    } catch {}
  }
}
