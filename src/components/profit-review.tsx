"use client";
import { useState } from "react";
import type { Workspace } from "@/domain/types";
import type { ProfitLossReport } from "@/domain/profit-loss";
import { money, parseEntryAmount } from "@/domain/money";
import { Amount, Button } from "./ui";
import s from "./app.module.css";

type CostChoice =
  | { kind: "unknown" }
  | { kind: "none" }
  | { kind: "amount"; text: string };

function choiceValue(choice: CostChoice) {
  if (choice.kind === "unknown") return null;
  if (choice.kind === "none") return "0.00";
  if (!choice.text.trim()) return null;
  return money(parseEntryAmount(choice.text));
}

function CostField({
  id,
  label,
  choice,
  onChange,
}: {
  id: string;
  label: string;
  choice: CostChoice;
  onChange: (choice: CostChoice) => void;
}) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={choice.kind}
        onChange={(event) => {
          const kind = event.target.value;
          if (kind === "none") onChange({ kind: "none" });
          else if (kind === "amount")
            onChange({
              kind: "amount",
              text: choice.kind === "amount" ? choice.text : "",
            });
          else onChange({ kind: "unknown" });
        }}
      >
        <option value="unknown">Not checked yet</option>
        <option value="none">None in this period</option>
        <option value="amount">I have a figure</option>
      </select>
      {choice.kind === "amount" && (
        <>
          <label htmlFor={`${id}-amount`}>{label} · GHS</label>
          <input
            id={`${id}-amount`}
            inputMode="decimal"
            value={choice.text}
            onChange={(event) =>
              onChange({ kind: "amount", text: event.target.value })
            }
          />
        </>
      )}
    </div>
  );
}

export default function ProfitReview({
  workspace,
  from,
  to,
  hidden,
}: {
  workspace: Workspace;
  from: string;
  to: string;
  hidden: boolean;
}) {
  const [costOfSales, setCostOfSales] = useState<CostChoice>({ kind: "unknown" });
  const [depreciation, setDepreciation] = useState<CostChoice>({ kind: "unknown" });
  const [otherCosts, setOtherCosts] = useState<CostChoice>({ kind: "unknown" });
  const [salesComplete, setSalesComplete] = useState(false);
  const [costsComplete, setCostsComplete] = useState(false);
  const [note, setNote] = useState("");
  const [report, setReport] = useState<ProfitLossReport | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError("");
        try {
          const response = await fetch("/api/profit-loss", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              workspaceId: workspace.id,
              expectedVersion: workspace.version,
              from,
              to,
              review: {
                costOfSales: choiceValue(costOfSales),
                depreciation: choiceValue(depreciation),
                otherCosts: choiceValue(otherCosts),
                salesComplete,
                costsComplete,
                note,
              },
            }),
          });
          const data = await response.json();
          if (!response.ok)
            throw new Error(data.error || "The report could not be prepared.");
          setReport(data.report);
        } catch (reason) {
          setReport(null);
          setError((reason as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <p>
        Sales and recorded expenses come from saved records. Stock and equipment
        you bought are shown separately. They are not treated as the cost of
        this period. Figures you add here are for this estimate only. They are
        not saved, and they do not move money.
      </p>
      <CostField
        id="cost-of-sales"
        label="Cost of the goods sold"
        choice={costOfSales}
        onChange={setCostOfSales}
      />
      <CostField
        id="depreciation"
        label="Equipment cost used up"
        choice={depreciation}
        onChange={setDepreciation}
      />
      <CostField
        id="other-costs"
        label="Other costs missing from the records"
        choice={otherCosts}
        onChange={setOtherCosts}
      />
      <label className={s.checkLabel}>
        <input
          type="checkbox"
          checked={salesComplete}
          onChange={(event) => setSalesComplete(event.target.checked)}
        />
        Sales and other income for these dates are complete, including unpaid
        sales.
      </label>
      <label className={s.checkLabel}>
        <input
          type="checkbox"
          checked={costsComplete}
          onChange={(event) => setCostsComplete(event.target.checked)}
        />
        Recorded expenses and unpaid bills for these dates are complete.
      </label>
      <label htmlFor="profit-note">Where did the extra figures come from?</label>
      <textarea
        id="profit-note"
        value={note}
        maxLength={2000}
        onChange={(event) => setNote(event.target.value)}
      />
      <Button primary type="submit" disabled={busy}>
        {busy ? "Working this out…" : "Work this out"}
      </Button>
      {error && (
        <p role="alert" className={s.error}>
          {error}
        </p>
      )}
      {report && (
        <div role="status">
          <p>From saved records</p>
          <p>
            Sales, including unpaid sales:{" "}
            <Amount value={report.sales} hidden={hidden} />
          </p>
          <p>
            Other income: <Amount value={report.otherIncome} hidden={hidden} />
          </p>
          <p>
            Business expenses, including unpaid bills:{" "}
            <Amount value={report.expenses} hidden={hidden} />
          </p>
          <p>
            Interest: <Amount value={report.interest} hidden={hidden} />
          </p>
          <p>
            Stock purchased, not counted as a cost of goods sold:{" "}
            <Amount value={report.stockPurchased} hidden={hidden} />
          </p>
          <p>
            Equipment purchased, not counted as used up:{" "}
            <Amount value={report.equipmentPurchased} hidden={hidden} />
          </p>
          {report.profit === null ? (
            <>
              <h3>Profit cannot be worked out yet.</h3>
              <ul>
                {report.missing.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h3>Profit or loss before income tax</h3>
              <Amount value={report.profit} hidden={hidden} large />
              <p>{report.basis}</p>
            </>
          )}
          <p>{report.exclusions}</p>
        </div>
      )}
    </form>
  );
}
