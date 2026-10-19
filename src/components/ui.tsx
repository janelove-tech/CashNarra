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
import type { EventInput } from "@/domain/types";
import s from "./app.module.css";
export function Button({
  children,
  onClick,
  primary = false,
  disabled = false,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  primary?: boolean;
  disabled?: boolean;
  type?: "submit" | "button";
}) {
  return (
    <button
      type={type}
      className={`${s.button} ${primary ? s.primary : ""}`}
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
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
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
      className={s.dialog}
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
      {children}
    </dialog>
  );
}
export function RecordRow({
  record,
  hidden = false,
  onClick,
  account,
  pendingAmount,
  workspaceType = "Business",
}: {
  record: EventInput;
  hidden?: boolean;
  onClick: () => void;
  account?: string;
  pendingAmount?: string;
  workspaceType?: "Personal" | "Business";
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
  return (
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
        <small>{record.amount ? record.date : pendingAmount ? "To confirm" : record.date}</small>
      </span>
    </button>
  );
}
