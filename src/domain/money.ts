import Decimal from "decimal.js";
Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_UP });
export const D = (value: string) => new Decimal(value);
export function money(value: unknown, positive = false): string {
  if (
    typeof value !== "string" ||
    !/^-?(0|[1-9]\d{0,17})(\.\d{1,2})?$/.test(value)
  )
    throw new Error("Enter an exact amount with at most two decimal places.");
  const d = D(value);
  if (positive && !d.gt(0))
    throw new Error("Amount must be greater than zero.");
  return d.toFixed(2);
}
/** Accept a pasted GHS amount, then return the canonical exact-decimal string. */
export function parseEntryAmount(value: string): string {
  const compact = value.trim().replace(/\s+/g, "");
  const withoutCurrency = compact.replace(/^(?:GH₵|GHS|₵)/i, "");
  if (!/^-?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,2})?$/.test(withoutCurrency))
    throw new Error("Enter an exact amount with at most two decimal places.");
  return money(withoutCurrency.replace(/,/g, ""));
}
export const sum = (values: string[]) =>
  values.reduce((a, b) => a.plus(b), D("0")).toFixed(2);
export function formatMoney(value: string | null) {
  if (value === null) return "Unknown";
  const d = D(value);
  const [whole, fraction] = d.abs().toFixed(2).split(".");
  return `${d.isNegative() ? "−" : ""}GH₵${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${fraction}`;
}
