# CashNarra as a phone app — decisions, 21 October 2026

Companion to `docs/ux/REDESIGN_STRATEGY_2026-10-21.md` and the owner's `CashNarra_Mobile_App_Strategy_and_Claude_Handoff_2026-10-21.md`. This record covers the navigation and interaction decisions, the PWA foundation that shipped, the distribution recommendation, and what still needs a real device.

## 1. Distribution decision

**PWA first. Google Play later, through a Trusted Web Activity if the PWA passes its capability checks.** One product, one account, one set of records, reached from a link, a home-screen icon or, later, the store. No Laravel, no second client, no remote-URL WebView, no framework change.

Conditions for changing the recommendation to Capacitor: a measured need for a native capability the browser cannot give (for example reliable background recording or a native file picker that the target browsers lack), together with a client bundle and a reviewed client/server boundary. A store listing by itself is not such a need.

Conditions that stay open before any Play work: a production domain with Digital Asset Links, a signing identity, the billing route for Plus inside a Play package (Play Billing or a documented consumption-only route for subscriptions bought on the web), the Data safety declaration, an in-app account-deletion request plus a web route, the Financial features declaration, and the owner's actual developer-account testing requirements. None of these is started by this pass.

## 2. Navigation and the capture action

The bottom bar on phones has four labelled destinations and one action. On tablets and desktops the same destinations sit in the top bar and the action is the composer itself.

| Place | Customer task | How often | Label and symbol | Why here | Accidental tap | Back |
| --- | --- | --- | --- | --- | --- | --- |
| Home | Tell what happened; see today and the log of days | Every visit | **Home**, house | The first and most frequent task; the log is the reason to return | Nothing changes | Browser or system Back leaves the app only from Home |
| Records | Find, check or correct a record; find a person's balance; see accounts | Often | **Records**, notebook; inside it the views Records · People · Accounts | One place for everything already saved; People and Accounts are views, not more bar items | Nothing changes | Back returns to the previous screen; the view is in the address so it survives refresh |
| Tell (phones only) | Start a story from anywhere | Often | **Tell**, speech mark from the logo symbol, centre of the bar | The capture action must be one tap from any screen on a phone; on wider screens the composer is already on Home | Opens Home and focuses the story box; nothing is saved | Back returns to where the person was |
| Money Stories | Read a day, week or month; business profit review; export | Weekly | **Money Stories** (**Stories** on narrow bars), open book | Reading, not recording, so it sits apart from the composer | Nothing changes | Back returns to the previous screen |
| Plan | Goals and Explore what-if | Occasionally | **Plan**, target | Planning is its own kind of task and deserves a stable home | Nothing changes | Back returns to the previous screen |
| Account button (top right) | Switch workspace; Manage accounts; Plan and usage; Settings and privacy; Sign out | Rarely | Initials avatar with the workspace name on wide screens, a chevron; accessible name "Workspace, accounts and settings" | Identity and administration are kept out of the bar so the bar stays about money tasks; the workspace receiving records is always named on Home | Opens a menu; nothing changes | Back or Escape closes the menu and restores focus |
| Hide amounts, dark mode | Privacy on a shared screen; comfort | Rarely | Eye and moon icons with accessible names | Small, immediate, reversible | Reversible with the same tap | Not a navigation step |

Destinations are navigation; the composer actions (Understand my story, Speak, Save N records) are actions and never appear in the bar. "Tell" is the only action in the bar and it only moves focus.

## 3. Back, Close and the keyboard

- Every screen change pushes a browser history entry carrying the screen name in the address (`/app?view=records`, `?view=people`, `?view=accounts`, `?view=stories`, `?view=plan`, `?view=settings`, `?view=usage`). Browser Back, the Android Back gesture in an installed PWA and a later TWA all walk that history. Refreshing or opening a link with a view restores that view for the signed-in person's own workspace only; a signed-out person sees the sign-in screen and no data. The review screen is history too, but it is never written to the address: a refresh returns to Home with the draft, and Back onto a review that no longer has a draft lands on Home.
- A dialog or sheet pushes its own entry. Back, Escape and the Close control all do the same thing: close the surface and return focus to what opened it. Back during a recording re-opens the same "leave or keep recording" question that Close asks; the entry is restored so the gesture cannot drop the clip.
- Home-screen shortcuts: "Tell what happened" opens `/app?compose=1`, which lands in the story box and then clears the flag from the address; "Records" opens `/app?view=records`.
- Drafts live in component state and, when the person turns it on, on the device. Back never discards a draft; it only changes what is on screen.
- The viewport asks the browser to resize the layout for the software keyboard, so the composer's actions and the pinned Save bar stay above the keyboard instead of under it. Safe-area insets pad the top bar, the bottom bar and the pinned Save bar on phones with cutouts and gesture areas. Pinch zoom stays enabled.

## 4. PWA foundation that shipped

- Manifest: stable id and scope, `start_url` on the signed-in app, standalone display with a browser fallback, both approved icons also declared as maskable (the approved app icon keeps the symbol inside the safe zone; nothing is redrawn), two shortcuts (Tell what happened, Records), categories and the description.
- Launch: an installed launch opens the app. A signed-out person sees a short "open your records" screen with Sign in; after sign-in they land on the app. The public page stays a public page.
- Service worker (`public/sw.js`, cache `cashnarra-public-v4`; the first draft of this note said v3): caches the public brand files and the `/offline` page at install. A page navigation always goes to the network; only when that fails does the cached offline page answer, which says a connection is needed and that nothing was saved or lost. No signed-in or financial response is ever cached (`/api/*` and any query string are left alone). The worker no longer skips waiting on its own; the app notices a waiting worker and shows "A newer version of CashNarra is ready" with Refresh now (disabled while busy, while a receipt is pending or while recording) and Later; otherwise it applies on the next open.
- Installation help: when the browser offers an install prompt, "Add to your home screen" appears in the account menu; in an installed window it does not. Nothing claims the app was installed.
- Recording: if the app is hidden, the page is being unloaded, or the microphone track ends while recording, recording stops and the clip is kept with the message "Recording stopped because the app went to the background. Check the clip before using it, or record again." A partial clip is never silently accepted; the person still chooses to use it or record again.
- Viewport: `viewport-fit=cover` and `interactive-widget=resizes-content`, so the software keyboard shrinks the layout and the top bar, bottom bar, content and the pinned Save bar add the safe-area insets.

## 5. What was checked, and how

Emulated checks are labelled E (headless Edge or the in-app browser); real-device checks are R and remain NOT RUN until someone performs them. See the build log entry "Phone-app pass" for the APP-01 to APP-24 results.

## 6. Remaining work before Android packaging

1. Real Android phone: browser and installed launch, keyboard, microphone permission, interruption by a call and by the screen lock, export download and share, offline transitions, sign-out and return. Then an iPhone where possible.
2. A person using TalkBack or VoiceOver.
3. A production domain and HTTPS, then Digital Asset Links and a local TWA prototype in its own packaging phase.
4. The billing route inside a Play package, decided against current policy before any store listing.
5. Field performance evidence on a representative phone and network; lab figures are in the build log.
