"use client";
import { useEffect, useRef, useId, type ReactNode } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  UserRound,
  X,
} from "lucide-react";
import { formatMoney } from "@/domain/money";
import { kindLabel } from "@/domain/ledger";
import { readingDate } from "@/domain/periods";
import type { EventInput } from "@/domain/types";
import s from "./app.module.css";
export function Button({
  children,
  onClick,
  primary = false,
  quiet = false,
  disabled = false,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  primary?: boolean;
  /** A text-only secondary action beside a primary one. */
  quiet?: boolean;
  disabled?: boolean;
  type?: "submit" | "button";
}) {
  return (
    <button
      type={type}
      className={`${s.button} ${primary ? s.primary : ""} ${quiet ? s.quiet : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
export function Amount({
  value,
  hidden = false,
  large = false,
  onInspect,
}: {
  value: string | null;
  hidden?: boolean;
  large?: boolean;
  onInspect?: () => void;
}) {
  if (onInspect)
    return (
      <button
        type="button"
        className={s.amountLink}
        onClick={onInspect}
        title="Open included records, period and calculation"
        aria-label={hidden ? "Open evidence for hidden amount" : undefined}
      >
        <Amount value={value} hidden={hidden} large={large} />
      </button>
    );
  return (
    <span className={`${s.amount} ${large ? s.large : ""}`}>
      {hidden
        ? "••••"
        : (() => {
            try {
              return formatMoney(value);
            } catch {
              return "Needs review";
            }
          })()}
    </span>
  );
}
export function Dialog({
  title,
  children,
  onClose,
  wide = false,
  actions,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
  actions?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    titleId = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const dialog = ref.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className={`${s.dialog} ${wide ? s.dialogWide : ""}`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab" || !ref.current) return;
        const items = [
          ...ref.current.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])",
          ),
        ].filter((el) => {
          if (el.tabIndex < 0 || el.closest("[hidden], [aria-hidden='true']"))
            return false;
          return true;
        });
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (
          event.shiftKey &&
          (active === first || !ref.current.contains(active))
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (active === last || !ref.current.contains(active))
        ) {
          event.preventDefault();
          first.focus();
        }
      }}
    >
      <div className={s.sectionHead}>
        <h2 id={titleId}>{title}</h2>
        <button
          className={s.iconButton}
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <div className={s.dialogBody}>{children}</div>
      <div className={s.dialogExit}>
        {actions}
        <Button onClick={onClose}>Close</Button>
      </div>
    </dialog>
  );
}
function rowDate(iso: string) {
  try {
    return readingDate(iso);
  } catch {
    return iso;
  }
}
export function RecordRow({
  record,
  hidden = false,
  onClick,
  account,
  pendingAmount,
  workspaceType = "Business",
  onChange,
  showDate = true,
}: {
  record: EventInput;
  hidden?: boolean;
  onClick: () => void;
  account?: string;
  pendingAmount?: string;
  workspaceType?: "Personal" | "Business";
  onChange?: () => void;
  /** Off inside a list that is already grouped by day. */
  showDate?: boolean;
}) {
  const outgoing = [
      "expense",
      "stock",
      "asset",
      "owner_out",
      "interest",
      "payable_payment",
      "loan_principal",
    ].includes(record.kind),
    credit = [
      "credit_sale",
      "credit_purchase",
      "credit_expense",
      "opening_payable",
      "opening_receivable",
    ].includes(record.kind);
  const Icon =
    record.kind === "transfer"
      ? ArrowLeftRight
      : credit
        ? UserRound
        : outgoing
          ? ArrowUpRight
          : ArrowDownLeft;
  const row = (
    <button className={s.row} onClick={onClick}>
      <span className={`${s.recordIcon} ${outgoing ? s.out : ""}`}>
        <Icon size={19} aria-hidden />
      </span>
      <span className={s.rowText}>
        <strong>
          {record.kind === "receivable_payment" && record.party
            ? `Payment from ${record.party}`
            : record.kind === "payable_payment" && record.party
              ? `Payment to ${record.party}`
              : record.description}
        </strong>
        <small>
          {kindLabel(record.kind, workspaceType)}
          {record.kind === "credit_sale" ? " · No cash received" : ""}
          {account ? " · " + account : ""}
        </small>
      </span>
      <span className={s.rowRight}>
        {record.amount || pendingAmount ? (
          <Amount
            value={
              (outgoing ? "-" : "") + (record.amount || pendingAmount || "")
            }
            hidden={hidden}
          />
        ) : (
          <small>Confirm above</small>
        )}
        {!record.amount && pendingAmount ? (
          <small>To confirm</small>
        ) : showDate ? (
          <small>{rowDate(record.date)}</small>
        ) : null}
      </span>
    </button>
  );
  if (!onChange) return row;
  return (
    <div className={s.rowWithAction}>
      {row}
      <button type="button" className={s.quietAction} onClick={onChange}>
        Change
      </button>
    </div>
  );
}
