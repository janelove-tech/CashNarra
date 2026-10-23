# CashNarra: mobile app strategy, PWA, Google Play and Claude handoff

Research date: 21 October 2026. This document supplements the current complete UI/UX redesign brief. It applies to the entire public and signed-in experience. It does not authorise publishing an Android app, enabling payments, spending on providers, or changing the financial ledger.

## 1. The recommendation in ordinary English

**Plan for both an installable PWA and a Google Play app. Build and prove the PWA experience first, while designing the product for everyday phone use now.**

A person should be able to discover CashNarra on the website, understand why it helps, try it without installing anything, create an account and later put it on their home screen. When Google Play distribution is ready, another person should be able to install CashNarra there and reach the same account, workspaces, records and plan.

This is a recommendation for one product with more than one way in. It is not a recommendation to build two separate accounting systems.

For the initial Android packaging investigation, prefer a **Trusted Web Activity (TWA), using Bubblewrap or a suitable maintained tool**, if the actual PWA passes the required voice, authentication, export, navigation and reliability checks. A TWA presents owned web content through a supporting browser in an Android application. It does not turn the interface into native Android widgets or remove web-platform limitations. Google documents both this model and its domain-verification requirement. [Google TWA overview](https://developer.chrome.com/docs/android/trusted-web-activity), [TWA quick start](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start).

Keep **Capacitor** as the next candidate if tested requirements justify native plugins or more native integration. Its normal model packages built web assets and connects them to native features. It is not a reason to rewrite the ledger. A separate React Native, Flutter or native Android interface remains possible later, but a substantial interface rebuild is not justified by store distribution alone. [Capacitor installation requirements](https://capacitorjs.com/docs/getting-started).

The important design decision is immediate: **CashNarra must work like a thoughtfully designed phone app, including when no browser toolbar is present.** The packaging decision can follow evidence.

## 2. Three different questions that should not be mixed together

| Question | What it means for CashNarra |
| --- | --- |
| What experience are we designing? | A useful money-recording app: quick entry, understandable review, trustworthy records, clear understanding and goals. It must support touch, a keyboard, assistive technology and interruptions. |
| Where does someone get it? | The website, home-screen installation, and eventually Google Play. Distribution does not determine whether the product is well designed. |
| What technology delivers it? | The current Next.js/React product, potentially a TWA package, or a separately justified hybrid/native client. |

A PWA is already an application. Installation can give it a home-screen icon and a standalone window. On iPhone, Apple documents the Share → Add to Home Screen → Open as Web App route. The exact installation flow varies by browser and device. [PWA installation](https://web.dev/learn/pwa/installation), [Apple's current iPhone instructions](https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/ios).

If “Laravel build” means the Laravel framework: Laravel is a web application framework. It is not a separate installation format. A Laravel site could have a PWA frontend, but CashNarra does not need to move to Laravel to become installable. [Laravel documentation](https://laravel.com/docs/13.x). The inspected CashNarra project already uses Next.js, React and TypeScript.

**Responsive, installable, offline-capable and native are separate properties.** A page can fit a phone and still be hard to use. A PWA can be installable and still require the network for important tasks. A store package can still display a poor interface.

## 3. Comparing the routes

The effort assessments below are project judgments, not vendor price quotations.

| Route | Customer experience | Main advantages for CashNarra | Material limits and work | Recommendation |
| --- | --- | --- | --- | --- |
| PWA only | Open a link; optionally install from a supported browser. | Reuses the current app, supports sharing and discovery, avoids maintaining a second client initially. | Installation varies; browser capabilities differ; voice, auth, files and offline behaviour still require real-device testing. | Strong first delivery route. |
| Google Play through TWA | Install an Android app which opens the owned PWA without normal browser chrome when verification succeeds. | Retains the hosted Next.js architecture and much of the same interface. | Android packaging, signing, verified domain association, Play review/policies and browser-dependent behaviour remain. A wrapper does not fix UX. | First Android candidate, subject to capability tests. |
| Google Play through Capacitor | Install a native container with web UI and native integrations. | Can add plugins for specific device requirements; can share substantial web UI code. | Requires a suitable bundled frontend and a deliberate client/server boundary. Auth, origin checks, plugins and device lifecycle need work. | Use when a demonstrated need justifies it. |
| Separate native/cross-platform UI | A dedicated Android or cross-platform client using shared backend services. | Maximum freedom over native interaction and integrations. | More interface code, release work and parity testing for a small team. Business rules must not fork. | Revisit if evidence demands it. |
| PWA plus Google Play | Users choose their preferred access route. | Combines link-based discovery with Android store availability; preserves one customer relationship. | Both channels must be tested, supported and kept consistent; subscriptions need channel-aware handling. | Recommended destination, delivered in stages. |

Being in Google Play can make discovery and installation familiar for some people. It does not guarantee adoption, trust or better retention. Those outcomes need customer evidence.

## 4. What was actually checked in this project

The available repository copy and GitHub's `work/cashnarra-v1` branch both resolve to `b8012f049c7d18fd2addec252ad50929763c5b72`, dated 21 October 2026 at 10:12 UTC. GitHub branch search returned `main` and `work/cashnarra-v1`.

**The newer Claude/Cursor work described by the owner is ahead of that published baseline.** This research does not independently certify the latest local redesign, its screenshots or its tests. Claude must inspect the current local branch and preserve its work. An older checkout is not a reason to restore old screens or old voice settings.

Observed in the available source:

| File / area | What is present | What it does not prove |
| --- | --- | --- |
| `package.json` | Next.js 16, React 19, TypeScript, Supabase libraries and exact decimal support. | A packaged mobile client or a production launch. |
| `src/app/manifest.ts` | App name, standalone display, brand colours, 192/512 icons and `start_url: "/"`. | That installed launch reaches the correct place for a returning user, or every icon/install requirement is verified. |
| `public/sw.js` | A narrowly scoped service worker caching public brand assets. | A working offline app shell, offline ledger or offline transcription. |
| `src/lib/drafts.ts` | IndexedDB draft storage keyed by owner and workspace, with revision checks and error messages. | Guaranteed permanent storage, cross-device synchronisation or an offline financial save. |
| App stylesheet | A mobile bottom bar and some safe-area treatment. | Correct behaviour with a real keyboard, display cutout, gesture area or standalone launch. |
| `voice-capture.tsx` | Browser microphone/MediaRecorder capture, clip playback and a server transcription request in the older baseline. | The behaviour of the newer Groq path on a person's phone or representative accent quality. |
| Server/auth/API files | Cookie-based authentication, server endpoints and same-origin checks. | That copying the current server build into a native container would work unchanged. |
| Main component | Many screens selected with component state in the inspected baseline. | Correct browser/system Back history, deep links or route restoration. Those must be verified. |

The source findings explain why installation and app behaviour deserve their own acceptance criteria. They do not establish that every listed gap is still present in the newer local work.

## 5. Architecture choices that matter before Android packaging

### PWA: complete the foundation deliberately

Next.js officially supports PWA manifests and documents service-worker and installation work. Keeping Next.js is compatible with a PWA strategy. [Next.js PWA guide](https://nextjs.org/docs/app/guides/progressive-web-apps).

Claude should inspect app identity, manifest scope, launch routing, icons, HTTPS, standalone display, installation help and update behaviour. An authenticated installed launch should reach useful app content; an expired session should reach sign-in and then the intended destination. Public links should still serve a persuasive public website.

Offer installation after useful engagement, or through a discoverable optional action. Do not make installation a condition of trying the product. Use capability detection for an actual browser install prompt, and clear manual instructions where needed. Never display a button that pretends it installed the app. Already-installed contexts should not keep asking to install.

### TWA: the least disruptive Android candidate, with conditions

TWA uses the supporting browser to render the hosted web product. Digital Asset Links associate the website with the Android package and signing identity. Verification failure can expose browser chrome through a Custom Tab. This makes the production domain, signing certificate and redirects part of the release plan. [TWA quick start](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start).

A TWA does not package a Node server on the phone. Existing hosted APIs remain hosted. Test authenticated launch, expired sessions, confirmation/recovery links, external destinations, downloads and permissions in the actual package. Domain verification and final Android release assets are later release work; they must not be claimed from web screenshots.

### Capacitor: useful, but not a one-click conversion of this server app

Capacitor expects a directory of built web assets with an `index.html`. Its configuration explicitly describes `server.url` as intended for live reload rather than production. Next.js static export does not support request-dependent route handlers, cookies or Server Actions. [Capacitor setup](https://capacitorjs.com/docs/getting-started), [Capacitor configuration](https://capacitorjs.com/docs/config), [Next.js static export limitations](https://nextjs.org/docs/app/guides/static-exports).

**Project inference:** a production Capacitor version would need a suitable client bundle and secure access to hosted services. The current cookie/origin design needs review for that environment. Do not enable permissive origins, expose server secrets or delete SSR/API functionality merely to obtain an Android build. Keep exact financial posting and access checks on their trusted boundary.

### What “one product” must mean

- The same account identifies the customer across supported channels.
- Workspaces, saved records, commercial agreements and entitlements share authoritative services.
- Account allowances apply across channels; installing again does not create a fresh allowance.
- Local drafts and authentication state may differ between browser, installed PWA and native container. Do not promise automatic local-draft transfer.
- A later native client may share domain definitions, API contracts and backend rules. Do not promise every UI component will be portable unchanged.

## 6. Offline and interruption behaviour for a money app

Browser storage needs explicit management. IndexedDB suits structured local data; Cache Storage suits resource responses. Persistence can reduce automatic eviction when granted, but users can still clear storage. A local draft is therefore not a backup guarantee. [Offline data and persistence](https://web.dev/learn/pwa/offline-data).

Recommended first offline contract for CashNarra:

| Situation | What the app should do |
| --- | --- |
| A typed draft is kept locally | Say it is on this device only after the write succeeds. Keep the workspace and owner identity attached. |
| The network disappears | Keep editable words and show a useful next step. Do not replace missing live information with zero. |
| Transcription or AI reading needs the network | Explain the actual temporary problem at the affected action. Do not claim those cloud operations work offline. |
| A save has an uncertain outcome | Resolve through the existing receipt/idempotency mechanism where available. Do not resubmit blindly or announce success. |
| The app closes or is suspended | Restore only what is genuinely recoverable. Do not promise a recording survives if only its tab memory held it. |
| Storage fails | Keep visible words where possible and offer a practical copy/backup route. Do not claim local persistence succeeded. |
| A service-worker update is ready | Avoid forcing a reload during a recording, review or save. Let the user reach a safe point. |
| A different customer signs in on the device | Do not expose the previous customer's draft, audio or cached financial response. Handle sign-out cleanup according to the privacy design. |

The first implementation should preserve the existing restriction against broad caching of authenticated financial responses. A generic “cache every GET” PWA recipe is inappropriate here. Public app assets and private financial state need separate handling. Offline reading of selected private records, if wanted later, needs an explicit data/storage/security design; it is not implied by this redesign.

Do not build a new background posting queue just to make the app feel native. Reliable offline financial writes require a separate conflict, authorization, receipt and reconciliation design. The present UI can remain honest and useful while that work is deferred.

## 7. Voice needs phone-specific design and testing

Microphone access is permission-controlled and requires a secure context. Ask at the moment someone chooses to record, not during first launch. [getUserMedia requirements](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia).

Recording on a phone is affected by lifecycle changes. MDN documents Safari microphone pauses and Android screen-lock effects on MediaRecorder events; chunk intervals are not a reliable elapsed-time counter. [MediaRecorder interruption notes](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/dataavailable_event).

CashNarra's recording journey must make these stages distinguishable: ready, requesting permission, recording, stopped/playback, sending, transcription returned, editing words, story interpretation, proposed records, confirmation and saved result. A microphone icon should not also mean transcribe, understand and save.

Show a visible stop control and time limit during capture. Test supported audio formats across the actual target browsers; do not assume one WebM format works everywhere. Validate duration and file size consistently with the real hosted request limit. Do not rely only on a client timer or a user-supplied duration for quotas.

Test permission denial, unavailable microphone, incoming call/app switch, screen lock, orientation change, no sound, upload interruption and a clip rejected for size. A useful fallback is typed entry; a falsely successful recording is not acceptable.

Preserve the configured Groq Free-only policy, account-wide voice allowance, transcript reuse and safe handling of unresolved calls. Do not rotate keys, add paid fallback or re-transcribe a completed recording for design testing. The previously consented computer-spoken clip was already transcribed and deleted; do not recreate or resend it. It did not establish microphone capture or accent accuracy.

## 8. The phone app design rules Claude should apply now

These are CashNarra design requirements and hypotheses. They are not a claim that one placement is universally best.

Android recommends familiar navigation patterns: three to five peer destinations in compact navigation, with adaptation for larger windows. [Android layout/navigation guidance](https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns). Use this as a starting point, then choose based on CashNarra tasks.

An initial candidate is four labelled destinations such as **Home, Records, Insights and Plan**, with a distinct **Record** action. The actual wording is open to evaluation; it must distinguish adding a money story from reading Money Stories. Put accounts and people where they are easy to find within the chosen structure. Keep profile, support, settings and plan management discoverable. Do not squeeze every existing page into the bottom bar.

| Area | What Claude must reconsider | What a good result demonstrates |
| --- | --- | --- |
| Public website | Value proposition, proof, page story, examples and entry choices. | A visitor understands what CashNarra does and can try or start without installing first. |
| Installed launch | App entry and useful return destination. | A returning customer reaches their money tasks instead of repeatedly seeing a sales pitch. |
| Navigation | Frequent tasks, secondary destinations and focused flows. | Stable labelled destinations, clear selection, and an obvious way back. |
| Top bar | Workspace identity, title, context and occasional actions. | It fits a short phone screen without becoming a row of mysterious symbols. |
| Capture action | Reachability and relationship between typed and spoken entry. | One obvious route to record, without competing FAB/composer/header actions. |
| Home | First-use, returning-use and pending work. | The next useful action is apparent; saved information is truthful and easy to interpret. |
| Workspace switching | Separation of personal/business context. | People can always see which workspace will receive their confirmed records. |
| Story editor | Keyboard, date, draft state and resume. | Words remain editable; the focused field and next action remain reachable. |
| Voice | Permission, recording, stop, playback and text review. | Each stage has the right action and a clear state, including interruption. |
| Clarification | Consequential ambiguity versus unnecessary questions. | One understandable decision at a time, with context and an editable alternative. |
| Financial review | Amount, direction, account, person and proposed meaning. | It is quick to spot an error, change it and confirm the real record count. |
| Records and details | Search, filters, grouping, correction and provenance. | People can find a payment and understand its details without navigating a database-like form. |
| People and balances | Who owes whom and whether figures are complete. | The direction of a debt is unmistakable; repayment is not mistaken for a new sale. |
| Money Stories / insights | Useful hierarchy, traceability and business/personal language. | People can explain what a number means. Net movement is not presented as profit. |
| Goals and what-if | Current progress versus an experiment. | Target, set aside and remaining are clear; experiments do not alter saved records. |
| Reports | Choosing a useful period, generating, downloading and sharing. | Files can actually be obtained on a supported phone, with a fallback when sharing is unavailable. |
| Settings and support | Account, privacy, help, exports and destructive actions. | Necessary controls are discoverable and dangerous actions have proportionate confirmation. |
| Plans and subscriptions | Current entitlement, usage, upgrade, renewal and cancellation. | The customer understands the agreement and can reach the correct management route. |
| Tablet and desktop | Available space and input methods. | Navigation and layouts adapt purposefully rather than displaying a giant stretched phone. |

### Every menu and symbol needs a reason

For each major destination or action, record: the customer's task, how often it is needed, its consequence if tapped accidentally, why its location is discoverable/reachable, its visible label or accessible name, and its behaviour when Back is pressed. A compact decision table is sufficient; do not create a paperwork exercise for every decorative pixel.

Use familiar icons consistently. Important unfamiliar actions need visible words; tooltips and long-press discovery are not enough on phones. A profile control and a workspace selector must not be indistinguishable. Do not use colour alone to communicate direction, errors or selection.

### Interaction and visual craft

- Give important mobile controls generous hit areas. Android guidance uses a 48 dp minimum; for the web design, adopt approximately 48 CSS px hit areas for primary controls as a project target and verify the actual experience. CSS px and Android dp are not interchangeable implementation units. [Android touch target guidance](https://developer.android.com/develop/ui/compose/accessibility/api-defaults).
- Respect display cutouts and system gesture areas. Backgrounds may extend to screen edges, while important content and controls remain safely inset. [Android edge-to-edge guidance](https://developer.android.com/design/ui/mobile/guides/layout-and-content/edge-to-edge).
- Test browser toolbar expansion, standalone mode, short viewports and the software keyboard. Bottom navigation, a save bar and a keyboard must not obscure each other or the focused field. WCAG 2.2's focus-not-obscured criterion addresses author-created overlap; aim for fully usable controls, not merely the minimum visible sliver. [W3C guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html).
- Use sheets for concise contextual choices; use a full screen when a task needs sustained entry or review. Avoid nested scrolling forms and sheets stacked on sheets.
- Define browser Back, visible Back/Close, Escape and future Android Back together. Let the platform handle the keyboard appropriately; a later Back should dismiss the current transient surface or return through meaningful history. Do not trap people, silently discard work or simulate native predictive Back with decorative CSS. Native predictive Back depends on the Android integration. [Android Back documentation](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture).
- Preserve useful filters, scroll and draft context when returning. Handle refresh and deep links deliberately, rather than relying only on temporary component state.
- Keep normal text selectable, support password managers and paste, use appropriate input modes, and preserve pinch zoom. Do not set `user-scalable=no` or globally disable browser behaviour to imitate an app.
- Keep feedback prompt and meaningful. Animation can explain a change, but must not delay capture, hide errors or inflate loading time. Respect reduced motion.
- Use the fixed CashNarra identity to create visual character through composition, spacing, hierarchy, information design and restrained motion. A generic phone shell or extra rounded cards does not establish a distinctive product.

**Brand lock:** preserve the existing logo artwork, symbol, wordmark, colours, proportions and spacing. Reuse approved assets without redrawing, recolouring or substituting the logo. Existing approved light/dark variants and proportional resizing are allowed. Keep the existing colour system and font families. Platform icons may use the approved symbol inside suitable padded canvases; do not crop the mark, distort it or invent a new monochrome logo.

## 9. Google Play changes the release and subscription work

Packaging is not the same as release readiness. Keep this work separate from improving the current UX.

| Requirement or decision | Consequence for CashNarra |
| --- | --- |
| Digital subscription billing | Google's policy explicitly includes financial-management software among digital services. An in-app purchase generally needs Play Billing unless an applicable exception/program applies. Do not assume website checkout links are allowed in a Play package. [Payments policy](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en). |
| Existing subscribers | Google documents a consumption-only route in which customers sign in to access a service bought elsewhere. It restricts in-app purchasing in that model. The exact approach must be selected against the current policy and target regions, rather than copied from an unrelated app. [Payments FAQ](https://support.google.com/googleplay/android-developer/answer/10281818). |
| Plans across channels | Keep one entitlement model, the original agreed price and price-protection terms. Track which channel manages a subscription. Route renewal/cancellation to the actual manager; do not make a website cancellation button claim to cancel a Play subscription without the real integration. |
| Local prices | On the website, retain the agreed USD-led pricing and appropriately labelled approximate GHS equivalent. For a future Play purchase, display the authoritative price supplied for that store product/currency. A live FX estimate must not masquerade as the store's final charge. |
| Payment reliability | Later backend verification must handle pending, cancelled, failed, refunded and restored purchases. Never grant paid access because a client button or return URL said success. This is future payment integration, not permission to implement payments now. |
| Data safety | Declare actual data handling, including controlled web content and provider/SDK flows. Sending audio or financial text to a server/provider still matters when the interface is web-based. [Data safety requirements](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en). |
| Account deletion | Apps supporting account creation need an in-app deletion request path and an external web resource. Distinguish account deletion from sign-out, uninstalling, cancelling a plan and deleting original stories. Any legitimate retention must be explained. [Account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en). |
| Financial declaration | Complete Play's Financial features declaration accurately for the actual product. Do not classify CashNarra as a wallet, lender or payment initiator because it tracks money. [Financial features declaration](https://support.google.com/googleplay/android-developer/answer/13849271?hl=en). |
| Testing account type | New personal developer accounts covered by Google's rule need at least 12 continuously opted-in closed testers for 14 days before applying for production access. Verify the owner's real account type and current requirements when release work starts. [Testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en). |
| Release engineering | Verify the current target-API requirement, app signing, verified links, Android App Bundle, permissions, review access, privacy policy, support contact and listing accuracy at release time. A successful web build is not proof of any of these. |

Service fees, taxes and payment processing can affect the economics of low-priced plans. No percentage or revised price is assumed here. Do not change existing customer agreements to cover a distribution decision. Prepare the owner-facing decision separately when payment integration is assigned.

Do not display “Get it on Google Play” or a working-looking store badge before there is a real published destination. Likewise, do not claim full offline operation, guaranteed privacy properties, native background recording or biometric protection without implementation and evidence.

## 10. What Claude should do now and what comes later

### Now: finish the redesign as an app experience

Continue from the current redesign branch and rendered concepts. Do not reset the latest UI or restart the project. Review every maintained screen and state against the phone-app requirements, using the current implementation rather than an old report.

Revisit the navigation and capture/review flow first because they affect the rest. Then carry the chosen interaction model through records, people, understanding, plans, exports, account settings and the public entry experience. Improve the current PWA foundation where it can be implemented safely within existing architecture. Make the present app genuinely useful without installation.

Create or update concise repository rules covering placement, language, state, persistence claims, responsive adaptation, app lifecycle and verification. Record a short distribution decision with the TWA recommendation and conditions for changing it.

### Next: prove the real phone experience

Use an actual Android device and, where possible, an iPhone. Test browser and installed contexts, keyboard, microphone permission and capture, interruptions, links, exports, offline transitions, sign-out and return. A browser emulator is useful preliminary evidence, not proof of physical-device behaviour.

Continue unpaid design work while arranging person-led tests. Do not convert a missing device or screen-reader participant into a reason to stop implementing reversible improvements. Mark those checks NOT RUN until someone actually performs them.

### Later: Android packaging and commercial release

Once the PWA passes capability checks, create a local/internal TWA prototype in a specifically assigned packaging phase. Validate the real Play installation path and the target-market billing approach. Move to Capacitor only if a demonstrated requirement and its extra implementation work justify it.

No Play Console purchase, production publication, release signing-secret exposure, migration or paid service is authorised by this research handoff. These limits do not require permission for ordinary local UX edits, mock verification or documentation.

## 11. App acceptance checks

Use these alongside the existing financial, UI and landing tests. Record current results; do not label inherited results as rerun.

| ID | Check | Required observation |
| --- | --- | --- |
| APP-01 | Public entry | Someone can understand the product, try the fictional example and start without installing. |
| APP-02 | Installed cold/warm launch | A signed-in customer reaches useful app content; an expired session returns to the intended destination after sign-in. |
| APP-03 | Installation | Supported prompt or accurate manual help; cancellation is harmless; no false installed message or repeated nag. |
| APP-04 | Navigation | Core destinations are labelled, selected state is clear, and settings/accounts/people/plans remain findable. |
| APP-05 | Back and close | Keyboard, dialog, review and screen history behave coherently. No draft loss, route loop or trapped Back gesture. |
| APP-06 | Keyboard and safe areas | At short phone heights, focused inputs, stop/save controls and navigation remain reachable without overlap. |
| APP-07 | Touch and zoom | Hit areas work at small widths; 200% zoom/larger text does not remove essential actions; pinch zoom remains available. |
| APP-08 | Draft lifecycle | The real locally persisted text recovers after an appropriate restart; failures do not claim successful persistence. |
| APP-09 | Refresh/deep link | A refresh or meaningful app link reaches the intended accessible state without losing context or exposing another workspace. |
| APP-10 | Workspace context | Capture/review/save clearly identify the intended workspace; switching cannot misdirect an unresolved proposal. |
| APP-11 | Voice permission | Recording begins only after a chosen action and granted permission; refusal has a useful typed fallback. |
| APP-12 | Voice interruption | Real-device stop, call/app switch, lock and return have honest outcomes; missing or partial audio is not silently accepted. |
| APP-13 | Transcript reuse | Edited words and failed interpretation do not cause another transcription of an already completed recording. |
| APP-14 | Weak/offline network | Draft, waiting, failed and uncertain states are distinguishable; no automatic duplicate paid call or ledger posting. |
| APP-15 | Save integrity | Confirmation precedes authoritative save; receipt resolution and idempotency remain intact; no false Saved state. |
| APP-16 | Files | A generated report can actually be downloaded/shared on a supported phone; unsupported sharing has a working fallback. |
| APP-17 | Privacy on shared devices | Sign-out/account switch cannot reveal another customer's local drafts, recordings or cached responses. |
| APP-18 | Safe app update | An available update does not forcibly interrupt a recording, review or in-flight save. |
| APP-19 | Plan truth | Current plan, unknown usage, upgrade, renewal and cancellation reflect real account/channel state. No payment is invented. |
| APP-20 | Accessibility | Keyboard focus, accessible names, announcements, contrast and reduced motion checked; TalkBack/VoiceOver testing identified separately. |
| APP-21 | Adaptive layouts | Check 320/360/390/768/1024/1440 CSS-pixel widths, short phones and landscape; tablet/desktop navigation uses space well. |
| APP-22 | Brand | Approved logo assets remain unaltered; existing colours/fonts are respected; icons do not crop or distort the symbol. |
| APP-23 | Performance | Record actual loading/interactivity/transfer-size evidence on a stated device/network or labelled lab setup. Do not call a desktop screenshot “fast on low-end phones.” |
| APP-24 | Regression | Current typecheck, lint, unit/domain tests and relevant browser journeys pass; excluded service-backed checks remain explicit. |

For performance, Google's general web targets are LCP ≤2.5 seconds, INP ≤200 ms and CLS ≤0.1 at the 75th percentile. Use them as measurement targets, not as invented CashNarra results. Field evidence requires real traffic or appropriately gathered device observations. [Core Web Vitals](https://web.dev/articles/vitals).

Engagement should also be assessed through tasks: can a new customer explain the value, save a correct fictional story, find a repayment, distinguish a goal experiment from a saved change and resume later? Observe hesitation, errors and assistance required. An attractive screenshot or a passing test suite does not establish conversion or retention. Collect outcome evidence without recording private stories or amounts in analytics by default.

## 12. Ready-to-use instruction for Claude Code

Read this entire research handoff and the current `CashNarra_Claude_Code_UI_UX_Master_Prompt (1).md` (or its same-content filename in this project). Continue the existing complete redesign from the current local branch. Preserve other agents' work and inspect Git before editing. Do not reset to the older GitHub baseline.

**The product direction is that CashNarra should become both an installable PWA and, later, a Google Play application. Design for real phone-app use now. A narrow browser viewport is only one of the contexts to support.**

Treat this as a continuation of the full product redesign, not a small overflow patch, an install-banner task or permission to turn the interface into a generic native template. The public website must make the value compelling. The signed-in product must be quick, clear, memorable and dependable in daily use. Both should feel like the same CashNarra.

The existing logo, colour system and font families remain fixed. Do not redraw, evolve, simplify, recolour, distort or replace the logo, symbol or wordmark. Use the approved assets, approved light/dark variants and proportional sizing. Reconsider other presentation and interaction choices freely when there is a reason to improve them.

First, inspect the actual current app and the three redesign concepts already produced. If those concepts were not rendered or did not consider the whole product, close that gap with focused examples; do not silently claim they were completed. Do not repeat concept work that already provides useful evidence. Evaluate the selected direction as an app, not only as a website.

Make and document a compact navigation/interaction decision. For each major destination or action, explain the customer task, its priority, why the placement and label fit a phone, and its Back/Close behaviour. Evaluate a small stable set of labelled mobile destinations and a distinct capture action; the example four-item structure in this research is a hypothesis, not a mandatory layout. Keep useful features discoverable. Adapt navigation for tablet and desktop.

Then implement the necessary improvements across public entry, onboarding, Home/Today, text/voice capture, clarification, review, saved records, accounts, debts/people, Money Stories, goals/what-if, reports, pricing, subscriptions, settings and support. Cover empty, loading, error, offline, interrupted and returning-user states. Keep words ordinary and actions specific. Do not remove a useful capability because it complicates the new layout.

Check every significant menu, icon, action and information grouping for clarity, reachability and consequence. Test the software keyboard, safe areas, short screens, meaningful Back history, state restoration and deep links. Distinguish navigational destinations from actions. Avoid competing primary controls, unexplained icons, excessive nested dialogs and sticky UI that covers the work.

Audit and improve the existing PWA foundation: stable app identity, appropriate launch/scope, approved icons, standalone behaviour, optional context-aware installation help, safe public-asset caching, truthful local-draft persistence and safe update handling. Do not cache authenticated financial responses indiscriminately. Do not introduce background financial posting or a new synchronisation engine as a cosmetic app enhancement.

Record the architecture recommendation: PWA first; Google Play later; TWA is the first Android packaging candidate if capability tests pass; Capacitor requires a justified client/native integration plan. Do not migrate to Laravel, replace Next.js, add a generic production remote-URL WebView or rebuild in another mobile framework merely to make the product “an app.” If a measured requirement changes the recommendation, document the evidence and smallest suitable alternative.

Preserve exact calculations, tenant isolation, server-only credentials, atomic/idempotent saves, receipts, corrections/provenance and human confirmation. AI and transcription do not authorise or post money records. Preserve current provider configuration, Groq Free-only behaviour, transcript reuse, historical journals and agreed plan/price protections. The completed synthetic voice clip must not be sent again.

For future Play work, document the billing/data/deletion/release decisions that remain. Do not assume a website subscription checkout can be linked unchanged from a Play app. Current paid access must reflect actual agreements, with no simulated payment success. Do not publish, enable payments, spend on providers or obtain new credentials for routine UX verification.

Use fictional data and mocks for development. Run the relevant existing checks and the APP-01–APP-24 matrix as far as the available environment permits. Desktop emulation, real Android browser, installed Android PWA, iPhone browser/installed web app and a future Android package are distinct evidence categories. Mark checks NOT RUN when unavailable. Do not claim microphone, accent or screen-reader proof from a synthesised clip or screenshots.

Keep a short decision record and reusable mobile-app UX/language rules in the repository; update the current harness state. Continue reversible local work without requesting approval for each placement or ordinary implementation choice. If an external device/person test is unavailable, finish independent implementation and leave a specific test task.

Finish by showing the working redesign at phone and desktop sizes, the meaningful journey changes, the PWA improvements actually implemented, the current verification results and the exact remaining work before Android packaging. Explain the result in understandable English. Do not claim that every placement is objectively best, that Play approval is guaranteed or that engagement improved without evidence.

## 13. Research boundaries

This research used official platform/framework documentation and inspected project files. Recommendations about sequencing, navigation candidates and avoiding an early rebuild are project-specific judgments drawn from that evidence.

No current local redesign screenshots were independently reviewed here. No physical device, live recording, paid AI call, payment, new build, database change or deployment was run for this research. There is no newly built PWA or Android package attached to this handoff. The deliverable is the researched decision and implementation instruction.

Platform policies and capabilities change. Claude should use the installed framework's version documentation for code changes and recheck store policies for the actual release date, owner account, countries and purchase model. Do not carry old installation limitations forward when current browser or Apple documentation contradicts them.
