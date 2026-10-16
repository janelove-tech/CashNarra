"use client";
import { useState, useEffect } from "react";
import type { Workspace, RecordEvent, WorkspaceSummary } from "@/domain/types";
import { Button, Amount } from "./ui";
import s from "./app.module.css";
export default function MoveForm({
  source,
  spaces,
  record,
  onMove,
}: {
  source: Workspace;
  spaces: WorkspaceSummary[];
  record: RecordEvent;
  onMove: (data: Record<string, unknown>) => Promise<unknown>;
}) {
  const [destination, setDestination] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [request, setRequest] = useState<Record<string, unknown> | null>(null);
  const [loadedTarget, setLoadedTarget] = useState<Workspace | null>(null);
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
        if (!controller.signal.aborted) setLoadedTarget(data.workspace);
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      });
    return () => controller.abort();
  }, [destination]);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        if (!target) return;
        const op = request ?? {
          action: "move",
          workspaceId: source.id,
          expectedVersion: source.version,
          key: crypto.randomUUID(),
          destinationId: target.id,
          destinationVersion: target.version,
          recordId: record.id,
          accountId: f.get("account"),
          reason: f.get("reason"),
        };
        setRequest(op);
        setBusy(true);
        try {
          await onMove(op);
        } catch (x) {
          setError((x as Error).message + " Retry keeps the same request ID.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <p>
        {record.description} · <Amount value={record.amount} />
      </p>
      <p>
        Use this only for a record filed in the wrong workspace. Both sides save
        together and retain their source history.
      </p>
      <fieldset disabled={busy || !!request}>
        <label htmlFor="move-workspace">Correct workspace</label>
        <select
          id="move-workspace"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        >
          <option value="">Choose workspace</option>
          {spaces
            .filter((w) => w.id !== source.id)
            .map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
        </select>
        <label htmlFor="move-account">
          Account that actually received or paid
        </label>
        <select id="move-account" name="account" required>
          <option value="">Choose account</option>
          {target?.accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <label htmlFor="move-reason">Why was this filed incorrectly?</label>
        <input id="move-reason" name="reason" required maxLength={300} />
        <label className={s.checkLabel}>
          <input type="checkbox" required />
          This was misfiled. The source workspace did not fund a personal
          purchase.
        </label>
      </fieldset>
      <p className={s.notice}>
        If the business paid, record the owner withdrawal in the business
        instead. Linked debts and transfers need coordinated corrections.
      </p>
      <p role="alert">{error}</p>
      <Button primary type="submit" disabled={busy || !target}>
        {request ? "Retry original move" : "Save reviewed move"}
      </Button>
    </form>
  );
}
