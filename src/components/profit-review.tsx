"use client";
import { useState } from "react";
import type { Workspace } from "@/domain/types";
import {
  emptyProfitReview,
  profitLoss,
  type ProfitLossReport,
  type ProfitReview,
} from "@/domain/profit-loss";
import { D, money, parseEntryAmount } from "@/domain/money";
import { rangeLabel } from "@/domain/periods";
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
        <option value="none">None beyond the records</option>
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

function Line({
  label,
  value,
  hidden,
}: {
  label: string;
  value: string | null;
  hidden: boolean;
}) {
  if (value === null || D(value).isZero()) return null;
  return (
    <div>
      <dt>{label}</dt>
      <dd>
        <Amount value={value} hidden={hidden} />
      </dd>
    </div>
  );
}

function Statement({
  report,
  from,
  to,
  hidden,
}: {
  report: ProfitLossReport;
  from: string;
  to: string;
  hidden: boolean;
}) {
  const aside =
    D(report.stockPurchased).isZero() && D(report.equipmentPurchased).isZero();
  return (
    <section className={s.statement}>
      <p className={s.statementPeriod}>{rangeLabel(from, to)}</p>
      <h3>Counted from the records</h3>
      <dl className={s.statementLines}>
        <Line
          label="Sales, including unpaid sales"
          value={report.sales}
          hidden={hidden}
        />
        <Line label="Other income" value={report.otherIncome} hidden={hidden} />
        <Line
          label="Business expenses, including unpaid bills"
          value={report.expenses}
          hidden={hidden}
        />
        <Line label="Interest" value={report.interest} hidden={hidden} />
        <Line
          label="Cost of goods sold"
          value={report.costOfSales}
          hidden={hidden}
        />
        <Line
          label="Equipment used up"
          value={report.depreciation}
          hidden={hidden}
        />
        <Line label="Other costs" value={report.otherCosts} hidden={hidden} />
      </dl>
      <h3>Kept out of this profit</h3>
      {aside ? (
        <p>No stock or equipment purchases are recorded in this period.</p>
      ) : (
        <dl className={s.statementLines}>
          <Line
            label="Stock purchased"
            value={report.stockPurchased}
            hidden={hidden}
          />
          <Line
            label="Equipment purchased"
            value={report.equipmentPurchased}
            hidden={hidden}
          />
        </dl>
      )}
    </section>
  );
}

export default function ProfitReview({
  workspace,
  from,
  to,
  today,
  hidden,
  onClose,
}: {
  workspace: Workspace;
  from: string;
  to: string;
  today: string;
  hidden: boolean;
  onClose: () => void;
}) {
  const recorded = profitLoss(workspace, from, to, emptyProfitReview, today);
  const [askFigures, setAskFigures] = useState(false);
  const [costOfSales, setCostOfSales] = useState<CostChoice>({ kind: "unknown" });
  const [depreciation, setDepreciation] = useState<CostChoice>({ kind: "unknown" });
  const [otherCosts, setOtherCosts] = useState<CostChoice>({ kind: "unknown" });
  const [note, setNote] = useState("");
  const [report, setReport] = useState<ProfitLossReport | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(review: ProfitReview) {
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
          review,
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
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit({
          costOfSales: choiceValue(costOfSales),
          depreciation: choiceValue(depreciation),
          otherCosts: choiceValue(otherCosts),
          salesComplete: true,
          costsComplete: true,
          note,
        });
      }}
    >
      <Statement report={report ?? recorded} from={from} to={to} hidden={hidden} />
      <p className={s.statementNote}>
        Business expenses and interest already count. A stock purchase is not
        the cost of goods sold, and an equipment purchase is not the amount
        used up. Transfers, loans, money taken home and payments of older
        balances do not count.
      </p>
      <p>Do these records already include every cost for this period?</p>
      <div className={s.actions}>
        <Button
          primary={!report?.profit}
          disabled={busy}
          onClick={() => {
            setAskFigures(false);
            void submit({
              costOfSales: "0.00",
              depreciation: "0.00",
              otherCosts: "0.00",
              salesComplete: true,
              costsComplete: true,
              note: "",
            });
          }}
        >
          Yes, work out the profit
        </Button>
        <Button
          disabled={busy}
          onClick={() => {
            setAskFigures(true);
            setReport(null);
          }}
        >
          No, something is missing
        </Button>
      </div>
      {askFigures && (
        <>
          <p>
            Enter only a cost that is not already in the business expenses.
            If some of the stock was sold, enter that cost here. Leave the
            rest as not checked, or say none beyond the records.
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
            label="Any other missing cost"
            choice={otherCosts}
            onChange={setOtherCosts}
          />
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
        </>
      )}
      {error && (
        <p role="alert" className={s.error}>
          {error}
        </p>
      )}
      {report?.profit === null && (
        <div role="status">
          <h3>Profit cannot be worked out yet.</h3>
          <ul>
            {report.missing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {report?.profit !== null && report && (
        <div className={s.statementResult} role="status">
          <h3>Profit or loss before income tax</h3>
          <Amount value={report.profit} hidden={hidden} large />
          <p className={s.statementNote}>{report.basis}</p>
          <p className={s.statementNote}>{report.exclusions}</p>
        </div>
      )}
      {report?.profit !== null && report && (
        <div className={s.actions}>
          <Button primary onClick={onClose}>
            Done
          </Button>
        </div>
      )}
    </form>
  );
}
