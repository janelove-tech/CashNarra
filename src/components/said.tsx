"use client";
import type { ReactNode } from "react";
import s from "./app.module.css";

/**
 * The person's own words. An apricot surface with the speech mark from the
 * logo symbol; never a chat bubble, never a reply. The block itself is a
 * blockquote so assistive technology hears it as quoted words.
 */
export function Said({
  children,
  meta,
  hidden = false,
}: {
  children: ReactNode;
  meta?: ReactNode;
  hidden?: boolean;
}) {
  return (
    <>
      <blockquote className={s.said}>
        {hidden ? "Your words are hidden while amounts are hidden." : children}
      </blockquote>
      {meta ? <p className={s.saidMeta}>{meta}</p> : null}
    </>
  );
}
