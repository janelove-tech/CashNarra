# Phase 09 — External launch gates

Status: EXTERNAL. This is not autonomous coding.

Phase 08 stays parked. Its automated checks passed and its verdict remains `NOT V1 COMPLETE`. Return to `harness/build/08-release-verification.md` for the unfinished evidence. Phase 09 does not need that evidence in order to list decisions. It does not become resolved because Phase 08 is unfinished, and finishing Phase 09 would not make the Phase 08 verdict complete.

There is no Phase 10.

Do not mark a gate resolved from repository inspection. Do not purchase, enable, or deploy production services without explicit user approval. This file is not a legal opinion.

## Parked until a later Phase 08 return

| Item | Label | What is still required |
|---|---|---|
| Clean `npm ci` | PASS | Completed in the 2026-10-16 Codex return; see `../context/08-local-release-evidence.md` |
| Representative voice quality | EXTERNAL | Consented Ghana-relevant clips and an opted-in provider. Typed narration stays the fallback. Voice must not post automatically |
| Live narration evaluation | EXTERNAL | User approved US$5 total for narration/voice evaluation. API key absent; no spend. Recordings to follow. Production enablement is not approved |
| Screen reader | NOT RUN | A person using assistive technology on the critical flows |
| Text contrast | PASS | Automated measured text contrast passed across 28 scans. No WCAG certification |
| Non-text/manual contrast | NOT RUN | Outside the measured text-contrast scope |
| Separate 200% zoom pass | PASS | Two Edge journeys, verified actual zoom metrics, light/dark screenshots reviewed; see Phase 08 local evidence |

## Decision register

Every row is unresolved.

| Gate | Needs Phase 08 first? | Repository fact | Still requires the user |
|---|---|---|---|
| Production Supabase | No | Local API is `127.0.0.1:58321`. `.env.example` has empty public URL and anon key. No production project is configured | Project, region, key handling, and approval to create it |
| Production SMTP / email | No | `.env.example` names Resend-compatible SMTP placeholders. Doctor does not send mail | Provider account, from-address, and a real delivery test |
| Commercial hosting | No | `docs/LAUNCH-READINESS.md` says not to assume a Vercel Hobby plan allows commercial use. No deployment is authorised | Plan, eligibility, and an explicit deploy request |
| Backup and recovery objective | No | Local drafts and exports exist. Backup deletion policy is not defined | Retention period, who restores, and when backups are deleted |
| Provider agreements and retention | No | AI uses `store:false` when called. That is not a promise of zero retention. Voice and AI are disabled in `.env.example` | Contracts for Supabase, OpenAI, email, and hosting |
| Ghana data protection and DPC process | No | The launch note says to get qualified local advice before collecting real customer information | Controller, lawful basis, notices, and registration decision |
| BoG / PFTSP applicability | No | CashNarra records money. It does not move money. The product is not a payment service in this repository | Qualified decision on whether any rule still applies |
| GRA software and record rules | No | Narration retention is separate from posted records. No tax-filing feature exists | Whether software approval or Ghana-held retention applies |
| NITA applicability | No | Source research left this unresolved. The repository does not decide it | Qualified reading of which duties apply |
| Trademark and identity | No | The development build uses the Narra name. Clearance is not recorded | Name clearance before a public launch |
| Real-customer launch approval | Yes, for the quality evidence | Automated tests are not launch approval. Voice quality and screen-reader evidence are still parked | Explicit permission to collect real customer information |

## Agent rule

Document status. Do not invent approvals. A code-complete verdict would not close this phase, and the current verdict is not code-complete.
