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
import { labels } from "@/domain/ledger";
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
}: {
  record: EventInput;
  hidden?: boolean;
  onClick: () => void;
  account?: string;
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
        <Icon size={19} />
      </span>
      <span className={s.rowText}>
        <strong>{record.description}</strong>
        <small>
          {labels[record.kind]}
          {account ? " · " + account : ""}
        </small>
      </span>
      <span className={s.rowRight}>
        <Amount
          value={outgoing ? "-" + record.amount : record.amount}
          hidden={hidden}
        />
        <small>{record.date}</small>
      </span>
    </button>
  );
}
