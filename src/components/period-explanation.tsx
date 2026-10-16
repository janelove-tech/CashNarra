"use client";
import { useState } from "react";
import type { Explanation } from "@/server/ai";
import { Button } from "./ui";
export default function PeriodExplanation({
  workspaceId,
  from,
  to,
  onRecord,
}: {
  workspaceId: string;
  from: string;
  to: string;
  onRecord: (id: string) => void;
}) {
  const [result, setResult] = useState<Explanation | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <section>
      <Button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            const res = await fetch("/api/explain", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ workspaceId, from, to }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setResult(data);
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Reading this period…" : "Explain this period in words"}
      </Button>
      {result && (
        <>
          <p>
            Written with AI. Check the linked records if something seems wrong.
            The totals above come from your saved records.
          </p>
          {result.paragraphs.map((p, i) => (
            <div key={i}>
              <p>{p.text}</p>
              {p.recordIds.map((id, j) => (
                <Button key={id} onClick={() => onRecord(id)}>
                  View record {j + 1}
                </Button>
              ))}
            </div>
          ))}
        </>
      )}
      <p role="alert">{error}</p>
    </section>
  );
}
