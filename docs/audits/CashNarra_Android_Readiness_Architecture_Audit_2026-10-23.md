# CashNarra — Android Readiness & Architecture Decision Audit

Audit date: 23 October 2026  
Repository: `janelove-tech/CashNarra`  
Checkout: `C:\Users\Jane\Desktop\Learning 2026\Codex\CashNarra`  
Mode: read-only. No product code, dependency, schema, environment, or branch change was made. The only file added is this report.

## 1. Executive verdict

**Keep the Next.js application. Finish the phone-quality PWA that is already in progress. Package that same site for Google Play later with a Trusted Web Activity, after a production HTTPS origin and the store gates below are actually met.**

**Fallback, only after a named Android capability fails on a real phone:** a second, Expo-based Android client that calls the existing Next.js route handlers and reuses `src/domain`. Leave the web app and the marketing site on Next.js. Do not replace them with React Native Web.

**Do not rebuild CashNarra in React Native now.** A store listing does not require a new UI toolkit. The financial engine, session model, and Story Log already live in this repository. React Native would rebuild the interface and the session model while the ledger still has to stay on the server.

Capacitor is not the fallback. This application is a server-rendered Next.js app with cookie sessions and route handlers. Capacitor packages a built web folder, or a WebView pointed at a URL. The first does not fit this server. The second is a less capable Trusted Web Activity.

| Route | Verdict |
| --- | --- |
| A. Next.js PWA, improved | **CONDITIONAL GO** — finish the unfinished phone pass |
| B. That PWA inside a Trusted Web Activity | **NOT YET** — right packaging method, blocked on a live origin, device proof, and Play policy |
| C. Capacitor around the current app | **NO-GO** |
| D. Next.js web plus an Expo Android client | **NO-GO now.** Conditional later, and only for a measured native gap |
| E. One Expo Router app for web and Android | **NO-GO** |

Play publication is not implied by this recommendation. Nothing in this audit was submitted to Google, and nothing here is approval.

## 2. Evidence and audit limitations

### Inspected

- Every local and remote branch tip, their merge-bases, and the commits that exist on one tip and not another. No checkout, pull, merge, reset, or stash.
- `package.json`, `package-lock.json`, `next.config.ts`, and the absence of an Android, Capacitor, or Expo project.
- App Router pages, route handlers, `src/server`, `src/domain`, `src/lib`, the service worker, the manifest, and the offline page.
- Supabase migrations that define `commit_workspace`, row-level security, and function grants, read as source. The database was not contacted.
- `docs/ux/MOBILE_APP_DECISIONS_2026-10-21.md`, `harness/CURRENT.md`, the 21 October phone-app build-log entry, and `docs/LAUNCH-READINESS.md`.
- The 512-pixel app icon, viewed. Its maskable safe zone was not measured in pixels.
- Official Google Play and Chrome documents fetched on 23 October 2026. Citations are in section 7.

### Not run in this audit

- `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`, and `npm run build`. The working tree is dirty, the phone pass is unfinished, and a dev server may be using `.next`. Those commands can write caches into that tree.
- No physical Android device, no installed PWA, no Trusted Web Activity, no Lighthouse run, and no bundle-size measurement. No score is invented.
- No microphone, transcription, story-reading, checkout, or production call.
- No Supabase project, migration, or production data.

Historical results from `harness/build-log.md` (21 October 2026) are labelled as that entry’s results. They are not re-labelled as results of this audit.

### Could not be verified

- Real-device keyboard, TalkBack, microphone permission, call interruption, lock-screen interruption, download/share, and field speed.
- Whether Chrome on a current Android phone will offer installation for this origin. There is no production origin.
- Maskable-icon safe-zone compliance as a measured circle.
- Which Financial-features checkbox Google will accept for this product. That is a Play Console decision, not a conclusion of this audit.
- Ghanaian data-protection, Bank of Ghana, or GRA obligations. Those are named in `docs/LAUNCH-READINESS.md` and are outside Play packaging.

## 3. Repository fingerprint

### Branches

There is one worktree and no stash and no tag. Four branch names resolve to three commits.

| Ref | Commit | Date | What it contains that the audit baseline does not |
| --- | --- | --- | --- |
| `redesign/words-to-records` (checked out) | `020a6aef6afd36f93b4741924f103041a611fe0f` | 2026-10-21 | Nothing. This is the commit under the working tree. |
| `work/cashnarra-v1` | same `020a6ae` | 2026-10-21 | Nothing. Same commit, second name. |
| `origin/work/cashnarra-v1` | `b8012f049c7d18fd2addec252ad50929763c5b72` | 2026-10-21 | Nothing ahead. It is missing `5b4f4a9` and `020a6ae`. |
| `main`, `origin/main` | `3b4d1f89fed8c079cc3571aeff6276bfe5f04d92` | 2026-10-16 | Nothing ahead. It is an ancestor. `main..HEAD` is 38 commits. `HEAD..main` is 0. |

`020a6ae` is “Keep the generated Next.js types pointer as next dev writes it”. `5b4f4a9` is “Finish the 21 October UI pass with the reader, voice and plan work”. Those two commits are local only.

`harness/CURRENT.md` still says the branch is `work/cashnarra-v1`. Both local names point at the same commit, so that sentence is not a second product. The exact next action in that file is the unfinished phone-app pass on this working tree.

Remote `main` is the 16 October development publish. It already has `src/app/manifest.ts` and `public/sw.js`. It does not have the later ledger, billing-refusal, voice, export, or Story Log work. Packaging from GitHub `main` would ship an older product.

No branch, and no commit found by a history search for Android, Capacitor, Expo, React Native, Bubblewrap, or a Trusted Web Activity project, adds a native app. `package.json` on `main` and on `HEAD` both describe the Next.js app. The difference in the architecture paths from `main` to `HEAD` is about 4,300 insertions in domain, server, billing refusal, transcription, and exports. It is not a framework change.

### Working tree, which is the real baseline

The phone-app work is **uncommitted**. It is not on `020a6ae` and therefore not on any branch. Files read for this audit include the dirty copies of:

- `src/app/manifest.ts`, `src/app/layout.tsx`, `public/sw.js`, `src/app/offline/page.tsx`
- `src/components/cashnarra.tsx`, `src/components/app.module.css`, `src/components/voice-capture.tsx`
- `tests/e2e/phone-app.spec.ts`, `tests/public-cache.test.ts`

Another agent may still be editing those files. This report describes them as read on 23 October 2026.

### Versions locked in `package-lock.json`

| Piece | Version |
| --- | --- |
| Package manager | npm (`package-lock.json`; no pnpm or Yarn lockfile) |
| Node engine | `>=24 <25` |
| Next.js | 16.4.0 |
| React / React DOM | 19.3.0 |
| TypeScript | 5.9.3 |
| Zod | 4.6.7 |
| decimal.js | 10.6.0 |
| `@supabase/supabase-js` | 2.117.3 |
| `@supabase/ssr` | 0.8.0 |

There is no React Native, Expo, Capacitor, Bubblewrap, or Android Gradle project in the tree.

### Tests that exist

- Unit: Vitest, `npm test`. The phone-app build-log entry says 34 files and 208 tests passed on 21 October after `tests/public-cache.test.ts` was extended. **Not re-run here.**
- Browser: Playwright on Edge, `npm run test:e2e`. The same entry says a run excluding auth and recovery had 45 passed and 8 failed. **Not re-run here.**
- `tests/e2e/phone-app.spec.ts` has three tests. The build log marks that file **NOT RUN**.
- Database and Supabase scripts exist. They were not run. They can write to a database.

### Product stage

`harness/CURRENT.md` says Phase 08 is incomplete and Phase 09 is external. Checkout is disabled (`src/app/api/billing/checkout/route.ts` returns 403). `VOICE_QUALITY_APPROVED` is required for hosted voice and is not to be set. The Story Log is the authorised interface (`docs/ux/REDESIGN_STRATEGY_2026-10-21.md` and `.cursor/rules/product-ui-ux.mdc`).

## 4. Existing architecture map

CashNarra is one Next.js App Router application. The signed-in product is a single client component. Authority for money sits in route handlers and Postgres.

```
Browser (Story Log UI)
  src/components/cashnarra.tsx          client, about 3,895 lines
  src/components/app.module.css         CSS modules, about 1,696 lines
  src/lib/drafts.ts                     IndexedDB drafts, per owner and workspace
  src/components/voice-capture.tsx      MediaRecorder, audio/webm;codecs=opus
        |
        | cookie session, same-origin fetch
        v
Next.js route handlers
  POST /api/understand                  AI proposal, or the local mock
  POST /api/transcribe                  audio, only when voiceAvailable()
  POST /api/workspaces                  create, batch, corrections, goals, deletion request
  GET  /api/workspaces                  load, or look up a save receipt
  POST /api/billing/checkout            always 403
        |
        v
src/server/auth.ts                      Supabase cookie session, or local cn-demo cookie
src/server/store.ts                     commit() / commitMove()
src/domain/*                            exact decimals, posting, validation, plans
        |
        v
Postgres commit_workspace()             security definer, auth.uid(), numeric(20,2)
  RLS select policies on workspaces, receipts, journal lines
```

`src/` is 82 TypeScript, TSX, and CSS files, about 573 KB. Eighteen files are marked `"use client"`. There is no `middleware.ts`. `next.config.ts` does not set `output: "export"`. It sends `Cache-Control: private, no-store` on `/api/*`, `X-Frame-Options: DENY` on pages, and `Referrer-Policy`.

### What is platform-independent

These modules are TypeScript plus `decimal.js` and Zod. They do not touch the DOM:

- `src/domain/money.ts` — exact two-decimal strings, not binary floats.
- `src/domain/ledger.ts` — `posting`, `applyBatch`, `validateWorkspace`, `report`.
- `src/domain/types.ts` — `eventSchema`.
- `src/domain/dates.ts`, `periods.ts`, `goals.ts`, `planning.ts`, `move.ts`, `profit-loss.ts`, `story-calculation.ts`, `customer-plans.ts`.

`posting()` is also called from the server extractor (`src/server/ai.ts`) so a proposal is checked before the person sees it. The database function checks the saved state again. The client must not become a second writer.

### What is server-only

- `src/server/auth.ts` uses `cookies()` from `next/headers`.
- `src/server/store.ts` calls `commit_workspace` and `move_workspace_record` with the user-scoped Supabase client.
- `src/server/ai.ts` and `src/server/transcription.ts` hold provider calls. Keys are process environment, not browser bundles.
- `src/server/voice-access.ts` — hosted Groq stays off unless local-testing conditions match. Quality approval alone does not send audio.
- `src/app/api/billing/checkout/route.ts` and `webhook/route.ts` refuse.

`supabase/migrations/202610160009_credit_expense.sql` is the posting gate that matters. `commit_workspace` requires `auth.uid()`, currency `GHS`, a matching payload hash, the expected version, immutable financial history, and correction history. Grants are to `authenticated` only. A mobile client that wrote rows itself would skip this.

### What is web-specific

- `src/components/cashnarra.tsx` and the other client components: CSS modules, `window.history`, `popstate`, `BroadcastChannel`, `document`, clipboard, `beforeinstallprompt`.
- `src/lib/drafts.ts`: IndexedDB database `cashnarra-drafts-v1`, key `[ownerId, workspaceId]`, revision check.
- `src/components/voice-capture.tsx`: `getUserMedia`, `MediaRecorder`, only `audio/webm;codecs=opus`. `src/server/recording.ts` rejects anything that is not that WebM/Opus shape.
- `src/lib/exports.ts` and `src/lib/activity-pdf.ts`: browser `Blob` download and jsPDF. The PDF is the designed two-page report.
- `public/sw.js` and `src/app/manifest.ts`.
- Landing and pricing pages: client components in the App Router, with Next fonts and metadata.

### Authentication

`context()` in `src/server/auth.ts` reads the `cn-demo` cookie only when `DEMO_ENABLED` is not `"false"` and `VERCEL` is unset. Otherwise it uses `@supabase/ssr` `createServerClient` and `auth.getUser()`. `sameOrigin()` requires an `Origin` header and, when `SITE_URL` is set, that exact origin. Browser `fetch` to the same site sends that header. A future native client using a raw bearer token would need an equivalent check designed on purpose. It should not be bolted on by disabling `sameOrigin`.

Sign-out (`cashnarra.tsx`, logout dialog) calls `supabase().auth.signOut()`, then `POST /api/logout`, then `clearDrafts()`, then tells other tabs through `BroadcastChannel("cashnarra-session")`. If sign-out fails, drafts stay. That is the right order.

### Where “Saved” comes from

`POST /api/workspaces` looks up an existing receipt for the same request key before applying a stale body. `commit()` hashes the payload. The SQL function returns the old receipt when the hash matches, and rejects the key when the hash differs. The screen shows a saved receipt only after that response (`showReceipt` in `cashnarra.tsx`). A transcript and a review are not receipts.

## 5. Android readiness assessment

These states are different, and only the first two are true of this checkout.

| State | Result |
| --- | --- |
| Manifest present | Yes, in the working tree: `src/app/manifest.ts` |
| Service worker present | Yes, `public/sw.js`, registered from `cashnarra.tsx` |
| PWA installable on a production origin | **NOT VERIFIED.** No production HTTPS origin was opened. |
| PWA installed on a phone | **NOT RUN** |
| PWA usable after installation | **NOT VERIFIED** |
| Safe when the network drops | Partial. See offline below. |
| Appropriate to wrap for Play today | **No** |

### Manifest

Working-tree `src/app/manifest.ts`:

- `id` `/app`, `name` and `short_name` CashNarra, `start_url` `/app`, `scope` `/`
- `display` `standalone`, with `display_override` of standalone, minimal-ui, browser
- `background_color` `#F7F7FA`, `theme_color` `#5B49C7`
- 192 and 512 icons, each also listed with `purpose: "maskable"` using the same PNG
- Shortcuts: `/app?compose=1` and `/app?view=records`
- `categories` includes `finance`. That is a manifest hint, not a regulatory classification.

`layout.tsx` sets `viewportFit: "cover"` and `interactiveWidget: "resizes-content"`.

The 512 icon is a full-bleed violet rounded square with the white speech mark inset. Reusing it as maskable is plausible. The centre 80% safe zone was **not measured**. Finding P2-06.

`X-Frame-Options: DENY` does not block a Trusted Web Activity. A TWA is a top-level Custom Tab, not a framed page. It would block someone else embedding CashNarra, which is what the header is for.

### Service worker and offline

`public/sw.js` cache `cashnarra-public-v3`:

- Install caches brand files and `/offline` only.
- Navigations go to the network. On failure, the cached offline document is returned.
- `/api/*`, other origins, and brand URLs with a query string are not intercepted.
- A private or `no-store` response is not written into the cache.
- The worker does not call `skipWaiting` itself. The app posts `SKIP_WAITING` from the update notice, which stays disabled while busy, while a receipt is pending, or while recording.

`tests/public-cache.test.ts` encodes that contract in a Node `vm`. This audit did not execute it. The 21 October build log says the extended test was inside the 208 passing unit tests.

The offline page (`src/app/offline/page.tsx`) says a connection is required to read a story, transcribe, or save, and that words kept with Draft backup remain on the device. It also says nothing was saved or lost by going offline. That matches the architecture: IndexedDB drafts are not ledger rows.

Two gaps follow from the same worker:

1. The offline document imports `app.module.css`. Those CSS files are not in the cache. The 21 October build log already saw the offline page render without its stylesheet. This audit did not repeat that browser check. The cause is still in the code. Finding P2-01.
2. A cold start with no network cannot load `cashnarra.tsx`, so the person cannot open the draft that IndexedDB still holds. The offline copy tells them to reconnect and open records again. That is honest. It is not an offline product.

Draft backup is off by default (`src/app/privacy/page.tsx`). The privacy page also says the browser can delete stored drafts, so they are not a backup. Shared-device mode clears them (`clearDrafts` in the shared-device dialog). Keys include the owner id, so another account’s `draftStorage` get uses a different key. The previous person’s draft bytes remain on the device until sign-out, shared-device clear, or browser eviction. Sign-out clears them only after sign-out succeeds.

There is no sync of locally created ledger lines. Do not add one.

### Navigation and the phone shell

On a phone, `cashnarra.tsx` puts Home, Records, Tell, Stories, and Plan in a bottom bar. Tell only focuses the story box. Views are `/app?view=records` and the other view names. Dialogs push history entries. Back during recording restores the entry and asks before leaving. This is the behaviour a Trusted Web Activity’s back gesture would walk, because the TWA uses the browser history.

The 21 October emulated notes (headless Edge, not a phone) reported some of this working, and reported four browser-suite failures still open:

- Next dev-tools badge over the Home item.
- A dark-mode animation wait in the contrast spec.
- Voice dialog close path versus `recording.spec`.
- `navigate()` keeps a receipt when the receipt’s page is the page being opened again (`cashnarra.tsx` around the `setReceipt` line that clears only when `current.page !== id`).

`tests/e2e/phone-app.spec.ts` was not run. Real-device checks APP-01 through APP-24 that need a phone are **NOT RUN**.

### Voice

Code can record in a browser that supports `audio/webm;codecs=opus`, stop at the customer limit (60 seconds, or 120 only in a narrowly detected local Plus test), stop at 8 MB, and stop with an explicit message on `visibilitychange`, `pagehide`, or microphone-track end. A partial clip is kept for the person to accept or discard. The server parser refuses other container shapes.

Production availability is a different fact. `voiceAvailable()` is false unless voice is enabled and either quality is approved or the request is the local-testing combination. Groq also requires that local combination and a key. `HOSTED_FUNCTION_BODY_BYTES` is 4.5 MB while the recorder allows 8 MB, and the code comment says hosted voice must not send the larger cap. `VOICE_QUALITY_APPROVED` must stay false.

**Real-device voice verification is BLOCKED.** Do not turn the feature on to test a TWA.

Chrome on Android can record Opus in WebM. A Trusted Web Activity uses that Chrome. An Android System WebView often cannot, which is one reason Capacitor is a poor fit for this recorder.

### Session, exports, notifications

Session cookies belong to the browser profile. In a TWA they are Chrome’s cookies for that origin, shared with ordinary Chrome tabs. Signing out in one signs out the other. That is acceptable if the product copy says so. It is a poor fit for “the Play app has its own login” unless that sharing is explained.

Exports download a file in the browser. Android Chrome’s download and share sheet was **NOT RUN** on a device.

No `Notification` or push registration exists under `src/`. Notifications are not a current product requirement. Adding them is not a reason to change frameworks.

### Install

The account menu offers “Add to your home screen” only after `beforeinstallprompt`, and hides that offer when `display-mode: standalone` matches. The `appinstalled` event only clears the prompt. The UI does not claim the icon was added. That matches the product rule.

## 6. Five-option architecture comparison

Labels mean:

- **Preserved** — today’s code keeps doing the job.
- **Adapt** — a small, local change.
- **New** — a new implementation.
- **Blocked** — a hard mismatch with this repository or with current Play rules.
- **Unverified** — not exercised on a device or against a live origin.

| Criterion | A. Next.js PWA | B. PWA + TWA | C. Capacitor | D. Next web + Expo | E. Universal Expo |
| --- | --- | --- | --- | --- | --- |
| Preserves working code | Preserved | Preserved | Blocked for the server | UI is New | UI and web hosting are New |
| Initial effort | The open phone pass | Packaging after A | A server/client split in disguise | A second product UI | A replacement of the web UI |
| Long-term maintenance | One UI, one host | One UI, plus a thin Android wrapper | WebView plus plugins plus the server | Two UIs, one API | One UI toolkit fighting the current CSS |
| Android UX | The current Story Log, if the phone pass finishes | Same as Chrome | WebView, usually behind Chrome | Native navigation, after a rewrite | Same rewrite, also on the web |
| Small-phone performance | Unverified on device. UI is one large client component | Same | Same WebView cost, plus a second engine to patch | Unverified. New UI could be smaller. Not evidenced | Unverified |
| Low bandwidth | App must download from the network on a cold start | Same | Same if it loads the site | Could cache a binary. Not built | Could cache a binary. Not built |
| Offline | Drafts only, after the app has loaded | Same | Same, unless a new local engine is written | Would still be drafts only | Would still be drafts only |
| Voice | Chrome MediaRecorder. Production path off | Same, in Chrome | WebView Opus support is a known weak spot | New recorder. Server still accepts only WebM/Opus | Same new recorder |
| Notifications | Not built. Web push could be added later | Play-delegated notifications possible later | Plugin possible later | Expo notifications possible later | Possible later |
| Device integration | Browser permissions | Browser permissions. The APK cannot read cookies | Plugins, after the app is rebuilt to call them | Native APIs | Native APIs on mobile, browser APIs on web |
| Security | Cookie session, RLS, server posting | Same, with Chrome’s cookie jar | Separate WebView jar. Easy to get wrong | New token storage. Must not weaken `sameOrigin` | New session design on every platform |
| Current auth | Preserved | Preserved | Not preserved | New | New |
| Financial-correctness risk | Low if the server stays the writer | Low, same | Rises if a local bundle starts posting | High if posting is copied. Low if it calls `/api/workspaces` | High if posting is copied |
| Code sharing | Already one app | Already one app | Low, until a static client exists | Domain and HTTP contract only | Theoretical. CSS modules do not move | 
| Play publication | Not a store app | The supported way to ship a PWA | A remote WebView is the pattern Play treats as a website in a box | Ordinary native app, after the UI exists | Ordinary native app, after the rewrite |
| Updates | Deploy the site | Site deploy updates the UI. The wrapper changes rarely | Store review for native-shell changes. Remote URL still depends on the site | Store review for UI changes | Store review, plus a web deploy of a different host |
| Subscriptions | Web checkout, currently refused | Consumption-only, or Play Billing added later | Same billing problem, harder | Play Billing fits a native app, and is a new payment system | Same |
| Hosting cost | Current web host | Same | Same, plus Android release time | Same host, plus Expo build cost if EAS is used | New web deployment on top |
| Tooling cost | None new | Android SDK / Bubblewrap locally. No paid build service required | Android SDK plus Capacitor | EAS is optional and paid at higher tiers. Local builds exist | Highest |
| Later iOS | The same website. A store app would be a second decision | Android only | A second WebView shell | The usual reason to pick Expo, still a second UI | One more rewrite bet |
| Vendor dependence | Next, Supabase, the web host | Plus Chrome on the device, and Play signing | Plus Capacitor and the WebView | Plus Expo and the React Native release train | Highest |
| Rollback | Revert the phone-pass files | Unpublish the listing. The site remains | Harder once the client is split | Keep the website. Drop the store app | Poor. The website would already have been replaced |

### Option A — existing Next.js PWA

This is the product that is already being fitted to phones: bottom bar, history in the address, safe areas, a worker that refuses to cache financial responses, and an install offer that does not claim success. The gap is finish and proof, not a missing framework.

The app still needs the network to boot. For a record-keeping product whose save path is the server, that is the safe offline story. Making the shell available offline is a later, careful cache of public assets only. It is not a reason to change toolkits.

### Option B — Trusted Web Activity

Chrome’s model matches this app: the page is the app, Digital Asset Links prove the developer owns the origin, and cookies, IndexedDB, and the microphone permission stay inside Chrome. The wrapper does not get to read them. That is a security property, not a limitation, for financial pages.

Official requirements used here:

- HTTPS origin, manifest, and the Add-to-Home-Screen bar Chrome documents for a TWA. [Chrome TWA overview](https://developer.chrome.com/docs/android/trusted-web-activity), checked 23 October 2026, audience Android developers.
- `/.well-known/assetlinks.json` with the package name and the SHA-256 of the key Play actually signs with, plus the statement inside the app. [Integration guide](https://developer.chrome.com/docs/android/trusted-web-activity/integration-guide), checked 23 October 2026.
- Bubblewrap is the Node tool Chrome documents for generating that project. It is a packaging tool. It is not a new application framework.

There is no production domain in this repository, so asset links cannot be completed. A TWA aimed at `localhost` is a developer experiment, not a Play artifact.

The site and the store app update differently. Shipping a bad web deploy ships it to every installed TWA immediately. That is acceptable only with the same care already required for the website.

### Option C — Capacitor

Capacitor’s project copies a built web directory into the native app, or points a WebView at a server URL during development. This Next app’s signed-in UI is `cashnarra.tsx` calling route handlers that call `cookies()`. There is no static export. Server Components are few; the blocker is the route handlers, the cookie session, and the live workspace load, not a handful of server components.

A remote-URL WebView would show the site and still fail the reasons to prefer a TWA: separate cookie jar, weaker media capture, a second engine to keep patched, and a store policy that expects a TWA when the content is a website. Plugins for files or the microphone would require the page to call Capacitor, which the current pages do not.

Capacitor becomes relevant only if a future static client already exists. Building that client in order to use Capacitor is the expensive part, and it still leaves the UI in a WebView.

### Option D — Next.js plus Expo

The reusable part is real, and it is not “because both use React”:

- Share `src/domain` and the Zod schemas.
- Keep `POST /api/workspaces`, `commit_workspace`, and the provider routes as the only writers.
- Rebuild every screen that uses CSS modules, `window`, IndexedDB, or MediaRecorder.
- Replace cookie auth with a native session that the server can verify. Do not put the service role in the app. Do not disable `sameOrigin` without a replacement.

`cashnarra.tsx` is about 3,895 lines and `app.module.css` about 1,696. That is the Story Log. It does not compile to React Native. A second client also means two places to get a review row, a cedi amount, and a back gesture right.

This option is the right fallback on the day a real phone shows a gap Chrome cannot close: for example a Play Billing flow that must live in the APK, or a recording failure that survives the visibility handling already written. It is not the right next month of work.

iOS later is cheaper from Expo than from a TWA, and still costs a full iOS quality pass. The website already covers iPhone Safari without a store app. That is the proportionate iOS path until an iOS store decision exists.

### Option E — universal Expo Router

React Native Web does not run CSS modules, Next metadata, or this App Router. The public landing is part of how CashNarra is found. Moving it into a client-only universal app would trade a working marketing page and a working financial UI for a single-toolkit theory. Expo’s own web target is a real target. It is not a mechanical port of this repository. No file in this checkout is an Expo route.

The long-term foundation that keeps a later native app cheap is already the one to protect: domain functions, Zod contracts, and server-owned posting. A universal UI is not that foundation.

## 7. Google Play readiness

Policy notes below are readings of Google’s pages on 23 October 2026. They are not legal advice, not a Play review outcome, and not a Ghanaian regulatory opinion. Where the right checkbox is ambiguous, it is marked unresolved.

### Account and target API

| Topic | Reading | Source | Authority | Audience | Qualification |
| --- | --- | --- | --- | --- | --- |
| Developer registration fee | One-off USD $25, then a personal or organisation account | [General conditions of access for Google Play in the EEA](https://support.google.com/googleplay/android-developer/answer/14659200?hl=en) | Google Play Console Help | The page is the EEA access article. The fee is stated in “Getting Started” as the signup step | Confirm the amount in the account-creation flow before paying. This audit did not open a Ghana-specific fee page |
| Who must be an organisation | Apps providing financial products and services, “including but not limited to” banking, loans, trading, funds, and crypto wallets and exchanges | [Play Console Requirements](https://support.google.com/googleplay/android-developer/answer/10788890?hl=en) | Google | Play developers | Bookkeeping is not in the “including but not limited to” examples. The phrase is open. Confirm before choosing Personal. An organisation account needs a D-U-N-S number |
| New app target API | Since 31 August 2026, new apps and updates must target Android 16, API 36. An extension to 1 November 2026 can be requested | [Target API level requirements](https://support.google.com/googleplay/android-developer/answer/11926878) and [Android developers target SDK](https://developer.android.com/google/play/requirements/target-sdk) | Google Play, Android | Play apps on phones | A TWA wrapper must set this. CashNarra has no wrapper yet, so this is a packaging prerequisite, not a current defect |

### Financial features declaration

Every Play app completes the declaration, including apps that offer none of the listed features. The listed features are banking and loans, payments and transfers, purchase agreements, trading and funds, and support services (credit monitoring, financial advice, insurance, other). Personal or business record-keeping is not one of the named rows. “My app doesn’t provide any financial features” is a real option.

[Provide information for the Financial features declaration](https://support.google.com/googleplay/android-developer/answer/13849271?hl=en), Google Play Console Help, checked 23 October 2026, audience Play developers.

The Financial Services policy defines financial products more broadly, as products “related to the management or investment of money and cryptocurrencies, including personalized advice.” [Financial Services](https://support.google.com/googleplay/android-developer/answer/9876821), same date.

CashNarra’s own privacy page says it does not hold funds, connect bank feeds, make payments, offer credit, recommend investments, or file taxes. That product boundary must stay true in the store listing. It does not, by itself, answer which declaration box to tick. **Unresolved: ask Play Console, or a person who will sign the declaration, whether record-keeping with no movement of money is “no financial features” or “Other”.** Do not describe the app as a bank, wallet, lender, or payment service in order to be safe. That would misstate the product and can pull in loan and payments rules that do not fit.

Ghanaian questions in `docs/LAUNCH-READINESS.md` (Data Protection Commission, Bank of Ghana scope, GRA retention) are separate. An Android package does not answer them.

### Payments and Plus

Play’s payments policy requires Play Billing for in-app purchases of digital features, and it names “financial management software” as an example of a cloud service covered by that rule, unless an exception applies. [Payments](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en), checked 23 October 2026.

The same policy family’s explanatory page says a consumption-only app is allowed: the person can sign in and use something they paid for elsewhere, and the app must not sell that product inside the app. [Understanding Google Play’s payments policy](https://support.google.com/googleplay/android-developer/answer/10281818?hl=en), checked 23 October 2026.

Ghana is not in the published alternative-billing or billing-choice country lists. [Alternative billing systems](https://support.google.com/googleplay/answer/11174377?hl=en) and [billing choice programme](https://support.google.com/googleplay/android-developer/answer/17161464?hl=en-GB), checked 23 October 2026. Ghanaian buyers are documented as able to pay for Play digital content with American Express, Mastercard, or Visa. [Accepted payment methods, Ghana](https://support.google.com/googleplay/answer/2651410?co=GENIE.CountryCode%3DGH&hl=en), checked 23 October 2026. A community thread is not a Google ruling and is not used here.

Practical reading for CashNarra, while checkout returns 403 and Plus is a low monthly price:

- Shipping a Play app that links to or embeds a web checkout for Plus, aimed at people in Ghana, is the path most likely to conflict with the payments policy.
- A consumption-only Play app, with purchase left on the website and no in-app purchase path, matches the published exception and matches the fact that payments are not enabled.
- Adding Play Billing is a new payment system, a new entitlement link to `src/domain/customer-plans.ts`, and a service fee. The current fee table was **not** re-read in this audit. Read it before anyone prices Plus inside Play. At about one dollar a month, a store fee is a large share of the price.

**Unresolved:** whether a Ghana-registered merchant can complete Play Billing setup, and the exact service-fee row that would apply. Do not integrate billing to “be ready”.

### Data safety, privacy, deletion, review access

Account creation inside the app requires an in-app way to request account deletion and a web link where the person can request it without reinstalling. [Account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111), checked 23 October 2026.

What the product does today:

- The in-app dialog “Request account-data deletion” says the request does not delete records now, and `simple("request", { kind: "deletion" })` stores a pending workspace request (`src/app/api/workspaces/route.ts`, action `request`).
- `src/app/privacy/page.tsx` explains that requests need review, that there is no support team yet, and that there is no promised response date. It does not itself submit the request.

That is a truthful development behaviour. It is not yet a Play-ready account-deletion path: it is workspace data, not the auth account, and the public page does not accept the request. Finding P1-03.

Before a listing, Play also expects a privacy-policy URL, a Data safety form (account data, financial records, audio if voice ships, device storage for drafts), and a reviewer login. [Play Console Requirements](https://support.google.com/googleplay/android-developer/answer/10788890?hl=en), section 3. A fictional demo account is the right reviewer access. Do not give reviewers a real customer’s books.

The closed-testing numbers for a new personal account (how many testers, for how many days) were **not** re-read on a current page in this audit. Treat them as **NOT VERIFIED** and read them in Play Console before scheduling a launch. Do not copy an old “12 testers for 14 days” figure into a plan without that check.

### TWA acceptance

Chrome documents the TWA as the way to open a PWA full screen from an Android app, with Digital Asset Links and the same installability bar as Add to Home Screen. Play can still reject a listing for quality, data-safety, payments, or broken functionality. A correct wrapper is not approval.

## 8. Financial-integrity and security assessment

### Controls that a mobile architecture must keep

| Control | Where it is | Mobile rule |
| --- | --- | --- |
| Exact money | `money()` in `src/domain/money.ts`, `numeric(20,2)` in SQL | Pass decimal strings. Do not reimplement with binary floats |
| Balanced, typed postings | `posting()` and `applyBatch()` | May be imported for display. The server and SQL remain the gate |
| Atomic save and idempotent retry | `commit_workspace` hash and version | One request key per attempt. Same key and same body returns the old receipt. A changed body must fail |
| Tenant isolation | `auth.uid()` inside the function, RLS for reads | The client never sends a service-role key. A native token is still just `authenticated` |
| History | SQL rejects rewritten records, missing correction reasons, and dropped history | A sync engine that merges two offline copies would fight this. Do not build one |
| AI boundary | `/api/understand` proposes. `/api/workspaces` saves | The model does not write the ledger on any client |
| Entitlements | `reserve_ai_call`, plan catalogue, checkout 403 | The store client does not decide that Plus was paid |
| Secrets | Provider keys only in server env | A shipped APK or JS bundle must not contain them |

`src/domain` can be shared with a future client because it is pure. Sharing it is not permission for that client to commit. The commit path stays `POST /api/workspaces`.

### Threats that matter on a phone

| Threat | What exists | Proportionate mitigation |
| --- | --- | --- |
| Stolen or shared phone | Cookie session in the browser profile. Drafts in IndexedDB until sign-out | Keep the sign-out clear. Keep shared-device mode. Say, if a TWA ships, that it shares Chrome’s login |
| Session expired mid-save | 401 copy says the draft stays and the person should sign in again | Preserve that copy in any client |
| Cached books | Worker ignores `/api/*` and `no-store` | Keep that test. Do not cache HTML of `/app` |
| Draft left for the next person | Cleared on successful sign-out. Not cleared if the browser is simply closed | The privacy page already says drafts are not a backup and the browser may evict them. No extra store is needed |
| Microphone clip | Held in memory as a Blob until the person uses or discards it. Server rejects unexpected WebM | Do not persist clips in IndexedDB. Production voice stays off |
| Story text sent to a provider | Only through `/api/understand` when AI is enabled and the server allows it | The demo and the default path use `mockExtract`. Do not move the provider call into the app |
| Deep link or shortcut | Manifest shortcuts only open `/app?compose=1` and `/app?view=records` | Keep shortcuts on those URLs. A signed-out person must see sign-in, which the app shell already does when `context()` fails |
| Website and app login mismatch | Not applicable until a second client exists | If Expo is ever added, do not invent a second user table |

No new security platform is required for the recommended path. The TWA host is designed not to see page data. That is the property to keep.

## 9. Code-reusability inventory

“Native compatibility” means a React Native or Expo screen, not a browser inside a TWA. A TWA reuses the web code as it stands.

No reuse percentage is stated. A line count of `src/domain` against `src/components` would mix comments, types, and UI and would pretend to be a measurement. The domain layer is the part that can move as TypeScript. The screen layer cannot.

| Module | Responsibility | Path | Web-specific | Server-specific | Native compatibility | Adaptation | Risk | Action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Money | Exact decimals and display strings | `src/domain/money.ts` | No | No | High | None for logic | Low | **KEEP** |
| Ledger | Posting, batch, balances, report | `src/domain/ledger.ts` | No | Called again on the server | High as a library | Import for preview only | High if a client posts alone | **KEEP + HARDEN** (never a second writer) |
| Event schema | Zod event shape | `src/domain/types.ts` | No | Validated again in SQL | High | Share the schema package only when a second client exists | Medium | **KEEP** now. **EXTRACT** only with option D |
| Dates and periods | Calendar dates, export windows | `src/domain/dates.ts`, `periods.ts` | One `window` name is a variable, not the DOM | No | High | None | Low | **KEEP** |
| Goals, planning, profit | Forecasts and plan edits | `src/domain/goals.ts`, `planning.ts`, `profit-loss.ts` | No | Profit route is server | High | None | Medium. Forecasts must stay non-authoritative | **KEEP** |
| Plans and usage | Free and Plus catalogue, checkout refusal | `src/domain/customer-plans.ts` | No | Checkout route | High | Do not let a store client set its own entitlement | High | **KEEP + HARDEN** |
| Narration proposal | Schema and mock/real extract | `src/server/ai.ts` | No | Provider key | Server only | None | High | **KEEP** |
| Review UI | Questions, rows, save | `src/components/batch-review.tsx` | CSS, DOM | No | Poor | Rebuild screens if Expo | Medium | **KEEP** for web. **REPLACE** only inside option D |
| Story Log shell | Composer, nav, receipt | `src/components/cashnarra.tsx` | History, SW, CSS | Fetches APIs | Poor | Do not split casually | Medium | **KEEP + HARDEN** the open phone bugs |
| UI primitives | Buttons, dialogs, amounts | `src/components/ui.tsx` | DOM focus | No | Poor | Rebuild if Expo | Low | **KEEP** |
| Routing | App Router plus query views | `src/app/**`, history in `cashnarra.tsx` | Next and History API | Some pages | Poor | Expo Router would be new | Medium | **KEEP** |
| Supabase browser | Cookie client | `src/lib/supabase.ts` | Browser cookies | Pair is `src/server/auth.ts` | Poor | Native needs a different session adapter | High | **KEEP** for web. **ADAPT** only with option D |
| API | Workspace, understand, transcribe | `src/app/api/**` | `sameOrigin` | Yes | Clients can call it | Auth header design | High | **KEEP + HARDEN** |
| Drafts | Optional device draft | `src/lib/drafts.ts` | IndexedDB | No | Poor | Expo would use another store, still not a ledger | Medium | **KEEP** |
| Voice | Record and upload | `src/components/voice-capture.tsx`, `src/server/recording.ts` | MediaRecorder, WebM | Parser | Poor | A native recorder must still emit the accepted WebM or the parser must be deliberately extended | High | **KEEP**. Production use **DEFER** |
| Exports | CSV, Excel, designed PDF | `src/lib/exports.ts`, `activity-pdf.ts` | Blob download, jsPDF, DOM | Figures come from the ledger | PDF drawing is JS and might run. Download is web | Share sheet on Android was not tested | Medium | **KEEP**. Device download **DEFER** until a phone check |
| Worker and manifest | Install and offline page | `public/sw.js`, `src/app/manifest.ts` | Browser | No | Not used by Expo | Inline offline CSS | Medium | **KEEP + HARDEN** |
| Billing routes | Refuse checkout and webhooks | `src/app/api/billing/**` | No | Yes | Keep refused | Play Billing would be new | High | **DEFER** |

## 10. Performance and real-device test findings

### Evidence actually in hand

- Source shape: one client shell of about 154 KB (`cashnarra.tsx`) plus about 31 KB of CSS module source. That is source size, not the downloaded JavaScript. **No production bundle figure was measured.**
- Viewport intent: 320, 360, and 390 pixels are already in the product rules and in Playwright specs. This audit did not re-run them.
- The 21 October emulated note says that at 360×380 the primary story action sat above the bottom bar. That is one data point from headless Edge, recorded in the build log, not repeated here.
- The same note says the full browser suite, excluding auth and recovery, failed 8 tests. Causes are listed in section 5.
- Reduced motion, 200% zoom, and contrast have existing specs. Their latest full-suite result included failures. **Not re-run.**
- No low-memory, low-bandwidth, battery, or hydration timing figure exists in this audit. Finding 24 in the handoff (large workspace timing) remains **NOT RUN**.

### Minimum before a Play release

Do these on a physical Android phone, on a normal mobile connection, with the fictional demo or a synthetic account. Mark each E (emulator or desktop browser) or R (real device). An E result does not prove the microphone, TalkBack, or field speed.

| Check | What to do | Done when |
| --- | --- | --- |
| R-01 Install | Chrome install prompt, then the installed icon | Home opens signed-in, or sign-in, and the UI does not claim install before it happened |
| R-02 Cold open | Force-stop, open again | Session returns or sign-in is clear. No other person’s records |
| R-03 Airplane mode after load | Load Home, enable airplane mode, type with Draft backup on, reload | Offline page is readable, including its CSS. Draft is still there after the network returns. Nothing says Saved |
| R-04 Cold airplane mode | Force-stop, airplane mode, open | Offline page, not a blank screen and not a cached ledger |
| R-05 Keyboard | 360-wide phone, story field, review, a dialog | Primary action stays reachable. 320-wide still usable |
| R-06 Back | Records, a dialog, recording | Back matches the product rules. Recording asks first |
| R-07 Save | One synthetic batch, then airplane mode, then the same retry | One receipt. A second send with the same key does not duplicate. A changed body is rejected |
| R-08 Sign-out | Shared device | Drafts gone. Next sign-in does not show the previous workspace |
| R-09 Export | PDF and CSV | File opens or shares. Figures match the on-screen report |
| R-10 Voice | Only with the existing local gates, or not at all | If still disabled, record BLOCKED. Do not flip production voice |
| R-11 TalkBack | Home, one dialog, save | Names are spoken. This is a person using the reader, not an automated scan |
| R-12 Update | Ship a worker change | “A newer version is ready” does not reload during recording or an unconfirmed save |

Play-specific additions after a TWA exists: asset-link verification hides the URL bar, the back gesture leaves the app only from Home, and a reviewer account can reach every screen without a real payment.

## 11. Cost and engineering-effort analysis

Figures below are engineering judgement for one experienced developer who already knows this repository. Confidence is medium for the PWA and TWA ranges, and low for any native rewrite, because the Story Log is still moving. They are not quotes.

### One-time

| Work | A then B (recommended) | C Capacitor | D Expo client | E Universal Expo |
| --- | --- | --- | --- | --- |
| Finish the open phone pass, including the known suite failures and inline offline styles | About 1 to 2 weeks | Still required | Still required for the website | Thrown away if the web UI is replaced |
| Real-device matrix in section 10 | Several days of phone time, plus fixes | Same | Same, on the new UI | Same, on the new UI |
| Production origin, asset links, wrapper, internal track | About 2 to 4 days after the origin exists, plus owner time in Play Console | Android project plus a client/server split of multiple weeks | Not the wrapper | Not the wrapper |
| New UI | None | None if it is only a WebView, which is the case to avoid | On the order of a few months to reach Story Log parity | Longer, because the marketing site and web app move too |
| Auth | None | New if the WebView jar is separate | New session adapter | New |
| Play Console, privacy, deletion web form, reviewer login | Owner and product work, about a week, independent of toolkit | Same | Same, plus Billing if they sell in the app | Same |

### Recurring

| Cost | Now | Added by the recommendation |
| --- | --- | --- |
| Web host, Supabase, AI | Already the product’s costs. No new plan is required for this decision. Production deploy is not approved by this audit | Unchanged |
| Play developer account | Not opened as part of this audit | USD $25 once, when the owner chooses to register. Confirm the live fee |
| Bubblewrap / Android Studio | — | Local tools. No paid build farm |
| Expo EAS | — | Not used on the recommended path |
| Play service fee | — | Zero while the app is consumption-only and sells nothing inside Play |
| Chrome and Android updates | — | The TWA takes browser updates without a store release. The wrapper needs an update when the target API policy moves, which is a yearly Play habit |

### What not to buy

A paid native-build subscription, a second database, an offline sync product, or a new state library. None of them fixes the open phone-pass failures.

Plus at the current public price (the catalogue’s $0.99 offer, with checkout still refused) is a poor fit for a store fee until the fee table is read and the owner still wants in-app purchase. Consumption-only avoids that fee.

## 12. Ranked findings

### P0 — would break money or isolation if a mobile client were built wrong

#### P0-01 — A second client must not post the ledger

- Evidence: `commit_workspace` in `supabase/migrations/202610160009_credit_expense.sql` checks `auth.uid()`, version, payload hash, and immutable history. `POST` in `src/app/api/workspaces/route.ts` is the application gate. `posting()` in `src/domain/ledger.ts` is necessary and not sufficient.
- Impact: An Expo or Capacitor client that applied batches locally and uploaded rows would bypass idempotency and history.
- Severity: P0 if option D or E starts. Not a defect in the current web app.
- Action: Any future client sends the existing workspace operation and waits for the receipt.
- Done when: A repeated key returns one receipt, and a direct table write from the client is impossible under the anon key. Existing database tests cover the SQL side. They were not re-run here.

#### P0-02 — Provider keys and the service role stay on the server

- Evidence: `src/server/ai.ts`, `src/server/transcription.ts`, and `src/lib/supabase.ts` (anon key only).
- Impact: A shipped Android binary that contained a provider or service-role key would expose it.
- Severity: P0 as a release rule.
- Action: Keep calls on the route handlers.
- Done when: The Android project, when it exists, has no secret in source, and a built artifact scan shows none.

### P1 — blocks a responsible Play release

#### P1-01 — The phone pass is unfinished and uncommitted

- Evidence: `harness/CURRENT.md` exact next action. Build log “Phone-app pass, in progress”. `tests/e2e/phone-app.spec.ts` marked NOT RUN. Working tree dirty on top of `020a6ae`. Browser suite reported 8 failures.
- Impact: Packaging this tree would package known, uncommitted, partly failing phone behaviour.
- Action: Finish the four causes named in the build log, inline the offline styles, run the phone spec and the suite, then commit. That work is already specified. This audit does not start it.
- Done when: Those checks are recorded as run, with E or R, and the phone files are on a commit.

#### P1-02 — No production origin, so no Trusted Web Activity

- Evidence: No `assetlinks.json` in the tree. TWA verification needs a public HTTPS origin and the Play signing fingerprint. Chrome integration guide, section 7.
- Impact: A wrapper built now would be a local experiment.
- Action: Decide the production domain first. Generate asset links only after Play App Signing shows the certificate.
- Done when: `https://<domain>/.well-known/assetlinks.json` returns 200 and Chrome hides the TWA URL bar on a real phone.

#### P1-03 — Account deletion is a workspace request, and the public page cannot submit it

- Evidence: Deletion dialog in `cashnarra.tsx`. Action `request` in `src/app/api/workspaces/route.ts`. Privacy page states there is no support process yet.
- Impact: Play’s account-deletion rule expects an in-app request and a web request for the account, usable without reinstalling. Play Console Help, section 7.
- Action: Before any listing, add a real account-level request and a public web form, and an operator path. Do not pretend records were deleted. Legal retention stays a separate decision (`docs/LAUNCH-READINESS.md`).
- Done when: A signed-in person can submit the request in the app, and a person without the app can submit it on the site, and both land in a queue a human can see.

#### P1-04 — Plus inside a Play app has no chosen, policy-fitting payment path

- Evidence: Checkout and webhook return 403. Ghana is outside the published billing-choice countries. Payments policy covers financial-management software sold in the app. Consumption-only is an explicit exception.
- Impact: A “Choose Plus” button inside the Play package can be a policy problem even though the website button currently only opens a review.
- Action: For a first listing, remove or hide in-app purchase and external checkout. Leave purchase on the website only if the listing is consumption-only and Console accepts that. Revisit Play Billing only with the fee table in hand.
- Done when: The owner records the choice, and the build that is uploaded matches it.

#### P1-05 — Device proof and voice readiness are absent

- Evidence: Build log real-device column is NOT RUN. `voiceAvailable()` is false for hosted use. Recording parser allows only WebM/Opus. Quality approval is required to stay off.
- Impact: A store app whose main promise is voice would be shipping an unproven, gated feature.
- Action: Ship text as the reliable path. Keep voice behind the current gates. Run R-10 only inside those gates.
- Done when: The listing does not promise transcription the server will refuse, and a real phone has passed R-01 through R-09.

#### P1-06 — Play content forms are not started

- Evidence: No store listing in the repo. Declaration, Data safety, privacy URL, and reviewer access are Console work. Target API 36 applies to a new app submitted now.
- Impact: The wrapper can be technically fine and still be blocked.
- Action: Do this after P1-01 and P1-02, before production release. Use a demo account for review.
- Done when: Console shows the forms submitted and an internal testing track installs on a phone.

### P2 — important product gaps

#### P2-01 — Offline page and app shell

- Evidence: `public/sw.js` caches `/offline` and brand files. `src/app/offline/page.tsx` imports `app.module.css`. Build log saw an unstyled offline page. Cold navigation cannot load the client.
- Impact: The honest offline message is easy to miss, and a draft cannot be read until the network returns.
- Action: Inline the offline page’s critical styles, as the build log already asks. Keep API responses uncached. Optionally cache the public offline assets only.
- Done when: R-03 and R-04 show a readable offline page and no financial response from cache.

#### P2-02 — Same-page navigation keeps a saved receipt

- Evidence: `navigate()` in `cashnarra.tsx` clears the receipt only when `current.page !== id`. The build log’s trust-findings failure matches that.
- Impact: Home can still look “saved” when the person starts another story.
- Action: Clear the receipt when the person leaves the saved context, including tapping the current destination.
- Done when: The trust-findings case passes, and a new empty story does not show the previous receipt.

#### P2-03 — Voice dialog history versus the recording spec

- Evidence: Build log suspects the new history handling when the voice dialog closes. `recording.spec` failed in that run. This audit did not trace the failure in a browser.
- Impact: “Type your story instead” may drop the person away from the story box.
- Action: Fix while finishing P1-01, with the recording spec.
- Done when: That spec passes without weakening the “Back asks before leaving a recording” rule.

#### P2-04 — Dev overlay and contrast-spec waits

- Evidence: Build log: `nextjs-portal` over the Home item, and a dark-mode `getAnimations()` timeout.
- Impact: The overlay is development-only. The contrast timeout may be a test wait, or a real animation. Unknown until re-run.
- Action: Hide the dev indicator for phone tests, or move it. Re-measure the dark theme before changing motion.
- Done when: The 390-wide phone-bar click hits Home, and the contrast spec finishes.

#### P2-05 — Drafts can disappear, and the product already says so

- Evidence: Privacy page. IndexedDB is not durable storage.
- Impact: Someone who trusts the phone as their books will be wrong. The ledger is the server.
- Action: Keep the copy. Do not add a sync engine to “fix” eviction.
- Done when: R-03 still distinguishes a draft from a receipt.

#### P2-06 — Maskable icon safe zone is unmeasured

- Evidence: `manifest.ts` reuses `cashnarra-icon-512.png` for `purpose: "maskable"`. The image is a full-bleed violet squircle with an inset white mark. No pixel measurement of the 80% circle was done.
- Impact: Android launchers can clip the mark.
- Action: Measure the safe zone. If the mark is outside it, add a real maskable asset. Do not redraw the mark as squares.
- Done when: The mark sits inside the safe zone on a circular and a squircle mask, checked on a device.

#### P2-07 — Hosted upload limit is below the local recording cap

- Evidence: `HOSTED_FUNCTION_BODY_BYTES` is 4_500_000 in `src/lib/recording-limits.ts`. The recorder allows 8 MB.
- Impact: A future hosted voice launch can accept a clip the function will refuse.
- Action: Before any hosted voice, align the client cap with the host limit.
- Done when: The largest clip the recorder produces is under the deployed body limit. Not required while voice stays local-only.

### P3 — maintainability

#### P3-01 — The signed-in UI is one very large component

- Evidence: `cashnarra.tsx` at about 3,895 lines.
- Impact: Phone fixes are riskier than they need to be. It is still one product, which is the right shape.
- Action: Split only along seams that the phone pass is already touching (navigation, receipt, dialogs), when that pass is implemented. Do not introduce a new state framework.
- Done when: A navigation change does not require editing an unrelated save path. Behaviour tests stay green.

#### P3-02 — Two local branch names, and GitHub is behind

- Evidence: Section 3. `main` is 38 commits behind. `origin/work/cashnarra-v1` is 2 commits behind. The phone pass is on neither.
- Impact: A later packager can wrap the wrong tree.
- Action: After the phone pass is committed, publish the branch the owner already asked to publish. Do not package `main`.
- Done when: The commit that passed the phone checks is the commit a TWA is pointed at.

#### P3-03 — Domain extraction is premature

- Evidence: Only one UI imports `src/domain`.
- Impact: A package split now adds ceremony before a second runtime exists.
- Action: **KEEP** the folder. **EXTRACT** a package only when option D is actually approved.
- Done when: Not applicable until that approval.

## 13. Final architecture decision

**Primary:** Option A now, Option B when the gates in section 16 are true.

**Fallback:** Option D, triggered only by a failed real-device gate that Chrome cannot fix.

**Rejected:** Option C as a packaging shortcut. Option E as a foundation change. A React Native rebuild in the current phase.

### What would change the decision

| Observation | Change |
| --- | --- |
| R-01 through R-09 pass on a production origin, and Play Console accepts consumption-only | Proceed with a TWA on an internal track |
| Asset links cannot be made stable on the real host | Stop. Fix the host. Do not switch to a WebView to avoid asset links |
| Chrome on the target phones cannot record, and voice has become a promised, approved feature | Then consider option D for the recorder only after the server parser has an explicit, tested format |
| The owner requires Play Billing inside the app | A small native billing bridge may be added to the TWA (Chrome documents delegation). A full Expo client is still not required for that one bridge |
| Two years of web UI and a funded iOS app are both required | Re-open option D. Still keep Next for the marketing site and the API |
| `commit_workspace` is replaced or copied into a client | Stop. That is a different product and it fails P0-01 |

## 14. Proposed target architecture

No new service.

```
People
  Phone Chrome, installed PWA, or later a TWA
  Desktop browser
        |
        v
Next.js on the existing host
  Public pages: landing, pricing, privacy, offline
  Signed-in Story Log: the current client
  Route handlers: the only mutation API
        |
        v
Supabase Auth cookies + Postgres commit_workspace
IndexedDB: optional drafts, never journals
Service worker: public brand files and the offline page only
```

Later, and only after section 16:

```
Android app (Bubblewrap / android-browser-helper)
  targetSdk 36
  Digital Asset Links to the production origin
  No checkout UI
  No extra permissions beyond what the TWA launcher needs
  UI updates by deploying the website
```

The Story Log, tokens, logo, and activity PDF stay as they are. Android work does not reopen the redesign.

## 15. Phased execution roadmap

These phases are not started by this audit.

### Phase 0 — Freeze the baseline

- Objective: Make the audited phone work a commit that can be named.
- Scope: The unfinished phone pass already listed in `harness/CURRENT.md`. No Android project.
- Existing code: the dirty files in section 3.
- Changes: the four suite causes, inline offline CSS, workspace-create disclosure, then the phone spec.
- Dependencies: no concurrent editor while the suite runs.
- Risks: fixing history can break recording or drafts.
- Tests: `phone-app.spec.ts`, the suite except live Supabase if that stack is down, `npm test`, typecheck, lint. Say so if Supabase specs are skipped.
- Done when: results are written in the build log with PASS, FAIL, or NOT RUN, and the commit exists.
- Effort: about 1 to 2 weeks for one developer, including the fixes already identified.
- Rollback: the commit can be reverted. The site is unchanged until it is deployed.

### Phase 1 — Phone proof

- Objective: R-01 through R-09 on a real Android phone against a non-production host if needed, using the fictional workspace.
- Scope: No packaging, no voice enablement, no payments.
- Done when: each row is R or a written blocker. Emulator results stay labelled E.
- Effort: several days, plus whatever R-05 and R-07 find.
- Rollback: none. This phase does not change the ledger.

### Phase 2 — Public shell hardening

- Objective: Offline page readable with no network. Worker contract unchanged.
- Scope: inline styles on `src/app/offline/page.tsx`. Do not cache `/app` or `/api`.
- Tests: extend `tests/public-cache.test.ts` only if the worker behaviour changes. Re-check R-03 and R-04.
- Done when: the offline page is readable and the private-cache test still passes.
- Effort: a day or two.
- Rollback: revert the page.

### Phase 3 — Packaging experiment, not a release

- Objective: A debug TWA against a real HTTPS staging origin.
- Scope: Bubblewrap project outside the financial modules, or in a directory that does not alter `src/`. Asset links for the upload key. `targetSdk` 36.
- Dependencies: Phase 0 and a domain. Play App Signing fingerprint before the production statement.
- Risks: wrapping the wrong host. Caching secrets into the wrapper. None of the Next code should move.
- Done when: URL bar hides on one phone, sign-in works, one synthetic save returns one receipt, airplane mode shows the offline page.
- Effort: 2 to 4 days after the origin exists.
- Rollback: delete the wrapper. The website is unaffected.

### Phase 4 — Play compliance, still internal

- Objective: Console forms and an internal track.
- Scope: account type confirmation, financial-features declaration, Data safety, privacy URL, account-deletion web request, reviewer demo, consumption-only choice.
- Dependencies: P1-03 and P1-04 decided by the owner.
- Done when: internal testers install the bundle. No production country rollout.
- Effort: about a week of owner and product time, less engineering than Phase 0.
- Rollback: unpublish the track.

### Phase 5 — Release readiness

- Objective: The owner decides whether to leave internal testing.
- Scope: R-01 through R-12 on the production origin. Listing copy that matches “records money, does not move it”.
- Done when: section 16 is all GO or explicitly waived in writing.
- This audit does not schedule a public launch.

### Phase 6 — After release

- Watch crashes, sign-in failures, duplicate-save reports, and offline complaints.
- Update the wrapper when Play’s target API moves.
- Do not add push, billing, or a second UI because the listing exists.

### Phase 7 — Native-upgrade trigger

- Open option D only from the table in section 13.
- First code motion, if that day comes: extract `src/domain` without changing its functions, and add a token adapter beside `context()`. Do not rewrite `posting()`.

## 16. Go/no-go checklist

| Gate | Status on 23 October 2026 |
| --- | --- |
| Phone pass committed and the named suite failures closed | **NO-GO** |
| `phone-app.spec.ts` run | **NOT YET VERIFIED** |
| Real-device R-01 through R-09 | **NOT YET VERIFIED** |
| Offline page readable without its missing stylesheet | **NO-GO** |
| Production HTTPS origin | **NO-GO** |
| Digital Asset Links with the Play signing key | **NO-GO** |
| TWA URL bar hidden on a phone | **NOT YET VERIFIED** |
| Text path works. Voice not promised beyond `voiceAvailable()` | **CONDITIONAL GO** — code is gated. Device voice is BLOCKED |
| One synthetic save is idempotent through the existing API | **CONDITIONAL GO** — implemented. Not re-tested in this audit |
| No service-role or provider key in a client artifact | **GO** for the current web app. Re-check any future APK |
| Account-deletion web request exists | **NO-GO** |
| In-app purchase absent, or Play Billing explicitly chosen | **NO-GO** until the owner writes the choice. Code currently refuses checkout |
| Financial-features declaration confirmed | **NOT YET VERIFIED** |
| Personal versus organisation account confirmed | **NOT YET VERIFIED** |
| Target API 36 on the wrapper | **NOT YET VERIFIED** — no wrapper |
| Reviewer demo account | **NOT YET VERIFIED** |
| Ghana DPC / BoG / GRA questions | **NOT YET VERIFIED**, and outside this packaging decision |
| React Native rebuild | **NO-GO** |

## 17. Unresolved questions

These need a person, or a Play Console screen, or a phone. They do not need a new framework.

1. Will the owner register a Play developer account as a person or as an organisation, after reading the financial-products rule against this record-keeping product?
2. Which Financial-features declaration will they sign: none, or Other?
3. Is the first Play package consumption-only, with Plus purchased only on the website?
4. What is the production hostname that Digital Asset Links will use?
5. Who operates deletion requests, given the privacy page currently says there is no support team and no response date?
6. Which physical Android phone and network will run R-01 through R-12?
7. The closed-testing tester count and duration were not re-read. What does Play Console require for this account on the day of submission?
8. What is the current Play service-fee row if question 3 is ever answered “sell inside the app”?

## 18. Final recommendation

**CashNarra should be retained and, when the gates above are met, packaged with its existing Next.js architecture. It should not be rebuilt in React Native now, and it should not be partially rewritten into Capacitor or a universal Expo app in order to reach Google Play.**

The evidence is the repository itself. Every branch is this Next.js product. The local tips are the same commit, GitHub is behind that commit, and the phone work that actually matters is an uncommitted continuation of the Story Log, not a missing native client. Money is already protected by `commit_workspace`, cookie auth, and a service worker that refuses to cache it. Chrome’s Trusted Web Activity is the packaging method that keeps those controls in place. A second UI would spend months to reproduce them, and would still have to call the same server.
