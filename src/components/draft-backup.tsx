"use client";
import { useState, useId, useRef } from "react";
import type { Draft } from "@/lib/drafts";
import { draftBackup, restoreBackup } from "@/lib/draft-backup";
import { Button } from "./ui";
export default function DraftBackup({
  draft,
  onRestore,
  locked,
}: {
  draft: Draft;
  onRestore: (d: Draft) => void;
  locked: boolean;
}) {
  const [error, setError] = useState("");
  const [candidate, setCandidate] = useState<{
    draft: Draft;
    before: string;
  } | null>(null);
  const reading = useRef(0);
  const inputId = useId();
  return (
    <details>
      <summary>Back up or restore this unfinished story</summary>
      <p>
        The file includes your words, edited records and any unconfirmed save.
        Keep it private. Restoring replaces this unfinished story but does not
        save any financial records.
      </p>
      <Button
        onClick={() => {
          const url = URL.createObjectURL(
            new Blob([draftBackup(draft)], { type: "application/json" }),
          );
          const a = document.createElement("a");
          a.href = url;
          a.download = "CashNarra-private-draft.json";
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }}
      >
        Download complete draft
      </Button>
      <label htmlFor={inputId}>Restore a private draft file</label>
      <input
        id={inputId}
        type="file"
        accept=".json,application/json"
        disabled={locked}
        onChange={async (e) => {
          const input = e.currentTarget;
          const file = input.files?.[0];
          if (!file) return;
          const read = ++reading.current;
          const before = JSON.stringify(draft);
          setCandidate(null);
          try {
            if (file.size > 256000)
              throw new Error("That backup is too large.");
            const restored = restoreBackup(
              await file.text(),
              draft.ownerId,
              draft.workspaceId,
            );
            if (read !== reading.current) return;
            setCandidate({ draft: restored, before });
            setError("");
          } catch (x) {
            if (read === reading.current) setError((x as Error).message);
          } finally {
            input.value = "";
          }
        }}
      />
      {candidate && (
        <section aria-label="Review draft restoration">
          <p>
            This backup is for {candidate.draft.date} and contains{" "}
            {candidate.draft.events.length} records to review.
            {candidate.draft.pendingRequest
              ? " It also includes a save whose result still needs checking."
              : ""}
          </p>
          <p>
            Your current unfinished story will be replaced. Download it first if
            you want to keep both.
          </p>
          {candidate.before !== JSON.stringify(draft) && (
            <p role="status">
              Your draft changed while this backup was open. Choose the file
              again to review it against your latest work.
            </p>
          )}
          <Button
            disabled={locked || candidate.before !== JSON.stringify(draft)}
            onClick={() => {
              onRestore(candidate.draft);
              setCandidate(null);
            }}
          >
            Replace my unfinished story
          </Button>
          <Button
            onClick={() => {
              reading.current++;
              setCandidate(null);
              setError("");
            }}
          >
            Keep my current story
          </Button>
        </section>
      )}
      <p role="alert">{error}</p>
    </details>
  );
}
