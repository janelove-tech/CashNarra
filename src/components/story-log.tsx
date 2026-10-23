"use client";
import type { ReactNode } from "react";
import type { RecordEvent, Workspace } from "@/domain/types";
import { report } from "@/domain/ledger";
import { readingDate } from "@/domain/periods";
import { Amount } from "./ui";
import { Said } from "./said";
import s from "./app.module.css";

const BY_HAND = "Manually reviewed record";

/**
 * The story log: the person's days, newest first. Each day shows the words
 * they gave and the records those words produced, so provenance is the
 * default view rather than a detail dialog.
 */
export default function StoryLog({
  workspace: w,
  records,
  today,
  hidden,
  rows,
  days = 7,
  onSeeAll,
}: {
  workspace: Workspace;
  records: RecordEvent[];
  today: string;
  hidden: boolean;
  rows: (records: RecordEvent[], showDate: boolean) => ReactNode;
  days?: number;
  onSeeAll: () => void;
}) {
  const byDay = new Map<string, RecordEvent[]>();
  for (const record of records) {
    (byDay.get(record.date) ?? byDay.set(record.date, []).get(record.date))!.push(
      record,
    );
  }
  const dates = [...byDay.keys()].sort((a, b) => b.localeCompare(a));
  const shown = dates.slice(0, days);
  if (!dates.length) return null;
  return (
    <section className={s.log} aria-label="Your story log">
      {shown.map((day) => {
        const dayRecords = byDay.get(day)!;
        const summary = report(w, day, day);
        const groups: { sourceId: string; records: RecordEvent[] }[] = [];
        for (const record of dayRecords) {
          const last = groups[groups.length - 1];
          if (last && last.sourceId === record.sourceId) last.records.push(record);
          else groups.push({ sourceId: record.sourceId, records: [record] });
        }
        return (
          <div key={day}>
            <div className={s.dayHead}>
              <h2>{day === today ? `Today · ${readingDate(day)}` : readingDate(day)}</h2>
              <span>
                In <Amount value={summary.received} hidden={hidden} /> · out{" "}
                <Amount value={summary.paid} hidden={hidden} />
              </span>
            </div>
            {groups.map((group, index) => {
              const source = w.sources.find((item) => item.id === group.sourceId);
              return (
                <div className={s.storyBlock} key={group.sourceId + index}>
                  {source?.text && source.text !== BY_HAND ? (
                    <Said hidden={hidden} meta="You said">
                      {source.text}
                    </Said>
                  ) : source?.text === BY_HAND ? (
                    <p className={s.byHand}>Added by hand</p>
                  ) : (
                    <p className={s.byHand}>
                      Original words removed according to your privacy setting
                    </p>
                  )}
                  {rows(group.records, false)}
                </div>
              );
            })}
          </div>
        );
      })}
      {dates.length > shown.length && (
        <div className={s.actions}>
          <button type="button" className={s.sectionLink} onClick={onSeeAll}>
            See every record →
          </button>
        </div>
      )}
    </section>
  );
}
