"use client";
import type { Workspace } from "@/domain/types";
import { obligations } from "@/domain/ledger";
import { debtDate } from "@/domain/planning";
import { Button, Amount } from "./ui";
import { useEffect, useRef, useState } from "react";
import { sum } from "@/domain/money";
import s from "./app.module.css";
export default function WorkspaceTools({
  w,
  save: onSave,
  busy,
  hidden,
  startAt = "people",
  errorHandledByDialog = false,
}: {
  w: Workspace;
  save: (action: string, data: Record<string, unknown>) => Promise<void>;
  busy: boolean;
  hidden: boolean;
  startAt?: "people" | "goals";
  errorHandledByDialog?: boolean;
}) {
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [search, setSearch] = useState("");
  const peopleHeading = useRef<HTMLHeadingElement>(null);
  const goalHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const heading =
        startAt === "goals" ? goalHeading.current : peopleHeading.current;
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [startAt]);
  const today = new Date().toISOString().slice(0, 10);
  const people = (w.contacts ?? []).filter((c) =>
    c.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
  );
  const unpaid = obligations(w)
    .filter((o) => o.remaining !== "0.00")
    .sort(
      (a, b) =>
        (debtDate(w, a.id) ?? "9999").localeCompare(
          debtDate(w, b.id) ?? "9999",
        ) || a.party.localeCompare(b.party),
    );
  const save = async (action: string, data: Record<string, unknown>) => {
    setError("");
    setFeedback("");
    try {
      await onSave(action, data);
      setFeedback("Changes saved.");
    } catch (e) {
      if (!errorHandledByDialog) setError((e as Error).message);
    }
  };
  const submit =
    (action: string, extras: Record<string, unknown> = {}) =>
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      void save(action, {
        ...Object.fromEntries(new FormData(e.currentTarget)),
        ...extras,
      });
    };
  return (
    <div className={s.workspaceTools}>
      {error && <p role="alert">{error}</p>}
      {feedback && (
        <p role="status" className={s.toolFeedback}>
          {feedback}
        </p>
      )}
      <h3 ref={peopleHeading} tabIndex={-1}>
        People you record money with
      </h3>
      <p>
        Save a name or nickname to reuse when recording. CashNarra does not
        contact anyone.
      </p>
      <form onSubmit={submit("contact")}>
        <label htmlFor="contact-name">Name or nickname</label>
        <input id="contact-name" name="name" required maxLength={100} />
        <label htmlFor="contact-role">Usually a</label>
        <select id="contact-role" name="role" defaultValue="Customer">
          <option value="Customer">
            {w.type === "Personal" ? "Someone who pays you" : "Customer"}
          </option>
          <option value="Supplier">
            {w.type === "Personal" ? "Someone you pay" : "Supplier"}
          </option>
          <option value="Other">
            {w.type === "Personal" ? "Someone else" : "Other"}
          </option>
        </select>
        <Button type="submit" disabled={busy}>
          Save person
        </Button>
      </form>
      <label htmlFor="find-person">Find a saved person</label>
      <input
        id="find-person"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {!people.length && (
        <p>
          {w.contacts?.length
            ? "No saved people match that name."
            : "No people saved yet. You can also enter a name directly when recording."}
        </p>
      )}
      <ul>
        {people.map((c) => (
          <li key={c.id}>
            {c.name} · {c.role}
            <details>
              <summary>Edit {c.name}</summary>
              <p>
                Changes apply to the saved-name list. Names on previous records
                stay as recorded.
              </p>
              <form
                key={`${c.name}-${c.role}`}
                onSubmit={submit("contact_edit", { contactId: c.id })}
              >
                <label htmlFor={`person-name-${c.id}`}>Saved name</label>
                <input
                  id={`person-name-${c.id}`}
                  name="name"
                  defaultValue={c.name}
                  required
                  maxLength={100}
                />
                <label htmlFor={`person-role-${c.id}`}>Usual role</label>
                <select
                  id={`person-role-${c.id}`}
                  name="role"
                  defaultValue={c.role}
                >
                  <option value="Customer">
                    {w.type === "Personal"
                      ? "Someone who pays you"
                      : "Customer"}
                  </option>
                  <option value="Supplier">
                    {w.type === "Personal" ? "Someone you pay" : "Supplier"}
                  </option>
                  <option value="Other">
                    {w.type === "Personal" ? "Someone else" : "Other"}
                  </option>
                </select>
                <Button type="submit" disabled={busy}>
                  Update saved person
                </Button>
              </form>
              <p>
                Removing this suggestion does not delete debts, payments or
                names in your records. You can save the name again later.
              </p>
              <Button
                disabled={busy}
                onClick={() => void save("contact_remove", { contactId: c.id })}
              >
                Remove {c.name} from suggestions
              </Button>
            </details>
          </li>
        ))}
      </ul>
      <h3>Payment dates</h3>
      <p>
        Dates help you remember. They do not send payment requests or move
        money.
      </p>
      {!unpaid.length && <p>No unpaid balances in your recorded activity.</p>}
      {unpaid.map((o) => (
        <form
          key={`${o.id}-${debtDate(w, o.id)}`}
          onSubmit={(e) => {
            e.preventDefault();
            const value = String(new FormData(e.currentTarget).get("date"));
            void save("debt_date", { recordId: o.id, date: value || null });
          }}
        >
          <label htmlFor={`due-${o.id}`}>
            {o.party} · <Amount value={o.remaining} hidden={hidden} />{" "}
            {o.direction === "receivable" ? "owed to you" : "you owe"}
          </label>
          <p>
            {!debtDate(w, o.id)
              ? "No payment date set"
              : debtDate(w, o.id)! < today
                ? "Payment date has passed"
                : debtDate(w, o.id) === today
                  ? "Payment date is today"
                  : "Upcoming payment date"}
          </p>
          <input
            id={`due-${o.id}`}
            name="date"
            type="date"
            min={o.date}
            defaultValue={debtDate(w, o.id) ?? ""}
          />
          <Button type="submit" disabled={busy}>
            Save payment date
          </Button>
          {debtDate(w, o.id) && (
            <Button
              disabled={busy}
              onClick={() =>
                void save("debt_date", { recordId: o.id, date: null })
              }
            >
              Clear payment date for {o.party}
            </Button>
          )}
        </form>
      ))}
      {!!w.debtDates?.length && (
        <details>
          <summary>Previous payment dates</summary>
          {w.debtDates
            .slice()
            .reverse()
            .map((entry, index) => {
              const record = w.records.find((r) => r.id === entry.recordId);
              return (
                <p key={index}>
                  {record?.party ?? "Previous balance"} ·{" "}
                  {entry.date
                    ? `Payment date: ${entry.date}`
                    : "Payment date cleared"}
                  {record?.removed ? " · previous version of this balance" : ""}
                  {" · changed "}
                  {entry.at.slice(0, 10)}
                </p>
              );
            })}
        </details>
      )}
      <h3 ref={goalHeading} tabIndex={-1}>
        Change a goal
      </h3>
      <p>
        Changing a target changes the estimate, not the money you have already
        marked for this goal.
      </p>
      {hidden && <p>Show amounts to edit your goal targets.</p>}
      {!w.goals.length && (
        <p>
          No goals yet. Open Plan to add an optional goal when you are ready.
        </p>
      )}
      {!hidden &&
        w.goals.map((g) => (
          <form
            key={`${g.id}-${g.target}-${g.name}`}
            onSubmit={submit("goal_edit", { goalId: g.id })}
          >
            <label htmlFor={`goal-name-${g.id}`}>Goal name</label>
            <input
              id={`goal-name-${g.id}`}
              name="name"
              defaultValue={g.name}
              required
              maxLength={100}
            />
            <label htmlFor={`goal-target-${g.id}`}>Target · GHS</label>
            <input
              id={`goal-target-${g.id}`}
              name="target"
              defaultValue={g.target}
              inputMode="decimal"
              required
            />
            <Button type="submit" disabled={busy}>
              Update goal
            </Button>
          </form>
        ))}
      {!!w.goalChanges?.length && (
        <details>
          <summary>Previous goal changes</summary>
          {w.goalChanges
            .slice()
            .reverse()
            .map((c, i) => (
              <p key={i}>
                {c.at.slice(0, 10)} · {c.before.name}:{" "}
                <Amount value={c.before.target} hidden={hidden} /> →{" "}
                {c.after.name}:{" "}
                <Amount value={c.after.target} hidden={hidden} />
              </p>
            ))}
        </details>
      )}
      <h3>Months checked for goal estimates</h3>
      <p>
        Found something missing? Mark that month to look at again. The money you
        marked stays as it is, and CashNarra waits until you check the month
        before using it in the estimate.
      </p>
      {w.goals.map((g) => (
        <section key={g.id}>
          <h4>{g.name}</h4>
          <details>
            <summary>How we worked this out</summary>
            <p>
              Only months you have checked can support an estimate. A month you
              have not checked stays unknown, even if some amounts are recorded.
            </p>
            {Array.from({ length: 3 }, (_, i) => {
              const current = new Date(today + "T12:00:00Z");
              const month = new Date(
                Date.UTC(
                  current.getUTCFullYear(),
                  current.getUTCMonth() - i - 1,
                  1,
                ),
              )
                .toISOString()
                .slice(0, 7);
              return (
                <p key={month}>
                  {month} ·{" "}
                  <Amount
                    hidden={hidden}
                    value={sum(
                      g.allocations
                        .filter((a) => a.date.startsWith(month))
                        .map((a) => a.amount),
                    )}
                  />{" "}
                  marked ·{" "}
                  {g.reviewedMonths.includes(month)
                    ? "Checked"
                    : "Needs checking"}
                </p>
              );
            })}
          </details>
          {g.reviewedMonths.length === 0 && <p>No months checked yet.</p>}
          {g.reviewedMonths
            .slice()
            .sort()
            .map((month) => (
              <p key={month}>
                {month}{" "}
                <Button
                  disabled={busy}
                  onClick={() =>
                    void save("goal_unreview", { goalId: g.id, month })
                  }
                >
                  Check {month} again
                </Button>
              </p>
            ))}
        </section>
      ))}
      <h3>Your check-ins</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          void save("preferences", {
            showRhythm: f.get("showRhythm") === "on",
            reminder: f.get("reminder") === "on",
          });
        }}
      >
        <label>
          <input
            name="showRhythm"
            type="checkbox"
            defaultChecked={w.preferences?.showRhythm !== false}
          />
          Show my recording rhythm
        </label>
        <label>
          <input
            name="reminder"
            type="checkbox"
            defaultChecked={w.preferences?.reminder ?? false}
          />
          Show a gentle reminder when I open Today and have not checked in
        </label>
        <p>
          This reminder appears inside CashNarra only. No notifications or
          emails.
        </p>
        <Button type="submit" disabled={busy}>
          Save check-in preferences
        </Button>
      </form>
      <details>
        <summary>Check-in history</summary>
        {(w.checkinHistory ?? w.checkins)
          .slice()
          .reverse()
          .map((c, i) => (
            <p key={i}>
              {c.date} ·{" "}
              {c.kind === "review"
                ? "Checked records"
                : c.kind === "rest"
                  ? "Rest / closed"
                  : "No money activity"}{" "}
              · recorded {c.at.slice(0, 10)}
            </p>
          ))}
      </details>
    </div>
  );
}
