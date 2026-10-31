"use client";
import { useState, useEffect } from "react";
import type { Workspace, RecordEvent, WorkspaceSummary } from "@/domain/types";
import { Button, Amount, Dialog } from "./ui";
import s from "./app.module.css";
export default function MoveForm({
  source,
  spaces,
  record,
  onMove,
  onClose,
  hidden = false,
  originalRequest,
}: {
  source: Workspace;
  spaces: WorkspaceSummary[];
  record: RecordEvent;
  onMove: (data: Record<string, unknown>) => Promise<unknown>;
  onClose: () => void;
  hidden?: boolean;
  originalRequest?: Record<string, unknown> | null;
}) {
  const originalMove =
    originalRequest?.action === "move" ? originalRequest : null;
  const [destination, setDestination] = useState(
      typeof originalMove?.destinationId === "string"
        ? originalMove.destinationId
        : "",
    ),
    [error, setError] = useState(
      originalRequest
        ? "An earlier change is not confirmed. Check its original request before making another change."
        : "",
    ),
    [busy, setBusy] = useState(false),
    [request, setRequest] = useState<Record<string, unknown> | null>(
      originalRequest ?? null,
    );
  const [loadedTarget, setLoadedTarget] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(!!destination);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [accountId, setAccountId] = useState(
    typeof originalMove?.accountId === "string" ? originalMove.accountId : "",
  );
  const target = loadedTarget?.id === destination ? loadedTarget : null;
  useEffect(() => {
    if (!destination) return;
    const controller = new AbortController();
    fetch(`/api/workspaces?workspace=${encodeURIComponent(destination)}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (!controller.signal.aborted) {
          setLoadedTarget(data.workspace);
          setAccountId((current) =>
            data.workspace.accounts.some(
              (a: { id: string }) => a.id === current,
            )
              ? current
              : "",
          );
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setLoadFailed(true);
          setError(
            "The accounts for this workspace could not be loaded. Try loading them again.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [destination, loadAttempt]);
  return (
    <Dialog
      title="Move a record safely"
      onClose={onClose}
      error={error}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            primary
            type="submit"
            form="cashnarra-move-form"
            disabled={
              busy ||
              (!request && (!target?.accounts.length || loading || loadFailed))
            }
          >
            {busy
              ? "Checking change…"
              : request
                ? request.action === "move"
                  ? "Retry original move"
                  : "Check change result"
                : "Save reviewed move"}
          </Button>
        </>
      }
    >
      {loadFailed && (
        <Button
          quiet
          disabled={busy || !!request}
          onClick={() => {
            setError("");
            setLoadFailed(false);
            setLoading(true);
            setLoadAttempt((attempt) => attempt + 1);
          }}
        >
          Try loading accounts again
        </Button>
      )}
      <form
        id="cashnarra-move-form"
        className={s.moveForm}
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          if (!target && !request) return;
          const op = request ?? {
            action: "move",
            workspaceId: source.id,
            expectedVersion: source.version,
            key: crypto.randomUUID(),
            destinationId: target!.id,
            destinationVersion: target!.version,
            recordId: record.id,
            accountId: f.get("account"),
            reason: f.get("reason"),
          };
          setRequest(op);
          setBusy(true);
          setError("");
          try {
            await onMove(op);
          } catch (x) {
            const failure = x as Error & {
              rejected?: boolean;
              session?: boolean;
            };
            if (failure.rejected) setRequest(null);
            setError(
              failure.rejected || failure.session
                ? failure.message
                : "The change could not be confirmed. Check the original request to recover its result safely.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <p>
          {hidden ? "Selected record" : record.description} ·{" "}
          <Amount value={record.amount} hidden={hidden} />
        </p>
        <p>
          Use this only for a record filed in the wrong workspace. Both sides
          save together and retain their source history.
        </p>
        <fieldset
          className={`${s.formBody} ${s.moveFields}`}
          disabled={busy || !!request}
          aria-label="Reviewed move details"
        >
          <label htmlFor="move-workspace">Correct workspace</label>
          <select
            id="move-workspace"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setLoadedTarget(null);
              setAccountId("");
              setError("");
              setLoadFailed(false);
              setLoading(!!e.target.value);
            }}
            required
          >
            <option value="">Choose workspace</option>
            {spaces
              .filter((w) => w.id !== source.id)
              .map((w) => (
                <option key={w.id} value={w.id}>
                  {hidden ? w.type + " workspace" : w.name}
                </option>
              ))}
          </select>
          <label htmlFor="move-account">
            Account that actually received or paid
          </label>
          <select
            id="move-account"
            name="account"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            required
            disabled={!target?.accounts.length || loading || loadFailed}
          >
            <option value="">Choose account</option>
            {target?.accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {hidden ? a.type + " account" : a.name}
              </option>
            ))}
          </select>
          <span role="status" className={s.hint}>
            {loading
              ? "Loading accounts…"
              : target && !target.accounts.length
                ? "There are no accounts in this workspace yet. Add one there, then reopen this move."
                : ""}
          </span>
          <label htmlFor="move-reason">Why was this filed incorrectly?</label>
          <input
            id="move-reason"
            name="reason"
            defaultValue={
              typeof originalMove?.reason === "string"
                ? originalMove.reason
                : ""
            }
            required
            maxLength={300}
          />
          <label className={s.checkLabel}>
            <input type="checkbox" defaultChecked={!!originalMove} required />
            This was misfiled. The source workspace did not fund a personal
            purchase.
          </label>
        </fieldset>
        <p className={s.notice}>
          If the business paid, record the owner withdrawal in the business
          instead. Linked debts and transfers need coordinated corrections.
        </p>
        <span role="status" className={s.srOnly}>
          {busy ? "Saving move…" : ""}
        </span>
      </form>
    </Dialog>
  );
}
