import { calendarDate } from "./dates";

export type StoryPeriod = "day" | "week" | "month";

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function readingDate(iso: string) {
  if (!calendarDate(iso)) throw new Error("Choose a valid date.");
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${SHORT_MONTHS[month - 1]} ${year}`;
}

export function rangeLabel(from: string, to: string) {
  return from === to ? readingDate(from) : `${readingDate(from)} – ${readingDate(to)}`;
}

function shift(iso: string, days: number) {
  return new Date(new Date(iso + "T12:00:00Z").getTime() + days * 86400000)
    .toISOString()
    .slice(0, 10);
}

export function periodBounds(anchor: string, period: StoryPeriod) {
  if (!calendarDate(anchor)) throw new Error("Choose a valid date.");
  if (period === "day") return { from: anchor, to: anchor };
  if (period === "week") {
    const start = new Date(anchor + "T12:00:00Z");
    const from = shift(anchor, -((start.getUTCDay() + 6) % 7));
    return { from, to: shift(from, 6) };
  }
  const from = anchor.slice(0, 7) + "-01";
  const to = new Date(
    Date.UTC(Number(anchor.slice(0, 4)), Number(anchor.slice(5, 7)), 0),
  )
    .toISOString()
    .slice(0, 10);
  return { from, to };
}

export type StoryWindow = {
  nominalFrom: string;
  nominalTo: string;
  from: string | null;
  to: string | null;
  futureFrom: string | null;
  futureTo: string | null;
  status: "closed" | "so-far" | "ahead";
  heading: string;
  oweLabel: string | null;
  peopleOweLabel: string | null;
  balanceLabel: string | null;
};

export type ExportPreset = "today" | "week" | "month" | "year" | "specify";
export type ExportSpan = "day" | "range";

export type ExportWindow = {
  from: string | null;
  to: string | null;
  label: string;
};

function ready(from: string, to: string, label: string): ExportWindow {
  return { from, to, label };
}

function unavailable(label: string): ExportWindow {
  return { from: null, to: null, label };
}

/** The dates an export will use. Open periods run through today. */
export function exportWindow(
  preset: ExportPreset,
  span: ExportSpan,
  today: string,
  custom: { day: string; from: string; to: string },
): ExportWindow {
  if (!calendarDate(today)) throw new Error("Choose a valid date.");
  if (preset === "today")
    return ready(today, today, `Today · ${readingDate(today)}`);
  if (preset === "week" || preset === "month") {
    const view = storyWindow(today, preset, today);
    return { from: view.from, to: view.to, label: view.heading };
  }
  if (preset === "year") {
    const from = `${today.slice(0, 4)}-01-01`;
    return ready(
      from,
      today,
      today.endsWith("-12-31")
        ? rangeLabel(from, today)
        : `This year so far · through ${readingDate(today)}`,
    );
  }
  if (span === "day") {
    if (!calendarDate(custom.day)) return unavailable("Choose a date.");
    if (custom.day > today)
      return unavailable(
        `${readingDate(custom.day)} · this date has not arrived`,
      );
    return ready(
      custom.day,
      custom.day,
      custom.day === today ? `Today · ${readingDate(today)}` : readingDate(custom.day),
    );
  }
  if (!calendarDate(custom.from) || !calendarDate(custom.to))
    return unavailable("Choose a start and an end.");
  if (custom.from > custom.to)
    return unavailable("Choose an end date on or after the start.");
  if (custom.from > today)
    return unavailable(
      `${rangeLabel(custom.from, custom.to)} · these dates have not arrived`,
    );
  const to = custom.to > today ? today : custom.to;
  return ready(
    custom.from,
    to,
    custom.to > today
      ? `${rangeLabel(custom.from, to)} · through ${readingDate(today)}`
      : rangeLabel(custom.from, to),
  );
}

/** Opens the export on the dates already on screen. */
export function exportChoiceFor(
  range: { from: string; to: string } | null,
  today: string,
) {
  const day = range?.from === range?.to && range ? range.from : today;
  const from = range?.from ?? today;
  const to = range?.to ?? today;
  const blank = { preset: "today" as const, span: "day" as const, day, from, to };
  if (!range || !calendarDate(range.from) || !calendarDate(range.to)) return blank;
  const matches = (preset: ExportPreset) => {
    const window = exportWindow(preset, "day", today, { day, from, to });
    return window.from === range.from && window.to === range.to;
  };
  if (matches("today")) return { ...blank, preset: "today" as const };
  if (matches("week")) return { ...blank, preset: "week" as const };
  if (matches("month")) return { ...blank, preset: "month" as const };
  if (matches("year")) return { ...blank, preset: "year" as const };
  if (range.from === range.to)
    return {
      preset: "specify" as const,
      span: "day" as const,
      day: range.from,
      from: range.from,
      to: range.from,
    };
  return {
    preset: "specify" as const,
    span: "range" as const,
    day,
    from: range.from,
    to: range.to,
  };
}

export function storyWindow(
  anchor: string,
  period: StoryPeriod,
  today: string,
): StoryWindow {
  if (!calendarDate(today)) throw new Error("Choose a valid date.");
  const { from, to } = periodBounds(anchor, period);
  const month = MONTHS[Number(from.slice(5, 7)) - 1];
  if (from > today)
    return {
      nominalFrom: from,
      nominalTo: to,
      from: null,
      to: null,
      futureFrom: from,
      futureTo: to,
      status: "ahead",
      heading:
        from === to
          ? `${readingDate(from)} · this date has not arrived`
          : `${rangeLabel(from, to)} · these dates have not arrived`,
      oweLabel: null,
      peopleOweLabel: null,
      balanceLabel: null,
    };
  if (to > today) {
    const through = readingDate(today);
    return {
      nominalFrom: from,
      nominalTo: to,
      from,
      to: today,
      futureFrom: shift(today, 1),
      futureTo: to,
      status: "so-far",
      heading:
        period === "month"
          ? `${month} so far · through ${through}`
          : period === "week"
            ? `This week so far · through ${through}`
            : `Through ${through}`,
      oweLabel: `You owe · through ${through}`,
      peopleOweLabel: `People owe you · through ${through}`,
      balanceLabel: `Recorded balances · through ${through}`,
    };
  }
  const on = to === today ? "Today" : readingDate(to);
  return {
    nominalFrom: from,
    nominalTo: to,
    from,
    to,
    futureFrom: null,
    futureTo: null,
    status: "closed",
    heading: from === to ? on : rangeLabel(from, to),
    oweLabel: to === today ? "You owe · Today" : `You owe on ${readingDate(to)}`,
    peopleOweLabel:
      to === today
        ? "People owe you · Today"
        : `People owe you on ${readingDate(to)}`,
    balanceLabel:
      to === today
        ? "Recorded balances · Today"
        : `Recorded balances on ${readingDate(to)}`,
  };
}
