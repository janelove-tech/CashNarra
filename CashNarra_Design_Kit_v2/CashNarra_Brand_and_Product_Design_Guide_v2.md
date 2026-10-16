# CashNarra Brand and Product Design Guide — v2

Version 2.0 • Research date 13 October 2026 • Recommended system for implementation

CashNarra turns ordinary descriptions of money into records people can review, correct, understand, and use to plan. This guide recommends **Narra** as its brand and product direction. It defines one consistent identity, interface, writing system, financial presentation, and implementation contract for a small team.

**Fixed identity:** CashNarra  
**Fixed tagline:** Tell Your Money Story. See the Numbers.  
**Product structure:** Record → Understand → Plan  
**Experience principle:** Serious money. Light interaction.

All new identity artwork and screen examples in this handoff are **proposed concepts**, not previously approved assets, a working financial application, or evidence of legal or accessibility certification. All financial examples concern the fictional **Ama Works** workspace. Amounts are illustrative.

Use this guide with the supplied token JSON, matching CSS, vector assets, identity board, interactive preview, six campaign flyers and fictional dataset. The Markdown is the editable source of the guide. The one-page implementation brief at the end is the starting instruction for a designer or coding tool.

## 1 Recommended direction and rationale

Choose **Narra: words into clarity**. Give the product a recognisable pair of speech shapes, an expressive wordmark, ink-violet editorial moments, apricot accents and quiet working surfaces. The identity is proposed; it is not trademark-cleared or a previously approved mark.

The interface has a clear emotional and functional centre: **tell what happened, see the records take shape, then understand the day**. It should invite a first interaction before it asks users to study a dashboard. Routine navigation, searching and corrections remain direct.

The recognisable elements are the opposing speech shapes, Manrope's substantial display lettering, restrained violet actions, apricot on ink, and the transformation of one narration into aligned records. Identity comes from repeated proportion, shape and composition. Keep marketing energy strongest in campaigns; use it sparingly around financial work.

**Record:** an inviting composer, clear source text, necessary questions, a compact batch review. **Understand:** traceable totals, readable records, chapter-based Money Stories. **Plan:** a specific goal, recorded allocations, conditional pace and separated scenarios.

The product uses different layouts for different work. Today is an invitation plus a snapshot. Records is a scanning surface. A Money Story is an editorial explanation. Plan is a decision surface with assumptions. Equal-sized cards are not the organising principle.

**Engagement comes from agency and visible usefulness:** an example that removes the blank-page barrier, a short review that visibly organises the user's words, a meaningful recap, a forgiving rhythm and optional goal progress. There are no rewards for spending, borrowing, wealth or transaction volume. A saved batch gets a quiet completion response, not a celebration of financial outcomes.

No mascot or personified AI at launch. The speech mark identifies the brand; it does not imply that an agent is alive, knows everything, or controls the money. Microphone availability is a capture affordance, not an animated character.

**Prototype status:** the supplied HTML is an interactive design demo using fictional data. It runs without network requests, a backend or real AI. It demonstrates mock interpretation, review, correction, filters, a recorded debt settlement, a scenario slider, CSV export and appearance controls. Saved demo changes live only in memory. Production authentication, atomic posting, IndexedDB recovery, audio processing and account management still need implementation and testing.

## 2 Source and decision inventory and research lessons

### Sources reviewed

| CashNarra source | Review and authority |
|---|---|
| Research CashNarra Concept.txt | Read in full, all 6,628 lines and 165,951 bytes, from the supplied local attachment. The last vision summary interprets earlier proposals. |
| Research CashNarra Concept(1).txt | Read all returned ranges and compared the complete text with the attachment. Same text; adds no separate decisions. |
| CashNarra_Brand_UI_UX_Research_Prompt.md | Read in full, 330 lines. Same design assignment as the current brief; the current user message controls. |
| CashNarra_Stack_Research_Prompt.md | Read in full, 233 lines. Confirms small-team simplicity, financial integrity, and compliance requirements. Its stack candidates are not an approved stack. |
| Current user brief | Read completely. Controls the required deliverable and initial product boundaries. |
| Visible CashNarra conversation excerpts | Reviewed the supplied excerpts. The complete technology chat is separately listed below; no unlisted project source was available. |
| Recommend Technology Stack.txt | Read in full from the supplied local attachment: 1,025 lines, 89,277 bytes. Includes the full recommendation, OVH comparison, final Vercel decision, and the user's free-development constraint. Supersedes earlier incomplete chat retrieval. |

No approved logo, palette, type system, or component system was found. The final technology decision is **Next.js 16, React, TypeScript, Node.js 24 and CSS Modules; managed Supabase; Vercel as intended production host; OpenAI Responses through the official SDK and schema validation; Resend; IndexedDB/service worker; exact decimal arithmetic with a hidden ledger; and in-app exports**. The original recommendation pins gpt-4.1-mini-2025-04-14 and uses NUMERIC(20,2), decimal.js, jsPDF and write-excel-file.

The latest development instruction is **local/free first: Supabase Free, mock AI for routine work, a small real-API evaluation budget; Vercel Hobby only where its terms permit**. Production tiers, contracts and operational upgrades follow actual need. The Django/HTMX fallback and OVH hosting path are alternatives, not the chosen starting route. No paid deployment or new provider account is created by this design handoff.

### Reconcile the evolution

| Status | Decision |
|---|---|
| Fixed by current brief and latest vision | Name, tagline, Record → Understand → Plan, Serious money. Light interaction, conversational financial memory and navigation, clarify important ambiguity, simple batch review, traceable ledger, manual Cash/Bank/MoMo, optional goals. |
| Fixed by the complete technology chat | Next.js/React/TypeScript/CSS Modules; managed Supabase; intended Vercel hosting; bounded OpenAI; exact atomic ledger; free/local development first. |
| Initial product support | Personal/business workspaces; text; multi-event extraction; corrections; loans/owner money/debts/settlements; Money Stories; offline drafts; exports; privacy and settings. |
| Proposed implementation sequence here | Text and reliable saving first; simple fixed-amount goals in the first proper release; short voice after text is stable; richer what-if and goal types later. |
| Earlier proposals revised or deferred | Automatic Money Inbox, feeds/SMS scraping, full daily reconciliation, inventory accounting, tax filing, financial passport, collaboration, autonomous posting. |
| Earlier design suggestions evaluated here | Warmth retained in the copy and apricot accent; Narra Pulse replaced by a filled speech mark; streaks replaced by a forgiving rhythm with literal review counts. |
| New recommendations | Narra identity, four-item navigation, a two-font system, paired speech device, no mascot, state vocabulary, explicit recorded balances, allocation-based initial goal pace, the component and token system below. |

Do not ship “Your money records itself”, “We already know what moved”, “Tuesday complete”, numerical record-confidence scores, or automatic bank-verification labels. Those statements overreach the initial product or the available evidence. Earlier enthusiasm for them is not approval for those claims.

### Research synthesis

The references below were checked on **13 October 2026**. Product documentation shows design choices; it does not prove that CashNarra users will respond the same way. The adaptations are recommendations to test.

| Reference and evidence | Apply and adapt for CashNarra | Evidence still missing |
|---|---|---|
| Duolingo's craft account describes consistent hierarchy and spacing, with purposeful variation between tabs [R01]. | Reuse headers, spacing, and review rows. Product screens use the same grammar; marketing may be more expressive. | No CashNarra evidence that decoration or a linear path improves task success. |
| Duolingo reports a **3.3% relative** Day-14 retention increase when streaks and daily goals were separated [R02]. | Separate a check-in from reviewing records and verifying accounts. Use a rhythm indicator, not a compulsory daily streak. | The experiment concerns language learning. Its retention uplift cannot be forecast for money recording. |
| Monzo's product help separates balance, spending, and target views, and explains period-specific money in/out [R03]. | Start with useful totals and allow drill-down. CashNarra's figures are based on manually recorded information; bank-like “available to spend” claims need more evidence. | A bank's connected-account experience does not establish comprehension for manually tracked accounts. |
| Todoist documents days off, Vacation mode, celebration controls, and the ability to turn Karma off [R04]. | Let users pause reminders, choose active days, catch up, and hide consistency indicators. Do not copy points loss or task-volume incentives. | Which rhythm fits Ghanaian users; whether indicators create pressure. |
| YNAB describes targets that calculate a required contribution for an amount and cadence [R05]. | Show the required pace and let users set an optional date. Extend with a clearly labelled pace derived from recorded goal allocations. | Whether users understand earmarking versus money movement, and what history supports useful estimates. |
| GOV.UK recommends check-answers pages, contextual change links, and preserving earlier answers [R06]; its error summary links to specific problems [R07]. | One review for the batch, editable rows, preserved drafts. Ask one financially consequential question at a time [R08]. | The best number of records per mobile batch; whether repeated clarifications become burdensome. |
| Human–AI guidelines support visible capabilities, efficient correction, and explanations of system behaviour [R09]. | Show source snippets, why a clarification matters, and previews of corrections. Use field-specific uncertainty words, not invented confidence percentages. | Evaluation on messy financial narration, Ghanaian accents, names, and mixed account descriptions. |
| FCA research found trading-app engagement practices could change trading frequency and risk [R10]. | Keep rewards attached to useful review and understanding. Do not reward financial actions or public comparisons. This is a precautionary design inference. | Direct evidence in record-keeping. UK rules are not treated as Ghanaian law. |
| WCAG 2.2 supplies a testable accessibility target [R11–R18]. | Specify accessible controls and complete journeys, then test the implemented product. | Actual conformance: palette checks and attractive mockups are insufficient. |

Wise's public entry page required JavaScript and its linked documentation endpoint returned a missing page. It was not used as evidence for product components or tokens. Older Duolingo identity links redirected; the accessible official craft article was used instead. A guessed SEC Act PDF URL was inaccessible; the current SEC notice and official licensing materials supported only the limited statements cited here. GRA's current Act and administrative-guideline PDFs were located, but their searchable text was unavailable in this review; current E-VAT information was accessible. These limitations are preserved in the compliance questions, rather than filled with earlier chatbot claims.

## 3 Creative directions and selection

| Direction | Concept and audience | Identity and home expression | Strength, risk and production cost |
|---|---|---|---|
| **Narra — selected** | A person's ordinary words becoming organised clarity. For people who avoid forms but want control over their records. | Paired speech shapes; substantial Manrope wordmark; violet, ink and apricot. Today places a friendly narration surface beside a short Money Story. | Distinctive transformation can repeat across product and campaigns. Strong headings need careful space on phones. Two self-hosted fonts, one icon family and one vector mark keep execution manageable. |
| **Bearings** | An instrument for finding direction. Best for financially confident users who value decisions over storytelling. | Navy #213647, sky #A5D6F6, white; Inter throughout. A geometric open compass; compact balance and plan panels lead the home. | Precise and efficient. Risks resembling another financial dashboard and making uncertain forecasts look authoritative. Low asset cost, medium chart-design burden. |
| **Daybook** | A useful daily notebook. Best for users who already keep written notes and want a familiar transition. | Plum #4C334C, parchment #F6F0E6, brick #A55136; Inter with a restrained editorial heading face. A page-tab mark; dated entries lead the home. | Approachable and good for history. Risks feeling static and asking users to read before they act. Low motion cost, moderate typography and print-layout burden. |

Select Narra because it makes the central product behaviour recognisable and gives marketing an ownable compositional device. The choice is a design recommendation, not evidence of better activation or retention. Validate it against Daybook with representative users before treating it as settled brand preference.

All three need contrast, reflow and non-colour state cues. Narra limits apricot to dark-text surfaces, illustration and accents; controls and body text do not rely on pale orange for legibility. Familiar financial row alignment remains because it helps users compare amounts. CashNarra's own expression is the speech-to-record connection and tone, not a custom replacement for basic conventions.

## 4 Brand foundation and messaging

### Positioning and audience

For people and owner-operated small businesses who know what happened with their money but find conventional entry cumbersome, CashNarra turns everyday descriptions into organised, reviewable records and explanations. Its difference is **financial meaning with visible human control**: a transfer stays a transfer, a debt payment does not become a second sale, and a goal forecast shows its assumptions.

Prioritise owners, freelancers, and individuals using a mixture of cash, mobile money, and bank accounts. Support both personal and business workspaces, but avoid claiming to solve every accounting need. Financial and digital confidence vary within each audience. Occupation, gender, accent, age, and location do not determine interface sophistication.

**Promise:** “Tell us what happened. Review what we understood. See what it means.”

**Brand story:** Money is remembered in moments: a sale, a delivery, someone paying back a balance. Those moments are easy to forget or misclassify when scattered across messages and memory. CashNarra connects the story to records that can be checked, explained, and revisited. Over time, that history helps the user see a possible route toward something they care about.

**Personality:** attentive without pretending to be a friend; clear without lecturing; encouraging without judging wealth; candid about missing information; composed when the news is difficult.

### Principles that produce behaviour

| Principle | Required product behaviour |
|---|---|
| Understand the event before naming the category | Ask “New sale or a balance they owed?” before treating a receipt as revenue. |
| Ask only when meaning changes | Clarify amount, date, ownership, account, obligation, or sale inclusion. Leave optional description/category refinements for later. |
| Let numbers explain themselves | Every material summary links to its records, time range, and exclusions. |
| Save is a verifiable event | Show Saved only after an authoritative receipt. Keep drafts and unknown save outcomes recoverable. |
| Provide a next action, preserve choice | Resolve a draft before promoting goals, but keep “Tell another story” available. |
| Give useful understanding as the reward | After review, reveal a grounded Money Story; do not award points for money activity. |
| Progress is literal | “8 records reviewed” means exactly that; it never means “all activity captured”. |
| Make the light path correct | Batch review, sensible defaults, keyboard controls, and inline correction must retain financial integrity. |

### Messaging hierarchy

| Layer | Ready-to-use wording | Product proof |
|---|---|---|
| Tagline | Tell Your Money Story. See the Numbers. | Narration → reviewed records → explanation. |
| Main value proposition | Turn everyday money stories into records you can understand. | Multi-event extraction, accessible review, traceable totals. |
| Recording support | Describe several things at once. Review them together. | One narration, one batch review. |
| Trust support | Check what CashNarra understood. Change it when needed. | Source snippets and correction history. |
| Understanding support | See where recorded money came from and where it went. | Period totals with included records. |
| Planning support | Explore where your current pace could take you. | Allocation pace and explicit assumptions. |
| Boundary explanation | CashNarra keeps records. Your money stays in your own accounts. | Manual tracking; no user-payment or wallet controls. |

Before launch use “designed to”, “helps”, or demonstrate a clearly labelled concept. Describe a shipped capability only after it works. Claims such as “one minute”, “understands every accent”, “accurate bookkeeping”, “secure”, “bank verified”, “tax compliant”, “trusted by thousands”, or “reach your goal faster” require relevant testing or evidence. Do not turn an aspirational principle into a measured fact.

### Tone by situation

Onboarding is inviting: “Start with something that happened recently.” Routine work is brief: “8 records ready to review.” Uncertainty is specific: “Does the sales total include Kojo's GH₵300.00?” Mistakes are repairable: “Change the amount below. We'll show what else changes.” Difficult news is factual: “Your recent contribution pace is lower. This estimate now takes longer.” Never put celebratory visuals beside a loss, debt, or changed forecast.

## 5 Visual identity and exact specifications

### Mark and supporting device

**Wordmark:** CashNarra in Manrope 800, optically tightened and exported as outlined SVG. Capital C and N preserve the name's rhythm. Use the supplied outlined files rather than rebuilding the logo with live text. The product header may use live Manrope as an accessible name; use the original SVG for branded applications.

**Symbol:** two opposing filled speech forms on a 64 × 64 unit grid. The first occupies x6–30 and y3–43; the second x34–58 and y21–61. Rounded shoulders use a seven-unit radius; open opposing tails create the diagonal link. The forms suggest dialogue and an N silhouette without currency signs, bar charts or sparkle imagery. The SVG is the construction source. Do not add strokes, narrow the central gap or replace the shapes with a stock speech icon.

Horizontal lockup uses a 44-unit-high symbol, a 12-unit optical gap and the outlined wordmark. Clear space: at least one quarter of symbol height on every side. Minimum horizontal lockup width: 132 px on screen and 32 mm in print. Use a symbol alone below this size. Minimum symbol: 16 px for favicon only, 24 px for ordinary UI; use 32–40 px in product headers.

App icon: 128 × 128 square artwork; violet background; white symbol within the central 72 × 72 square at x28, y28. This inset accommodates common circle and rounded-square masks. The square file is a source asset; platforms apply their own mask. Provide 16, 32, 192 and 512 px raster exports. Inspect them at actual size, not just enlarged.

Versions: ink on paper/white/apricot; violet on paper/white; white on ink/violet; pure monochrome for one-colour print. Avoid detailed photo backgrounds. If the logo must sit over a photo, use a quiet opaque area or an image region whose contrast has been inspected. No gradient inside the mark, outline-only version, glow, skew, simulated gloss or detached speech halves.

The supporting graphic language enlarges or crops the paired forms in campaigns and onboarding, and uses the same asymmetric speech-tail corner on a source quote. A source quote and a record list make the transformation visible. Do not use the supporting shape as an unlabeled financial chart. The mark works fully without motion. Formal trademark clearance is still required.

### Colour roles

Primary violet **#5B49C7** identifies actions and active navigation. Ink **#29263D** provides text and editorial panels. Apricot **#FFC4A0** adds warmth with ink text. Paper **#F7F7FA** gives whitespace a quiet base. Narra tint **#F0ECFC** supports the composer. Brand colour does not assert positive cash flow, a completed period or reliable forecasting.

| Role | Light | Dark | Intended pairing and behaviour |
|---|---|---|---|
| Background | #F7F7FA | #191723 | Primary text and readable secondary text. |
| Working surface | #FFFFFF | #242131 | Forms, dialogs and account surfaces. |
| Quiet surface | #EFEDF8 | #322C43 | Inactive segments and tracks. |
| Primary text | #29263D | #F6F3FB | All essential labels and amounts. |
| Secondary text | #625F73 | #C1BBCE | Explanations, dates and account context. |
| Muted text | #6B6779 | #B1AABE | Supplementary metadata, never the only state label. |
| Structural border | #E1DEEB | #423B53 | Separators; not sufficient alone to identify editable fields. |
| Control border | #858194 | #8C849D | Input edges against working surfaces. |
| Primary action | #5B49C7 | #BEAEFF | #FFFFFF / #27203E text respectively. |
| Hover / pressed | #4D3DAE / #403194 | #D0C3FF / #AB96F0 | Same on-action foreground. |
| Secondary action | #FFFFFF | #242131 | Primary text with control border; soft variant uses brand tint and action text. |
| Focus | #5B49C7 | #D0C3FF | 3 px outer outline, 4 px offset. |
| Accent | #FFC4A0 | #FFC4A0 | #29263D text; not a success or income code. |
| Brand tint | #F0ECFC | #322745 | Composer and selected surfaces. |
| Success / background | #226247 / #EAF4ED | #9DD5AD / #203B2C | Confirmed operation plus text/check icon. |
| Warning / background | #79501B / #FFF3DF | #F4CE91 / #423322 | Attention needed, with reason. |
| Error / background | #AE302C / #FFEEEC | #FFABA3 / #432624 | Failed action, recovery offered. |
| Unresolved / background | #68449B / #F3EDF9 | #D1B1F2 / #372945 | Draft requiring an answer; no red financial-loss implication. |
| Neutral | #625F73 on #EFEDF8 | #C1BBCE on #322C43 | Informational state and transfers. |
| Money received | #445BA1 | #BACAFB | Arrow down-left plus “Received”. |
| Money paid out | #95603E | #F1BA94 | Arrow up-right or minus plus “Paid out”; never an error. |
| Transfer | #625F73 | #C1BBCE | Two-direction arrow and explicit account pair. |
| Chart series 1–4 | #5B49C7, #95603E, #445BA1, #226247 | #BEAEFF, #F1BA94, #BACAFB, #9DD5AD | Map consistently; direct labels and table alternatives. |
| Disabled | #625F73 on #E6E3ED | #C1BBCE on #383245 | Explain why unavailable when necessary. |
| Editorial Story panel | #FFFFFF on #29263D | #FFFFFF on #322745 | Secondary #D9D4E9; accent #FFC4A0. In/out bars use #BACAFB / #F1BA94, respectively, in both themes. |

Full semantic values are in the token file. The contrast report below contains calculated WCAG luminance ratios, not browser or assistive-technology certification.

| Theme / pair | Foreground / background | Calculated contrast | Target |
|---|---|---:|---:|
| light: text on background | #29263D / #F7F7FA | 13.65:1 | 4.5:1 |
| light: text-secondary on surface | #625F73 / #FFFFFF | 6.17:1 | 4.5:1 |
| light: text-muted on surface | #6B6779 / #FFFFFF | 5.47:1 | 4.5:1 |
| light: on-action on action | #FFFFFF / #5B49C7 | 6.52:1 | 4.5:1 |
| light: on-accent on accent | #29263D / #FFC4A0 | 9.49:1 | 4.5:1 |
| light: warning on warning-bg | #79501B / #FFF3DF | 6.43:1 | 4.5:1 |
| light: border-control on surface | #858194 / #FFFFFF | 3.77:1 | 3:1 |
| dark: text on background | #F6F3FB / #191723 | 16.10:1 | 4.5:1 |
| dark: text-secondary on surface | #C1BBCE / #242131 | 8.43:1 | 4.5:1 |
| dark: on-action on action | #27203E / #BEAEFF | 7.84:1 | 4.5:1 |
| dark: unresolved on unresolved-bg | #D1B1F2 / #372945 | 7.21:1 | 4.5:1 |
| dark: border-control on surface | #8C849D / #242131 | 4.42:1 | 3:1 |

### Typography and financial amounts

**Manrope:** headings, campaign display and wordmark; 700–800 weights. **Inter:** copy, controls, dates and every financial amount; 400, 500 and 600 weights. Both fonts use the SIL Open Font License; the font files and licences are supplied. Google Fonts' Manrope source and Inter's official source are retained in the asset notes. No proprietary Wise/Duolingo typeface is used.

Manrope does **not** contain U+20B5 in the supplied file. Never set a cedi amount in Manrope. Inter contains the cedi glyph and tabular numerals; all amount examples use Inter. Latin-subset TTFs are supplied for the self-contained preview. Full variable TTF/WOFF2 sources are also included where available. Production should subset and serve WOFF2 with next/font/local, retain OFL attribution, and document the resulting language coverage; no runtime font-CDN call is necessary. Fallback: system-ui, -apple-system, Segoe UI, Arial, sans-serif.

| Style | Family / weight | Desktop size / line | Mobile size / line | Tracking |
|---|---|---|---|---|
| Marketing display | Manrope 800 | 56 / 60 px on web; campaign sizes depend on fixed canvas | 40 / 44 px web | -0.045 em |
| Page title | Manrope 800 | 32 / 40 px | 27 / 34 px | -0.035 em |
| Composer headline | Manrope 800 | 29–34 / 37–43 px | 28 / 35 px | -0.035 em |
| Section title | Manrope 700–800 | 20 / 28 px | 18–20 / 25–28 px | -0.02 em |
| Large amount | Inter 600 | 40 / 48 px | 37 / 46 px | -0.03 em |
| Body | Inter 400 | 16 / 24 px forms; 14 / 22 px compact dashboard | 16 / 26 px editable text; 14 / 22 px supporting copy | 0 |
| Control label | Inter 500–600 | 13–14 / 20 px | 13–14 / 20 px | 0 |
| Metadata | Inter 400–500 | 12 / 18 px; 11 only for non-essential dense metadata | 12 / 18 px; 11 only for supplementary dates | 0 |

Actual controls remain at least 44 px; a compact type size is not permission to make the hit area small. At 320 px, descriptions wrap and primary actions span the available width. Financial meaning must never depend on the smallest metadata text.

Amounts use `font-variant-numeric: tabular-nums lining-nums`. Align ledger amounts to the right; keep currency and amount together. Use GH₵900.00 on ledger rows, GH₵5,970.00 for a total, and a true minus sign for outflows: −GH₵700.00. Transfers are labelled explicitly and are not prefixed with an expense minus at workspace level. For multiple currencies, use separate totals and explicit currency codes; do not aggregate without a disclosed rate, date and method. Long names wrap; ledger amounts do not truncate. A very large amount reduces its display style once or uses a full-width amount line, never unreadable tiny digits. Missing opening balances display “Unknown”, not GH₵0.00.

### Shape, icons, depth and supporting assets

Use Lucide icons from the supplied licensed family, 20–24 px canvas, 1.75 px stroke, round caps and joins. Financial navigation icons have text labels. Decorative speech shapes are not controls. No emoji, sparkle icon or oversized trophy substitutes for a financial status.

Spacing is a 4 px scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. Radii: 8 px small; 12 px controls; 20 px working surfaces; 24 px heroes/dialogs; 999 px only for pills and circular elements. Do not put every paragraph in a bordered box. Group most rows with alignment and a subtle divider. Use surfaces when there is a distinct task or context.

Depth: `0 1px 2px rgba(41,38,61,.04)` for subtle selected controls; `0 24px 80px rgba(41,38,61,.22)` for overlays. No glassmorphism, glowing gradients or stacked faux-finance cards in the product. Marketing may rotate a source quote by 3–4 degrees and a device specimen by 5–6 degrees; reading and editing surfaces remain level.

Photography is editorial and recognisably ordinary: people recording a day's work in real-feeling spaces, natural light, useful objects. The supplied studio image is an AI-generated fictional model, not a user, testimonial or proof of results. The interface carries meaning without that image. There are no required photography downloads on low-data product screens.

The provided identity board and standalone screen exports are visual evidence of the proposed design. They are not production screenshots or tested conformance evidence.

## 6 Information architecture and core journeys

### Navigation and contextual action

Mobile navigation has Today, Records, Stories and Plan. Desktop uses Today, Records, Money Stories and Plan. The conceptual structure remains Record → Understand → Plan; the ledger and reports do not require a conversation to open.

Desktop has a 224 px sidebar, 76 px top bar, 36 px gutters and a maximum 1180 px content width. At 1150 px the sidebar becomes 200 px and gutters 28 px. At 760 px and below, use a 68 px header and 72 px bottom navigation with 20 px gutters (16 px at 320 px). A 960 px breakpoint reflows the main/secondary content. At any width, forms and tables retain useful reading order and visible controls.

Accounts is a direct desktop navigation item. On mobile, the workspace/avatar control opens workspace choices plus Manage accounts and Settings and privacy. The current workspace and currency are stated in chrome or the current task. Recorded accounts are labelled manually tracked, with declared openings and explanatory detail. No pay, top-up or wallet controls appear.

Home has one contextual primary action. A new user gets a useful narration example. An unresolved draft takes priority over a new capture. A ready batch points to review. A reviewed day makes another story possible and offers the Money Story. A returning user can catch up from the relevant date. Balance and secondary content do not obscure capture; mobile places detailed in/out figures in the subsequent story.

| Home condition | Headline and primary action | Supporting context |
|---|---|---|
| New user | “What happened with your money today?” → Tell your story | Try an example; optional setup; no invented totals. |
| Unresolved draft | “Just one detail.” → Answer the question | The specific source phrase and consequence. |
| Ready batch | “Your story, organised.” → Review / Save records | Draft counts and calculated movement; not saved yet. |
| Reviewed day | “What happened with your money today?” → Tell another story | Confirmed records and a traceable Money Story. |
| Catch-up | “Start with the day you remember.” → Choose date / tell story | No reset, penalty or completeness assumption. |

### Journey 1 First use and a first useful story

**Intent:** understand the product before configuring a system. Open with the fixed tagline, “Turn everyday money stories into records you can understand”, and **Try an example** / **Start my records**. The example is a clearly fictional, locally processed demonstration, without sign-in or real-data transmission. It shows the Ama Works narration and its eight review rows.

For real financial data, show a short processing/privacy explanation and require account creation/sign-in **before sending narration to a server or AI provider**. Choose Personal or Business, name the workspace, confirm GHS and timezone. Create one manually tracked account when first needed. Opening balance can be “I don't know yet”. Do not demand contact details, bank credentials, goals, categories, or microphone permission.

Narrate → resolve necessary ambiguity → review → Save all → “Saved 8 records” → today's traceable meaning. Authentication may be completed before capture or as a clearly explained step before real-data processing, preserving a local draft with explicit device-storage permission. Permission to try an example is not permission to upload real finances.

**Skip:** logo tutorial, full account setup, opening balances, reminders, goal. **Control:** visible workspace/currency, privacy detail, local draft handling. No automatic consent to marketing.

### Journey 2 Text with several events

**Intent:** record a day once. Tap Tell CashNarra. The page shows workspace, event date, “What happened with your money?”, a 160px-minimum textarea, and **Understand my story**. Use the shared narration in section 7. Autosave typed text locally only under the chosen device-storage setting; say “Draft on this device”.

After processing, show source text beside/above the extracted rows. Separate the sale's cash, MoMo, and credit parts, with one linked sale group. Treat the bank-to-MoMo movement as one transfer record. Link Abena's payment to her existing obligation.

**Skip:** optional category refinement and note. **Control:** edit date/account, change the narration, discard the draft, review all interpretations. Never insert missing numbers.

### Journey 3 Short voice and transcript

**Intent:** avoid typing. This is the first follow-on capability after stable text. Tap **Record a voice story**. Explain “Your microphone is used only while recording. We send the recording for transcription when you choose Use recording.” Then request OS/browser access at that moment.

Tap to start/stop; no hold-only interaction. Show “Recording”, elapsed time, Stop, and Cancel. Initial limit: 60 seconds, with a gentle warning at 50 seconds; retain the captured clip if the limit is reached. Cap upload at 3 MB, following the stack recommendation. Validate actual media formats, byte limits, and target-device support before enabling. Do not imply offline transcription.

Playback → **Use recording** → “Transcribing” → editable transcript with money amounts and names easy to find → **Understand transcript** → ordinary review. If transcription fails, keep the clip and offer Retry or Type instead. On unsupported browsers offer text immediately.

**Skip:** voice entirely; transcript must remain reviewable before interpretation. **Control:** Cancel discards only after confirmation if a clip exists; no background listening, auto-upload, auto-send, or payment PIN request.

### Journey 4 Clarification and batch save

**Intent:** fix the detail that would change totals. For an ambiguous version of the sample, ask: “Does the GH₵2,400.00 sales total include Kojo's GH₵300.00?” Options: **Included in the total**, **Additional to the total**, **I'm not sure**. Explain “This changes the sales total and the amount received.”

The canonical dataset uses Included. An unanswered important question leaves the relevant linked group in Needs clarification. “Answer later” retains the draft. Once ready, show all eight rows, date/workspace, net movement, excluded transfer, and **Save all 8 records**. The count is financial records, not transfer legs or AI messages.

First release uses an atomic batch: all eight save or none save. If future partial-batch saving is offered, explicitly select independent ready records and preserve every unsaved item; do not sever a credit sale or its linked settlement. During saving lock the submitted revision and keep the source. On an uncertain response use the recovery state in section 8.

**Skip:** an optional category, but not an unknown amount, account needed for balance, currency, meaningful ownership, or debt linkage. **Control:** change any row, return to source, discard, or leave for later.

### Journey 5 Correction split move or removal

**Intent:** repair an error without recreating the day. Open a row or say “That GH₵80 delivery was GH₵100.” Show the matching record and a before/after preview. If several records match, ask which one. Preview: Delivery 80 → 100; MoMo recorded balance 3,020 → 3,000; Money out 930 → 950. **Apply correction** then authoritative confirmation.

Splitting the GH₵700 stock purchase into GH₵600 stock and GH₵100 packaging preserves total cash out. Preview all children and retain the original source/group. Removing a saved duplicate uses **Remove from records**, a reason, affected totals, and a recoverable correction history. Do not erase audit history or silently remove a debt's settlement.

Moving between workspaces requires permission and an account in the destination. If business money funded personal activity, simply changing workspace would distort the business balance: explain the issue and propose the appropriate linked owner/inter-workspace records for review. The underlying financial engine decides the valid structure; the UI never changes an account's owner by relabelling it.

**Skip:** optional correction note, except a required internal reason code can default to “Entered incorrectly”. **Control:** explicit affected records, refreshed totals, undo through a new valid correction. These are alternative previews; the guide's canonical dataset remains unchanged.

### Journey 6 Partial or full debt settlement

**Intent:** update money owed. Records → **People owe me** → Abena. Show original balance GH₵600.00, prior payments, remaining GH₵600.00 before the day's payment, and **Record payment received**. Never label the button Pay or Collect.

Enter amount 200, receiving account MoMo, date 13 Oct, and optional note. Or say “Abena paid 200 into MoMo.” Preview “Remaining balance GH₵400.00. This is a payment of an existing balance, not a new sale.” Save settlement; link it to the original obligation.

Full settlement defaults to the current outstanding amount, still reviewable. A later payment of 400 would settle Abena fully; it is a separate future event, not part of today's canonical totals. Overpayment prompts for credit/refund/other meaning. Unknown loan interest or fees require separating principal and cost rather than guessing.

**Skip:** contact phone number, reminders, invoice generation. **Control:** correct debt identity, amount/date/account; no automatic debtor message or external payment.

### Journey 7 Period and Money Story

**Intent:** understand a day, week, or month. Stories → choose Day/Week/Month and period → read a two-sentence summary before a chart. The 13 Oct story says “GH₵2,300.00 came in and GH₵930.00 went out in your saved records. GH₵700.00 remains owed to you.”

Open the receipt total to see cash/MoMo sales plus Abena settlement; the detail explains why recorded sales value is 2,400. Open “What changed” only when comparable periods exist. A partial week ending 13 Oct must say “Recorded so far”, not a complete weekly report.

**Skip:** charts, export, check-in. **Control:** filter context, explicit period boundary, records/exclusions, separate review action “I've reviewed this period's recorded activity.” That action does not verify a bank balance or guarantee completeness.

### Journey 8 Optional goal and forecast

**Intent:** see a possible route to equipment. Plan → **Add a goal** → “What are you working toward?” → New equipment; target GH₵6,000.00; date optional; assigned so far GH₵1,200.00 linked to Bank. Explain “This marks money for your goal in CashNarra. It does not move or protect money.”

Show 20% assigned. The recent goal-allocation pace is GH₵400.00/month from July–September; remaining 4,800; about 12 monthly contributions, around September 2027. The full explanation is in section 8. Users with no contribution history get a planning scenario based on an entered pace, never a data-based forecast.

**Skip:** date, goal, pace scenario. **Control:** link allocations to actual tracked funds, avoid assigning the same money twice, let the user pause/archive or revise a goal. Do not automatically allocate all apparent cash surplus.

### Journey 9 What if

**Intent:** inspect a possible change without changing reality. Goal → **Explore what if** → “Scenario only” label remains visible. Enter an extra monthly allocation of 200. The scenario uses 600/month: eight contributions, around May 2027.

Side-by-side Current pace and Scenario panels show remaining target, monthly amount, timing, and assumptions. Button **Save scenario** saves an assumption set only; separate **Change my goal plan** requires a preview and never posts financial records. Reset restores the previous assumptions.

**Skip:** scenario entirely. **Control:** no changes to ledger, balances, allocations, debts, or reminders from experimenting. First follow-on supports amount/date changes; sales-growth, interest, inflation, seasonality, and competing-goal simulation need later validated models.

### Journey 10 Offline and safe recovery

**Intent:** retain work during a connection problem. Text capture works locally after the application has been loaded and device draft storage is enabled. Show “On this device. Waiting for a connection.” Allow edit, copy text, or delete. Do not include it in totals.

Reconnect → verify authenticated user/workspace → process the same draft → clarify/review → user-authorised save. An offline draft is not silently posted on reconnection. If saving lost its response, look up the original save request before retrying; see section 8. If a record changed elsewhere, show a conflict preview and preserve both proposed revision and latest authoritative version.

**Skip:** automatic processing; allow “Process later”. **Control:** logout with a draft offers stay or sign out and erase/copy it; drafts must not appear in another user's session. Explain that clearing browser data or losing the device can remove local drafts. Device storage failure must show “Could not keep this draft on this device” and offer copying text. Do not promise durable storage before it succeeds.

## 7 Screen specifications and component library

### One coherent fictional dataset

**Ama Works**, business workspace, GHS, Ghana timezone, Tuesday **13 October 2026**. Start-of-day declared balances: Cash GH₵400.00, MoMo GH₵1,200.00, Bank GH₵3,000.00. Opening receivable: Abena owes GH₵600.00 from 8 Oct. Opening obligations: Adjei Packaging payable GH₵500.00 and business-loan principal GH₵1,000.00. These opening obligations are not new sales or receipts on 13 Oct. The illustrative loan has a declared interest-free GH₵100.00 monthly repayment, next due 31 Oct 2026. The supplier GH₵500.00 is also declared due 31 Oct. These commitments must be considered; the goal pace below is a conditional contribution estimate, not confirmation of affordability.

**Shared narration:** “Today I sold GH₵2,400: GH₵900 cash, GH₵1,200 MoMo, and Kojo still owes GH₵300. I bought GH₵700 of stock with cash, paid GH₵80 delivery from MoMo, moved GH₵500 from bank to MoMo, Abena paid GH₵200 of what she owed into MoMo, and I took GH₵150 cash home.”

| Record | Meaning | Cash change | MoMo change | Bank change |
|---|---|---:|---:|---:|
| CN-101 Cash sales | Part of sale group CN-S1 | +900.00 | — | — |
| CN-102 MoMo sales | Part of sale group CN-S1 | — | +1,200.00 | — |
| CN-103 Kojo credit sale | CN-S1; new receivable 300.00 | — | — | — |
| CN-104 Stock purchase | Cash out; not automatically a profit expense | -700.00 | — | — |
| CN-105 Delivery | Recorded operating expense | — | -80.00 | — |
| CN-106 Bank → MoMo | Internal transfer; one record, two account legs | — | +500.00 | -500.00 |
| CN-107 Abena part payment | Reduces existing receivable 600 → 400 | — | +200.00 | — |
| CN-108 Owner money taken | Owner withdrawal; not business expense | -150.00 | — | — |

Money in **2,300.00** = 900 + 1,200 + 200. Money out **930.00** = 700 + 80 + 150. Recorded net movement **+1,370.00**. The internal transfer **500.00** is excluded from workspace movement totals. Sales value **2,400.00** includes Kojo's 300 and excludes Abena's old-balance payment. People owe **700.00** = Abena 400 + Kojo 300. User owes **1,500.00** = supplier 500 + loan principal 1,000.

Closing recorded balances: Cash **450.00**; MoMo **3,020.00**; Bank **2,500.00**; total **5,970.00**. Start 4,600 + net movement 1,370 = 5,970. These are recorded balances based on declared openings, not externally verified funds. Business profit is unavailable because inventory consumed, cost of sales, and other necessary accounting information are missing.

Goal **New equipment**: target 6,000; assigned 1,200 from Bank; 20%. Recorded allocations July 300, August 400, September 500 produce median monthly pace 400. These allocation entries did not reduce account balances or appear as spending. No October allocation has yet been recorded; October is not treated as a closed zero month.


### Layout contract

Desktop: 224 px sidebar, 76 px top bar, 36 px content gutters, 1180 px maximum content width. At 1150 px the sidebar is 200 px and gutters are 28 px. Today uses a flexible primary column and 284–320 px secondary column. At 960 px the primary/secondary relationship reflows. At 760 px, replace the sidebar with a 68 px mobile header and 72 px bottom navigation; use 20 px side gutters, 16 px at 320 px. Never horizontally scroll the whole page.

Mobile Today shows the total recorded balance and composer first; the in/out pair belongs in the subsequent Money Story. Do not force redundant metrics above the primary capture action. The narration button must remain visible in the first 844 px view at 390 px width. On other devices verify the actual safe area and dynamic type size. Long record/review screens scroll naturally. Bottom navigation must not obscure focus or a final save action.

First-use product state prioritises a first narration, with optional opening balances deferred until needed. Unresolved state replaces the normal capture action with “Finish your draft”. A reviewed day offers a new story and the recap. Catch-up offers the last relevant date, not an accusation. The demo shows an established reviewed day; these variants remain production acceptance states.

### Essential screens

| Screen | Hierarchy and primary action | Copy and interaction | Layout and reuse |
|---|---|---|---|
| Onboarding | One workspace name, personal/business choice, currency, first story | “Make room for clarity.” → “Try your first money story”. Before real storage: sign-in and brief privacy information. Permissions at point of use. | Desktop speech artwork beside form; mobile stacks a compact introduction above form. Primary work is never a carousel of feature claims. |
| Today | Greeting; recorded total; inviting composer; records; Story; rhythm; goal | “What happened with your money today?” → “Tell your story”. Record and account context are explicit. | Flexible desktop split; mobile retains the next action before secondary summaries. Reuse Composer, RecordRow, StoryPreview. |
| Narration | Date/workspace, editable words, understand action | “Tell it as it happened.” The example can be skipped. No categories before extraction. | Maximum 760 px reading width. 16 px textarea, 205 px desktop / 250 px mobile minimum in the specimen. |
| Voice | Short recording, elapsed time, pause/stop, editable transcript | “Say it in your own words.” Text alternative always available. Permission denied does not block recording by text. | Future interaction preview. No microphone access in the supplied demo. Launch only after representative transcription tests. |
| Clarification | Relevant quoted sentence; one material question; choices | “Which account paid for delivery?” Cash / MoMo / Bank. Confirm only what changes posting or meaning. | Three native choices, min 104 px tall for these account choices; stack if translations or zoom need it. SourceQuote and AccountChoice. |
| Batch review | Draft count; in/out; aligned record rows; source; save batch | “Your story, organised.” Pencil edits a draft; transfer and settlement meanings stay explicit. “Not saved yet” until authoritative completion. | Dense rows, not eight nested cards. Full-width mobile save, keyboardable row actions. Reuse RecordRow and BatchSummary. |
| Save result | Confirmation; useful meaning; correction path | “A clearer picture of today.” → “Read today’s Money Story”. Production uses confirmed ledger status; demo says saved in the demo session. | Quiet check mark. No confetti around loans, withdrawals or bad news. |
| Records | Search and movement filters; dated rows; amounts; export | Search by person, amount or description. “Every story has a paper trail.” | Desktop has a separate movement column; mobile integrates movement in row metadata. Search and filters stay visible without hover. |
| Record detail | Amount and meaning; date/account/workspace; source; change history | Abena part payment: “This payment reduces Abena’s old balance. It is not counted as a new sale.” | Two columns on desktop; stack on mobile. Edit, settlement and removal need review of affected totals. |
| Accounts/workspaces | Recorded total; Cash/Bank/MoMo; declared openings; workspace switch | “Keep Cash, Bank and MoMo in one recorded picture.” Unknown opening amount remains unknown. | Three account surfaces desktop; compact stacked surfaces mobile. No wallet, payout or provider-connected visual cues. |
| Money Story | Period; short editorial summary; explained comparisons; debts; assumptions | “GH₵2,300.00 came in. Here’s the story.” Links expose underlying records. | Ink hero, numbered chapters, directly labelled bars and text alternatives. More reading width than the capture view. |
| Plan | Named goal; assigned amount; target; progress; conditional pace | “Give your story a direction.” “About 12 monthly contributions.” | Goal surface and assumptions column desktop; stack mobile. Allocation is not a transfer. |
| What-if | Scenario badge; assumed extra contribution; estimate; unchanged actuals | “What if you assigned a little more?” Slider and an equivalent numeric input in production. | The demo slider updates pace and month immediately; no actual records change. Make the scenario state unmistakable. |
| Settings/privacy | Display controls; reminder controls; export; recordings; deletion/retention | “Make it work for you.” “Hide amounts” has an immediate local effect. | Compact section navigation, native switches, explanatory text. Deletion and sharing need explicit consequence review. |
| Offline/recovery | Local-capture status; preserved text; resume/retry/copy | “Keep your story. Finish when you’re online.” No “Saved” status on a pending narration. | The supplied screen simulates reconnection. IndexedDB, quota failure and idempotent retries remain implementation requirements. |

### Manageable component library

| Component | Dimensions / typography | States and required behaviour |
|---|---|---|
| AppNavigation | 48 px desktop rows, 72 px mobile bar; labels 13–14 / 20 px desktop | Current page uses background/weight/icon and aria-current. Keyboard focus remains visible. Long translated labels reflow. |
| Button | 44 px minimum target; primary flow actions 48 px mobile; radius 12 | Default, hover, pressed, focus, disabled with reason, busy with status. One primary action per local task. |
| IconButton | 44 × 44 effective target, 20 px icon | Accessible name, focus, hover and pressed. Review-pencil visuals may be smaller but effective target still meets standards and spacing rules. |
| TextInput / Textarea | 48 px single-line field, 16 px editable text, control border | Label, hint, entered value, error adjacent to field, error summary for forms. Preserve user text through failure. |
| Composer | Radius 24/20, padding 28/23 px desktop/mobile, heading 29/28 | New, example, pending local draft, processing, failure, continuation. Voice is a secondary affordance. |
| SourceQuote | 16 px radius, 22–24 px padding, Inter 500 at 18–19 px | Spoken/typed origin, selected phrase, changed interpretation; source remains a record of what the user said. |
| AccountChoice | Border 1 px, selected 2 px; min 104 px in this screen | Native button/radio semantics, selected text/border, disabled if unavailable. Choice isn't posted until batch review/save. |
| RecordRow | 74–80 px comfortable row, 34–40 px icon, 12–14 px label/amount | Draft, confirmed, corrected, possible duplicate, removed from totals. Right-aligned tabular numbers. Touch edit actions need distinct hit areas. |
| BatchSummary | Aligned 3-part summary, no decorative cards | Counts and money movement from deterministic draft calculations; transfer exclusion explicit. Recompute after edits. |
| SegmentedFilter | 4 px container padding, 40–44 px mobile segments | aria-pressed; query state visible; searchable empty state; no fake loading if local filtering is instant. |
| AccountCard | 20 px radius, 24 px padding | Declared known/unknown balance, negative balance, corrected opening, archived account. No independent-verification claim. |
| StatusBadge | Radius 6, text 11–12 px, not interactive | Text plus colour: draft, unresolved, confirmed, scenario, changed. Never display an unexplained confidence percentage. |
| Progress | 7 px compact / 12 px goal track; textual percent and target | Goal allocation progress is distinct from check-ins, reviews and reconciliation. Screen-reader min/max/current. |
| Rhythm | Seven small check-in markers with dates, explicit summary | Checked-in, not checked-in, rest day. No losing accumulated history after a missed day. Does not certify completeness. |
| StoryPreview / Chart | Ink panel only for the editorial preview; appropriate direct labels | Labelled units, categories, zero baseline; negative/missing data treatment; accessible text/table alternative. |
| Notice | Radius 12, 14–16 px padding, 18 px icon | Informational, unresolved, warning, error, success. Match aria-live to urgency; never announce every input/animation frame. |
| Dialog | Radius 24, max 500 px, 24–28 px padding | Initial focus, trap while modal, Escape, labelled close, return focus, error recovery. Prevent accidental dismissal of destructive intent. |
| Feedback | Toast radius 12, message 13 px, 160 ms control transition | Outcome announced once; persistent copy when recovery is required. Toast alone isn't enough for a save failure. |

**Honest empty/loading states:** no records is “No records yet”, not “You spent nothing”. A spinner does not imply posting succeeded. Skeletons approximate real content geometry but never show invented balances. For a failed narration keep the words, offer retry or manual record; for a failed save keep the reviewed batch and its unique posting key. Every important total opens a record set and assumptions.

**Prototype controls versus production:** filters, CSV export, record edits, a partial settlement, theme and hidden amounts work locally in the demo. Voice, onboarding/authentication, account creation, goal creation/allocation, weekly/monthly reports and offline persistence include explanatory or visual previews. They are not implemented production capabilities. The README lists this boundary so it does not need to dominate product copy.

## 8 Financial meaning AI states and data visualisation

### Capture and save state contract

| Internal state | User-visible copy | Meaning and next action |
|---|---|---|
| captured-local | “Draft on this device” | Device storage succeeded. Not a server record; excluded from all official totals. Edit, copy, process, or remove. |
| waiting-processing | “Waiting to understand your story” | Awaiting connection or processing capacity. Keep source and allow cancellation. |
| draft-understood | “Here's what CashNarra understood” | Structured proposal exists. No confirmed ledger effect. Show source and proposed fields. |
| needs-clarification | “One detail needs your help” | Financial meaning is unresolved. Ask the exact question; Answer later preserves the draft. |
| ready-review | “8 records ready to review” | Important required fields validated. Show batch and Save all 8 records. |
| saving | “Saving your reviewed records…” | Submit a fixed batch revision with a unique retry key. Prevent double submission. |
| saved | “Saved 8 records” | Authoritative save receipt contains record IDs/version and save time. Totals may now update. |

The understood state and ready-review state can be consecutive without extra clicks; the labels still represent different facts. Necessary transitions must never be replaced by an optimistic success animation. A processing result can include both ready and unresolved groups; the batch summary states both counts.

| Exception | Required experience |
|---|---|
| Microphone denied | “Microphone access is off. You can type your story.” Type instead is primary. Settings help is secondary; no repeat prompt loop. |
| Processing fails | “We couldn't understand this story yet. Your draft is still here.” Retry, edit, or use a simple manual record form. Server processing must not overwrite an edited local revision. |
| Offline during processing | Preserve narration and clip if retained; say “Waiting for a connection”. Expose whether any upload had already completed. |
| Connection drops during save | “Checking whether your records were saved.” Query the same save-request ID. If still unknown: “Save not confirmed yet. Keep this draft.” Do not show a fresh blind Save action or duplicate the posting. |
| Save validation fails | Show exact field/group problems and preserve every row. An atomic batch has no partially confirmed totals. |
| Possible duplicate | Show both date, amount, account, source, and identifiers. “This may already be recorded.” Review existing / Keep this new record / Discard this draft. An equal amount is not proof of duplication. |
| Earlier record changed | “This record changed since you opened it.” Show latest authoritative values and the proposed correction; require renewed review. |
| Recovered save | “These 8 records were already saved.” Open the saved batch; remove its draft only after resolving the matching save receipt. |
| Authoritative deletion/correction | Update all affected views from the new ledger version. Older exported stories remain historical snapshots, explicitly dated. |

The financial server enforces authorisation, exact arithmetic, valid transfer legs, linked obligations, atomic batches, revision checks, and retry protection. AI may propose typed operations; it does not write balances or supply official totals. These are framework-neutral requirements, not a newly approved architecture.

### Meaning that labels must preserve

| Distinction | CashNarra treatment |
|---|---|
| Draft / confirmed | Draft is proposed and excluded from confirmed totals. Confirmed means the user-reviewed record was saved, not that the underlying external event was independently verified. |
| Received / revenue | Today's receipts 2,300 include Abena's 200 settlement; sales value 2,400 includes Kojo's 300 credit sale. Neither is interchangeable with the other. |
| Cash outflow / expense | Today's 930 outflow includes stock 700 and owner withdrawal 150. Only the 80 delivery is identified here as an operating expense. Stock consumed/cost-of-sales information is missing. |
| Transfer / spending | Bank → MoMo 500 changes account balances but not workspace money in/out, revenue, or expense. Fees, if stated, are separate records. |
| Recorded / declared / externally verified balance | Recorded = declared opening plus recorded account movements. Declared = user's dated statement/count. Externally verified requires evidence and a defined future verification process. Launch never displays that label. |
| Check-in / review / reconciliation | Check-in is a deliberate user engagement. Review means checking listed records. Reconciliation means matching defined records against independent account evidence; manual review cannot substitute for it. |
| Assigned goal amount / money moved | Allocation earmarks recorded funds without a payment or expense. A real transfer must be narrated and saved separately. |
| Scenario / financial result | A scenario changes assumptions, not records. A forecast is an extrapolation under those assumptions, not a guaranteed result. |
| Unknown / zero | Unknown balances and unrecorded periods remain unknown. Zero requires an explicit value or a user-confirmed no-activity period for the relevant context. |

**Traceable number contract:** title, currency, workspace, date range/timezone, ledger version, included record IDs, excluded types, formula, and quality limitations. Tapping Money in reveals the 900/1,200/200 receipts; tapping Money out reveals 700/80/150; transfer exclusion is visible. A balance reveals declared opening and account movements. A changed estimate reveals the old/new inputs and calculation versions. Do not invent a “confidence 96%” badge or a profit figure.

Review coverage uses literal counts: “8 of 8 saved records reviewed”; “2 days marked no activity”; “1 draft needs clarification”; “No account evidence matched”. It is not “October 94% complete”. If a day has no records, say “No activity recorded”; only a user declaration permits “You marked no money activity”.

### Goal calculations and explanation

Launch supports fixed-amount savings/purchase goals, expressed as **assigned money**. It does not recommend securities, presume investment returns, infer debt interest, or project business profit from cash movements. A purchase's future price is not constant by fact: ask the user to update its target periodically, without pretending to forecast inflation.

**Initial pacing rule, a design hypothesis:** use the median of allocations recorded for the goal in the last three completed calendar months. A month is usable only if its allocations have been reviewed or the user explicitly confirmed no allocation. An absent month is not zero. Require known target, known assigned amount, consistent currency, no unresolved or duplicate goal allocations, and reviewed known commitments. If material debt commitments are unknown, withhold a useful completion period and offer only an explicitly assumed contribution scenario, following the stack guide. The three-month gate is a product starting rule to validate, not a research-established threshold for accuracy.

In the sample, July 300, August 400, September 500 yield 400/month. Remaining target is 4,800. Divide that by 400 and round up: **12 monthly contributions**. The first assumed future contribution is at the end of October 2026; the twelfth is September 2027. Display “About 12 monthly contributions — around September 2027”, not an exact day.

An extra 200/month creates a scenario of 600/month, eight contributions, around May 2027. To reach a user-selected date at the end of March 2027 requires six remaining monthly contributions of 800, 400 above recent pace. Describe the gap without implying it is affordable.

If showing alternatives at 300 and 500/month, they imply 16 and 10 contributions: around January 2028 and July 2027. Call this **“Timing under different contribution assumptions”**, not a probability interval or a forecast confidence range. There is no statistical coverage claim.

The **Why this estimate** panel must say:

- “Based on goal allocations you recorded for July–September 2026.”
- “Recent pace: GH₵400.00 a month. Assigned so far: GH₵1,200.00. Remaining: GH₵4,800.00.”
- “Assumes monthly contributions continue, starting at the end of October.”
- “Assumes no withdrawals from this goal and an unchanged GH₵6,000.00 target.”
- “No interest, investment return, fees, inflation, or future price change is included.”
- “These allocations are manually recorded. Money has not been moved or independently verified.”
- “The business has declared a GH₵100.00 monthly loan repayment and a GH₵500.00 supplier balance due 31 Oct. This arithmetic estimate does not establish that future contributions remain affordable.”

Never infer “sustainable surplus” from record counts. If future cash-flow-based pacing is introduced, it must account for opening positions, obligations, owner movements, extraordinary receipts, incomplete periods, competing goals, and seasonal history. Explain why that model differs from allocation pace.

**Insufficient data:** “I cannot estimate a useful date yet. You can add earlier goal allocations or try a monthly amount as a scenario.” If recent pace is zero/negative, “Your recent allocations do not support a completion estimate.” If the target is reached, say “Your recorded allocations meet this target”; do not imply funds are protected or available.

**Changes:** a corrected goal allocation, withdrawal, target, or model update triggers a new estimate with a reason. “The estimate changed because your last three recorded monthly allocations now average…” is invalid when the model uses a median. Say “Your recent median allocation pace changed from X to Y.” Hide no change behind a generic AI explanation.

Multiple goals must not reuse the same funds. A shared allocation pool checks assigned total against the applicable recorded balance when known. Unknown balances make assignments provisional and clearly labelled. Do not automatically spread every month's recorded net movement over all goals. User priorities govern allocation choices.

### Charts

| Question | Chart | Requirements and accessible alternative |
|---|---|---|
| Where did recorded outflow go? | Sorted horizontal bars | Stock 700, owner withdrawal 150, delivery 80; zero baseline, GHS axis, direct labels. Title says outflow, not expenses. Table has type, amount, and share. |
| What came in and went out over time? | Grouped bars by day/week/month | Blue received, rust outflow, equal units and periods; internal transfers excluded. Missing days use a gap labelled “Not recorded”, never an implied zero. |
| How did a recorded balance change? | Line with dated markers | Known declared opening and movements required. Gaps break the line; no invented interpolation across unknown openings. |
| What remains for a goal? | Simple progress meter | “1,200 assigned of 6,000”; 20%; progress is assigned funds, not probability of success. |
| How do assumptions change timing? | Two/three labelled pace panels; later small lines | Show current versus scenario, pace and timing in text first. Future lines are dashed with an explicit boundary from actual allocations. |

Never use 3D charts, truncated bar axes, pies with many small slices, decorative sparklines implying a known trend, or a gauge labelled financial health. Signed net movements use a visible zero reference and direct minus labels. Credit sales and obligations use their own labels instead of being inserted into cash-movement bars.

Charts need textual summaries, persistent labels, currency/period, a legend plus pattern or direct name cues, and a full accessible data table. Hover is an optional enhancement; tap, focus, and the table provide the same values. Treat all calculation of chart proportions as deterministic. Prefer small SVG/CSS charts over a heavy chart dependency unless the approved stack later justifies one.

## 9 Voice UX writing and reusable content

Write in plain international English with Ghanaian terms where helpful. Target short sentences, familiar words, and roughly lower-secondary reading complexity; test actual comprehension rather than claiming a scored reading level. Usually one idea per sentence, no hidden caveat after a reassuring headline.

Use sentence case in UI. **Money Story** names the report feature; **Today, Records, Stories, Plan** name navigation. Use **MoMo** after first explaining “Mobile money (MoMo)”. “Cedis”, “cash”, “bank”, “stock”, and “delivery” are natural input terms. Do not force pidgin or invented local-language translations. Store dates, names, currencies, plural rules, and messages separately for future localisation; use complete message strings rather than concatenating English fragments. Allow long translated labels and bidirectional layouts later.

Use “CashNarra understood…” for system interpretation. First-person “I cannot estimate a useful date yet” is permissible as a brief conversational response; do not invent an emotionally attached AI personality or address users as rich/poor/savvy/careless.

### Human glossary

| Financial concept | Default user term and explanation |
|---|---|
| Receivable | People owe me — money not yet received. |
| Payable | Money I owe — an outstanding obligation. |
| Settlement | Payment of an existing balance. |
| Owner contribution | My money added to the business. |
| Owner withdrawal | Business money I took for myself. |
| Internal transfer | Money moved between my tracked accounts. |
| Revenue | Sales or earnings for the period; may include unpaid amounts. Use specific “Sales value” in the sample. |
| Receipt | Money received; may include loans or old-balance payments. |
| Expense | A business/personal cost; not every payment or stock purchase. |
| Recorded balance | Opening amount declared by you, adjusted by saved records. |
| Reconciliation | Matching specified records to independent account evidence; a future feature. |
| Allocation | Money marked for a goal; not a payment. |
| Current pace | The stated pattern used to estimate contributions or timing. |
| Scenario | A change in assumptions that leaves actual records unchanged. |

### Ready-to-use copy matrix

| Situation | Avoid | Use |
|---|---|---|
| First narration | “Enter transaction metadata.” | “What happened with your money? You can describe several things at once.” |
| First useful result | “AI magic complete!” | “Here's what CashNarra understood. Check the records before saving.” |
| Important ambiguity | “Confirm receivables treatment.” | “Does the GH₵2,400.00 sales total include Kojo's GH₵300.00?” |
| Unknown account | “Account required.” | “Which account did the GH₵80.00 delivery payment come from?” |
| Batch review | “Confirm each transaction.” | “8 records ready to review. Change anything that needs fixing.” |
| Successful save | “All your books are correct.” | “Saved 8 records. You can open or correct them in Records.” |
| Correction | “Invalid previous input.” | “Change GH₵80.00 to GH₵100.00? This also changes today's MoMo recorded balance.” |
| Possible duplicate | “Duplicate found. Deleted.” | “This may already be recorded. Compare it with the earlier GH₵80.00 delivery record.” |
| Offline capture | “Saved!” | “Draft on this device. We'll understand it when you're connected.” |
| Processing failure | “Something went wrong.” | “We couldn't understand this story yet. Your draft is still here.” |
| Unknown save outcome | “Save failed. Try again.” | “Checking whether your records were saved. Keep this draft until we can confirm.” |
| Missing opening | “Balance GH₵1,820.00.” | “Opening balance not provided. Recorded movement is +GH₵1,820.00.” |
| Incomplete period | “You spent nothing Monday.” | “No activity is recorded for Monday. Add anything you remember, or mark no activity.” |
| Outstanding debt | “Delinquent customer.” | “Abena still owes GH₵400.00 from the balance recorded on 8 Oct.” |
| Debt due date unknown | “Overdue!” | “No due date recorded.” |
| Forecast delay | “You're falling behind.” | “Your recent contribution pace is lower. See why the estimate changed.” |
| Insufficient history | “Confidence 22%.” | “I cannot estimate a useful date yet. Try a monthly amount as a scenario.” |
| No-activity day | “Record something to protect your streak.” | “Nothing happened with money today? You can mark no activity.” |
| Rest day | “You missed a day.” | “You've paused reminders for today. Add a story whenever you need.” |
| Catch-up | “Your streak is broken.” | “Start with the day you remember. You can add earlier activity.” |
| Weekly recap with this partial week | “Your week is complete.” | “Your recorded week so far: GH₵2,300.00 in and GH₵930.00 out. Other days have not been reviewed.” |
| Monthly recap | “October profit: GH₵1,370.00.” | “October records so far show net money movement of +GH₵1,370.00. This is not a profit estimate.” |
| Privacy before processing | “We value your privacy.” | “Your story is sent for processing to organise records. See who processes it and how long it is kept.” |
| Microphone explanation | “Enable all permissions.” | “Allow the microphone to record a short story. You can type instead.” |
| Shared-device masking | “Your data is now secure.” | “Amounts are hidden on this screen. Sign out when you finish on a shared device.” |
| Export | “Certified financial statement.” | “Recorded activity report. Based on information entered and reviewed in CashNarra.” |
| Goal allocation | “Deposit into your goal wallet.” | “Mark GH₵200.00 for this goal. No money will be moved.” |

Service messages identify the operation and next step. Privacy text does not promise training opt-out, zero retention, specific providers, or encryption guarantees until the actual contracts and implementation support the claim.

## 10 Habit motion and notification rules

### A forgiving rhythm

Offer **As things happen**, **Once a day**, **A few times a week**, and **No reminders** after the first useful save. Let users choose days and time. The home indicator is “3 check-ins this week” or “8 records reviewed”, not a streak requiring uninterrupted attendance. It can be hidden.

A check-in requires a deliberate action: narrating, reviewing saved records, reviewing a Money Story, or explicitly marking no activity. Merely opening the app does not count. Counts use the date of engagement; a later catch-up records the financial event on its original date without falsifying the engagement history. A separate date strip shows “Reviewed later” when useful.

Rest/business-closed is a user declaration or chosen schedule, not proof there were no financial events. No-activity is an explicit statement. Neither requires an invented zero-valued transaction. Catch-up never consumes a paid repair token or requires permission from support.

Milestones: first reviewed batch, first reviewed weekly story, first month with reviewed records. The reward is a usable explanation or comparison when enough relevant records exist. Do not artificially lock basic totals or exports until someone earns a badge. Avoid “Reliable user”, “Clarity level 80”, or a record-quality percentage that overstates completeness.

When someone records a loan, loss, overdue balance, or difficult forecast, show neutral Saved feedback. A reviewed weekly story may show one quiet line settling into its final marker. No money-action confetti, coin sounds, competitions, transaction-count quests, borrowing incentives, or public wealth comparisons.

### Motion

Motion is feedback, not a reason to wait. Press feedback 100 ms; colour/control changes 160 ms; panels and progress 220 ms. Easing `cubic-bezier(.2,.8,.2,1)`. The launch prototype uses these control transitions and a static recording specimen; it has no looping decorative animation.

Use source-to-record movement only after data is understood, to explain the relationship. If implemented, a single 220 ms reveal follows a real state change; it never delays typing, confirmation or access to a number. A recording indicator reflects actual microphone state. Processing is labelled, cancellable where safe and visually different from listening.

Reduced motion sets durations to 0 ms, removes waveform movement and scale effects, and keeps text/status updates. Numbers change directly; do not count them up from zero. Optional haptics are short, off by default on web and never the only feedback. No audio by default. Loan/expense/withdrawal recording receives neutral confirmation. Reconciliation or a useful history milestone may get a brief optional acknowledgement; no wealth celebration.

### Notifications

Service reminders, recaps, security messages, and marketing are separate controls. First release can rely on an in-product reminder until external channels are ready. Request push permission only after the user chooses push. Provide equivalent in-app access when permission is denied.

Default reminder proposal: one user-selected reminder on an active day; one optional weekly recap; no escalation for nonresponse. At most one routine push per day, with recaps replacing rather than stacking with that day's reminder. Quiet hours default 21:00–08:00 in the user's chosen timezone. These defaults are hypotheses to test. Security messages use their own appropriate channel.

Lock-screen copy defaults to “Your CashNarra records are ready to review.” No amounts, customer names, debt, or goal dates. Optional detailed previews require deliberate selection. Email subjects are equally discreet. No automatic messages to customers/suppliers. “Record payment received” never triggers a collection reminder.

## 11 Accessibility privacy and applicable compliance

### Accessibility target and verification

**Design target: WCAG 2.2 AA**, including its Level A criteria. This is a product specification, not a claim of tested conformance or a statement that Ghana universally requires this precise standard. W3C publishes the normative criteria and supporting guidance [R11–R18, R32]. An implemented complete process must be tested; an individual accessible component or contrast CSV cannot certify it.

| Area | Standard or design distinction | CashNarra acceptance behaviour |
|---|---|---|
| Text contrast | SC 1.4.3 AA: 4.5:1 normal text; 3:1 large text [R12] | Tested token pairs; retain contrast for hints, status, and charts. Product generally targets 4.5 even for large amounts. |
| Necessary nontext visuals | SC 1.4.11 AA: 3:1 where needed to identify controls/graphics [R13] | Distinct field borders, chart elements, and focus. Decorative separators are not control boundaries. |
| Keyboard | SC 2.1.1 A, 2.1.2 A, 2.4.3 A [R32] | All capture alternatives, review, filters, correction, export, and scenario controls operate by keyboard; predictable order and no trap. |
| Focus | SC 2.4.7 AA; 2.4.11 AA prevents focus being entirely hidden [R15] | 3px outline and 4px offset; product aims to keep focused controls fully visible, including above keyboard/sticky bars. SC 2.4.13 Focus Appearance is AAA. |
| Touch | SC 2.5.8 AA has a 24×24 CSS px minimum subject to exceptions [R14] | Product uses 44×44px minimum interaction targets, 48px primary mobile flow actions, and 8px gaps. Do not misstate the product target as the AA legal minimum. |
| Reflow and resizing | SC 1.4.4 AA, 1.4.10 AA [R17, R32] | 200% text resize; 320 CSS px/400% zoom single-column reflow. Table alternative for complex visualisations; important controls never clipped. |
| User text spacing | SC 1.4.12 AA [R32] | Increased line/paragraph/word/letter spacing does not truncate rows, badges, or amounts. |
| Colour and reading order | SC 1.4.1 A, 1.3.1/1.3.2 A [R32] | Literal type/status labels, signs and shape cues, semantic headings, tables and relationships. |
| Screen reader status | SC 4.1.2 A and 4.1.3 AA [R18] | Accessible names/roles; polite status changes; error-summary focus; no ticking-timer noise; consistent Saved announcement after receipt. |
| Financial/data error prevention | SC 3.3.4 AA [R11] | Review before saving and consequential changes; recoverable corrections; cancellation; explicit delete/export consequences. |
| Authentication | SC 3.3.8 AA [R16] | Permit password managers, paste and autofill; no memory puzzles. An email link or code flow needs an accessible same-device path and paste/autofill alternatives; never force manual transcription as the only route. |
| Gestures/audio | SC 2.5.1/2.5.4 A; 2.5.7 AA [R32] | Tap and keyboard alternatives to hold/swipe/drag; text alternative to narration and playback. |
| Motion/help | Pause/stop for applicable auto-motion; consistent help [R11] | Reduce motion; no flashing; help appears consistently; sound is optional; no rushed review timer. |

Test TalkBack with Android Chrome and VoiceOver with iOS Safari; keyboard/NVDA with desktop Chrome or Firefox. Test real zoom, text-spacing overrides, forced colours, reduced motion, and high-brightness viewing. Read “GH₵”, minus values, names, record counts, and chart tables aloud. Preserve focus on corrections. Use headings in exports and a usable text/CSV companion when PDF accessibility has not been established. This guide's PDFs are visual documents, not certified tagged-PDF conformance claims.

### Applicable Ghana obligations and launch decisions

Assumptions: Ghana is the first market; the operating entity provides direct record-keeping SaaS to users; no custody, payment initiation, credit, securities advice, automatic bank/MoMo capture, or tax filing. Company location, customers abroad, regulated-institution customers, actual processor/data locations, VAT status, commercial claims, and new features can change applicability.

| Area and authority | Classification and finding | Design consequence and evidence needed |
|---|---|---|
| Data Protection Act 843 ss 27 and 53 [R22] | Binding registration duties apply to relevant controllers. DPC's current organisation guidance also addresses controllers/processors and renewal [R23]. | Establish roles and registration before live personal-data processing. Publish the real operator and privacy contact; do not decorate the UI with unearned certification badges. |
| Act 843 ss 19–24, 27–33, 39–44 [R22] | Binding rules cover lawful processing, notices, minimisation, retention, security, access/correction, objection and relevant deletion mechanisms. Consent is not the only possible lawful ground. | Provide understandable notices and rights handling. Separate optional consent from required service processing; retain correction and deletion routes. Verify the actual lawful basis and response procedure. |
| Act 843 s 40 [R22] | Direct marketing requires prior written consent; separate from service messaging. | Unchecked, recorded marketing opt-in and easy withdrawal. Reminder choice does not authorise promotion. |
| DPC organisation and DPIA guidance [R23] | Official guidance describes privacy policy, privacy oversight, and impact assessment. Guidance must be distinguished from the exact statutory wording. | Assign a privacy owner, assess narration/AI/voice/local storage risks, and follow current DPC implementation expectations. Do not describe every safeguard as a new statutory approval. |
| Third-party people in business records [R22–R23] | Lawful handling and collection notices can concern customers, suppliers, or relatives who are not app users. Roles differ by processing purpose. | Business users may be controllers of counterparty records and CashNarra a processor; CashNarra controls its own account/service purposes. Map this rather than assuming one role globally. Contract, indirect-collection notice route/exceptions, and rights channel need review. |
| Bank of Ghana PFTSP notice and licence categories [R24–R25] | Binding licensing if an activity falls in scope; applicability to this exact direct SaaS model remains an interpretation question. PFTSP covers relevant critical financial-sector technology services, beyond moving money. | Ask whether the exact service, data use, customers, and partnerships fall within PFTSP or another category. Keep UI factual, with manual accounts and no bank affiliation. Absence of custody is not an exemption opinion. |
| SEC, Act 929 s 109 as explained in its current notice [R26] | Binding licensing for covered market activities, including investment advice. Arithmetic scenarios are the proposed product boundary, not a legal safe harbour. | No securities suggestions, return assumptions, portfolio selection, product referrals, guarantees, or suitability/credit scores. Reassess features and promotional language if the boundary changes. |
| GRA taxpayer record obligations [R27] | Binding taxpayer obligations depend on the person/tax regime. | Exports preserve dates, currency, types, original/current versions, and calculation basis. Do not advertise filing or certified statements. |
| Revenue Administration Act 915 s 27 [R39] | Binding requirements for relevant tax records include maintenance within Ghana and at least six years of retention, with extensions in specified cases. A foreign SaaS region alone does not satisfy this finding. | Confirm the acceptable complete, current Ghana-held record arrangement, responsibility and evidence before live use by affected users. Preserve underlying documents and version history where required; define lawful deletion exceptions. |
| NITA current mandate [R35] | Official material identifies ICT licensing/certification responsibilities. The applicable scheme and exact classification of this SaaS remain unresolved. | Confirm applicability before launch; do not invent an exemption or display an unearned approval. |
| GRA 2024 E-VAT guideline section 13 and L.I.2243 reg.31(2) [R28, R40] | The regulation specifies approval for covered accounting software used by a registered person. Exact applicability to CashNarra and the current framework needs confirmation; the 2024 guideline repeats the rule. | “We do not file tax” is insufficient to dismiss this. Confirm whether intended VAT-registered users can use CashNarra as supplementary records and when software approval is required. |
| GRA current E-VAT / Act 1151 effective 2026 [R29–R31] | Current official material identifies the updated framework. The two PDF texts were not fully extractable in this review. | Obtain current interpretation before positioning as a VAT accounting system. Keep CashNarra reports clearly separate from certified tax invoices or GRA approval. |
| Fonts/icons/assets [R19–R21] | Contractual licence duties apply. Trademark clearance is a separate unresolved issue. | Retain notices; document versions/derivations; use the original proposed mark only after appropriate clearance/refinement. No borrowed brand artwork, testimonials, or unlicensed photos. |

DPC's reviewed current pages continue to identify Act 843. No enacted replacement was established from the official material reviewed; this is not proof no change can occur. Recheck current legislation and guidance before launch. This guide does not automatically import GDPR, FCA Consumer Duty, US banking rules, or a 72-hour GDPR breach deadline. Foreign operations or users require their own applicability assessment.

**Exact unresolved launch questions:** Who is the operating entity and where is it established? Is service exclusively direct to individuals/business owners or also provided to regulated financial institutions? Which providers process which data, in which countries, for how long, under which agreements? Does current GRA software approval apply to the intended use by VAT-registered persons? What does the company legally need to retain, and what must it delete when requested? Those answers affect implementation and public copy, not the selected design direction.

### Privacy controls and processing copy

Do not solicit payment PINs, card numbers, government ID, full account numbers, contacts access, or bank credentials for manual recording. Allow account nicknames and counterparty aliases. Use the minimum necessary source data when asking an AI provider to interpret a story.

Before real-data processing show a short notice with accessible detail: operator identity/contact, purpose, required/optional data, recipients/provider categories, relevant locations, retention, rights/contact route, and consequences of refusal. Real provider names and locations must be inserted after selection; “approved provider” is not a substitute for that information. Logging and analytics exclude raw narration, recordings, amounts, and customer names by default.

The OS microphone permission is separate from the service's lawful-processing basis and retention choices. Show the upload/transcription explanation at Use recording. Never say “on-device transcription” unless true.

**Recommended retention starting policy, pending legal/provider feasibility:** keep no raw voice after an accepted transcript, with technical deletion completed within 24 hours where supported; failed transcription clips expire after 7 days unless retried/removed sooner. Full raw narration defaults to 30 days after confirmation, user-adjustable shorter, consistent with the stack proposal; retain only necessary structured source facts/change history afterwards. UI says “Original text removed under your retention setting” when appropriate. Financial records remain while needed for the user's service and any applicable lawful retention; don't assume all users need identical tax retention. Provider copies and backups follow separately verified schedules.

These durations are proposed service policies, not Ghanaian statutory limits or achieved deletion promises. Before launch align provider retention, backups, legal holds, and data-rights procedures; publish actual schedules. Export and account-deletion controls show what will be removed, what is legally retained, why, and the confirmed timetable. Do not promise instant permanent erasure everywhere or allow “audit trail” to justify indefinite retention of all personal content.

Hide amounts masks amounts, chart values, account nicknames where revealing, and goal figures; it does not encrypt data or protect against device access. Offer a shared-device mode with local draft persistence off, financial cache cleared at logout, discreet notifications, and automatic session locking based on the actual platform. Draft retention on a device is an explicit choice and can fail; never claim browser storage is a secure vault.

Reports are private exports. No public hosting or public story URL at launch. A shareable graphic defaults to no amounts, counterparty names, balances, narration, or precise goal dates. A preview lets the user deliberately include fields and warns that a downloaded file can be redistributed. Future links need recipient/access/expiry/revocation controls; do not imply those exist for a downloadable image.

## 12 Marketing and report applications

### Landing-page hero

Headline: **Your money. In your words.** Supporting copy: “Tell CashNarra what happened with your money. Review the records. See what the numbers mean.” Preserve the formal tagline as the secondary brand signature: **Tell Your Money Story. See the Numbers.**

Before launch use **Coming soon** and a genuine planned call to action. The supplied flyers say “Meet CashNarra” and do not invent a live domain, waitlist form, app-store listing or customer count. When a real destination exists, replace that line with the tested next action and destination. Explain the record/review boundary below the hero and label proposed interfaces.

Composition: a large expressive heading, one useful source-to-record example, the actual proposed screen specimen and the original speech device. Product navigation and form copy stay calmer than campaign headlines. No bank logos, fabricated badges, false free-plan promise, or AI-confidence headline.

### Campaign flyers

Three distinct editable layouts, each exported at **1080 × 1350 feed** and **1080 × 1920 story** dimensions:

1. **Your money. In your words.** Paper background; oversized violet/ink typography; apricot narration; white record slip; a legible phone specimen. The specimen and fictional amounts are labelled.
2. **Tell it once. See it clearly.** Apricot field; ink narration; white record sheet. It shows three of eight sample records and distinguishes Kojo's credit sale from received funds. This illustrates planned behaviour, not a guaranteed extraction result.
3. **Close the day. Keep the story.** Ink/apricot editorial layout with the fictional studio campaign photograph. A short narration lives in the image's quiet area, without covering the person's face. The model is explicitly fictional and AI-generated; there is no testimonial attribution.

The canvases have 76 px content gutters, consistent logo placement and restrained asymmetry. Story versions reposition and resize content; they are not stretched crops. Keep critical copy inside the story safe area, test actual Instagram/WhatsApp overlays, and supply alt text/caption equivalents. CTA is comfortably readable, but its final destination is a launch decision.

The HTML/CSS layouts are editable. PNGs are ready-to-review exports. PDFs are RGB review masters, not certified press-ready CMYK files with trim/bleed. Do print preflight before professional printing. Editable outlined SVG marks are supplied separately. No borrowed brand art is included.

### Onboarding email

Subject: “Your first money story starts here”. Preheader: “Record one useful moment, in your own words.”

Body: “Hello Ama, start with one thing that happened with your money. You might write: ‘I sold GH₵900 cash and paid GH₵80 for delivery.’ CashNarra will propose the records for you to review. You can change the details before saving. Your next step: tell your first story.”

One action: **Tell your first story** linked to the authenticated product. Keep message content free of actual financial amounts by default; the sentence above is explicitly an example. Use a genuine sender and transactional-message context. Promotional messages require applicable choice/opt-out handling.

### Exported report

White paper, ink text, a violet section accent and the one-colour logo. The supplied Ama Works report identifies workspace, GHS, 13 October 2026, fictional data and calculation boundaries. It presents money in 2,300; out 930; net movement 1,370; closing recorded total 5,970; people owe 700; user owes 1,500; then the eight-record ledger and source narration. Sales value 2,400 is distinct from cash received; profit unavailable is explicit. Transfers and goal allocations are excluded from movement totals.

Reports contain text labels, dates, opening amounts, movement formula, exclusions and source IDs. An exported report is not a tax filing, certified invoice, audited financial statement or proof of verified funds. Do not let the logo replace those explanations.

### Shareable Money Story

Default preview: period, chosen display name, neutral theme and **“My money story, made clearer.”** Amounts, people, narration, account names, records and debt balances are hidden until deliberately selected. Show the exact shared content before export; no automatic public link or social action. A separate original confidential report may contain detail chosen for an accountant. Do not make a marketing graphic from a real user's private ledger by default.

## 13 Design tokens and implementation handoff

Use the **final Next.js/React/TypeScript/CSS Modules baseline from the complete technology chat** for handoff examples. The identity, domain states, and tokens remain portable to its Django/HTMX fallback. Use semantic HTML/native controls where appropriate; the plain-HTML specimens do not change the stack recommendation.

### Free development and intended live configuration

Start locally with Next.js/CSS Modules and Supabase Free using fictional fixtures. Use mock extraction and explanation responses for routine UI development; reserve a small budget for actual AI evaluation. Keep migrations and reproducible seed data; do not pretend a free development project has production recovery. Use Vercel Hobby only for qualifying personal/noncommercial work under its terms [R41]. CashNarra's commercial intent can matter before launch, so local development is the default free route. Vercel Pro and Supabase Pro remain the intended live configuration when contracts or operational requirements justify them.

### Alignment with the companion stack recommendation

| Companion recommendation | Product-design implementation |
|---|---|
| Next.js 16, React/TypeScript, Node.js 24 | App Router shell with reusable typed components. Read-oriented screens can render on the server; capture, review editing, permission handling and scenarios need client interaction. Keep raw financial data out of global public caches. |
| Managed Supabase Free for development; Pro intended live PostgreSQL/Auth/private Storage | Signed-in workspace identity; RLS and server authorisation; authoritative save receipts. Private clips/reports only, with the actual retention and access policies. Do not imply provider certification certifies CashNarra. |
| NUMERIC(20,2), decimal.js and hidden double-entry | Exact amounts cross boundaries as decimal strings/validated minor units; no JavaScript floating-point totals. Validated domain posting owns transfers, settlements and correction history. Amount presentation remains shared. |
| OpenAI Responses, pinned gpt-4.1-mini-2025-04-14 Structured Outputs | Interpret schema-constrained drafts; retain human review. Deterministic code owns totals and forecasts. Model snapshot and schema version stay out of normal product flows. Confirm supported configuration before live processing. |
| Local development; Vercel Pro Frankfurt runtime intended live | Responsive web delivery, with region/configuration checked against actual data flows and Ghana-location requirements. Never advertise all processing as Ghana-only or EU-only based on this setting. |
| Resend SMTP | Authentication/service-email templates using the same typography and discreet copy; separate marketing permission and delivery identity. |
| IndexedDB and service worker | Draft storage and static shell/assets, not a fully offline ledger or AI. Separate users/workspaces and erase financial caches at logout; no promise that browser storage is permanent. |
| CSV, jsPDF, write-excel-file | Common deterministic export dataset and type/amount formatter. PDF layouts must embed the licensed font and cedi glyph; offer a text/CSV alternative until PDF accessibility is validated. |
| Short clips after stable text; richer goals progressively | Keep voice entry points coherent but labelled planned until enabled. Use the same clarification/review flow; separate hypothetical assumptions from actual money. |

Folder naming below is a new implementation recommendation; **CSS Modules follows the stack chat**: tokens in `src/design/cashnarra.tokens.json`; generated global properties in `src/app/cashnarra.css`; component styles in CSS Modules; shared primitives in `src/components/cn`; financial formatting and state definitions in `src/domain`. Import global tokens once. A local-font integration can use Next.js's documented font support [R36–R38]. Do not add Tailwind, shadcn, a chat framework, or a chart package as though the stack chat approved them.

The companion chat makes production conditional on DPC registration and lawful processing, provider agreements/regions/retention, and unresolved BoG PFTSP, GRA software approval, Ghana-location/tax-record retention, and NITA scope. Preserve those conditions. OpenAI no-training-by-default, application-state storage, and zero retention are different claims [R33]. Supabase database backups exclude Storage object bytes [R34]; attachment/clip recovery and retention need a separate tested process. Regional deployment does not alone prove full data residency.

Revenue Administration Act 2016 **Act 915 section 27** requires relevant records to be maintained within Ghana and kept for at least six years; disputes/investigations can extend retention [R39]. The unresolved question is the acceptable local-record arrangement when the working SaaS is abroad, including completeness, evidence and update frequency. Determine this before treating Frankfurt deployment as launch-ready. NITA's current official site describes ICT licensing/certification responsibilities [R35], but the precise applicable scheme and status for CashNarra must be confirmed. These are substantive questions, not new frontend permissions or invented regulator endorsements.

The JSON is a compact custom token format, **not a claim of Design Tokens Community Group schema conformance**. Semantic colour keys map directly to CSS variables. Numeric dimensions are CSS pixels; implementation uses rem for text and supports scaling. Light is the initial presentation; support System/Light/Dark when both themes have passed implementation tests.

### Token JSON

The JSON and CSS in `tokens/` are the source of truth. Names are semantic and matching. The compact JSON is valid; external files retain readable formatting. Components use these semantic roles rather than selecting raw hex values ad hoc.

```json
{
  "version":"2.0",
  "direction":"Narra — words into clarity",
  "status":"proposed identity; working design demo",
  "color":{"light":{"background":"#F7F7FA","surface":"#FFFFFF","surface-subtle":"#EFEDF8","text":"#29263D","text-secondary":"#625F73","text-muted":"#6B6779","border":"#E1DEEB","border-control":"#858194","action":"#5B49C7","action-hover":"#4D3DAE","action-pressed":"#403194","on-action":"#FFFFFF","brand-soft":"#F0ECFC","accent":"#FFC4A0","on-accent":"#29263D","focus":"#5B49C7","success":"#226247","success-bg":"#EAF4ED","warning":"#79501B","warning-bg":"#FFF3DF","error":"#AE302C","error-bg":"#FFEEEC","unresolved":"#68449B","unresolved-bg":"#F3EDF9","money-in":"#445BA1","money-out":"#95603E","transfer":"#625F73","chart-1":"#5B49C7","chart-2":"#95603E","chart-3":"#445BA1","chart-4":"#226247","disabled":"#E6E3ED","on-disabled":"#625F73","story-surface":"#29263D","story-text":"#FFFFFF","story-muted":"#D9D4E9","story-accent":"#FFC4A0","story-money-in":"#BACAFB","story-money-out":"#F1BA94"},"dark":{"background":"#191723","surface":"#242131","surface-subtle":"#322C43","text":"#F6F3FB","text-secondary":"#C1BBCE","text-muted":"#B1AABE","border":"#423B53","border-control":"#8C849D","action":"#BEAEFF","action-hover":"#D0C3FF","action-pressed":"#AB96F0","on-action":"#27203E","brand-soft":"#322745","accent":"#FFC4A0","on-accent":"#29263D","focus":"#D0C3FF","success":"#9DD5AD","success-bg":"#203B2C","warning":"#F4CE91","warning-bg":"#423322","error":"#FFABA3","error-bg":"#432624","unresolved":"#D1B1F2","unresolved-bg":"#372945","money-in":"#BACAFB","money-out":"#F1BA94","transfer":"#C1BBCE","chart-1":"#BEAEFF","chart-2":"#F1BA94","chart-3":"#BACAFB","chart-4":"#9DD5AD","disabled":"#383245","on-disabled":"#C1BBCE","story-surface":"#322745","story-text":"#FFFFFF","story-muted":"#D9D4E9","story-accent":"#FFC4A0","story-money-in":"#BACAFB","story-money-out":"#F1BA94"}},
  "font":{"display":"Manrope","body":"Inter","fallback":"system-ui, -apple-system, Segoe UI, Arial, sans-serif","styles":{"display":{"size":56,"line":60,"weight":800,"tracking":"-0.045em"},"page":{"size":32,"line":40,"weight":800,"tracking":"-0.035em"},"section":{"size":20,"line":28,"weight":700,"tracking":"-0.02em"},"body":{"size":16,"line":24,"weight":400,"tracking":"0"},"label":{"size":14,"line":20,"weight":600,"tracking":"0"},"meta":{"size":12,"line":18,"weight":500,"tracking":"0"},"amount":{"size":40,"line":48,"weight":600,"tracking":"-0.03em"}}},
  "space":{"xs":4,"sm":8,"md":12,"base":16,"lg":20,"xl":24,"2xl":32,"3xl":40,"4xl":48,"5xl":64},
  "radius":{"small":8,"control":12,"surface":20,"hero":24,"dialog":24,"pill":999},
  "elevation":{"surface":"0 1px 2px rgba(41,38,61,.04)","overlay":"0 24px 80px rgba(41,38,61,.22)"},
  "motion":{"press":100,"control":160,"panel":220,"ease":"cubic-bezier(.2,.8,.2,1)","reduced":0},
  "layout":{"sidebar":224,"desktopGutter":36,"mobileGutter":20,"contentMax":1180,"touchTarget":44,"fieldHeight":48,"bottomNavigation":72}
}
```

### Matching CSS custom properties

```css
:root {
  --cn-space-xs: 4px;
  --cn-space-sm: 8px;
  --cn-space-md: 12px;
  --cn-space-base: 16px;
  --cn-space-lg: 20px;
  --cn-space-xl: 24px;
  --cn-space-2xl: 32px;
  --cn-space-3xl: 40px;
  --cn-space-4xl: 48px;
  --cn-space-5xl: 64px;
  --cn-radius-small: 8px;
  --cn-radius-control: 12px;
  --cn-radius-surface: 20px;
  --cn-radius-hero: 24px;
  --cn-radius-dialog: 24px;
  --cn-radius-pill: 999px;
  --cn-layout-sidebar: 224px;
  --cn-layout-desktopGutter: 36px;
  --cn-layout-mobileGutter: 20px;
  --cn-layout-contentMax: 1180px;
  --cn-layout-touchTarget: 44px;
  --cn-layout-fieldHeight: 48px;
  --cn-layout-bottomNavigation: 72px;
  --cn-elevation-surface: 0 1px 2px rgba(41,38,61,.04);
  --cn-elevation-overlay: 0 24px 80px rgba(41,38,61,.22);
  --cn-motion-press: 100ms;
  --cn-motion-control: 160ms;
  --cn-motion-panel: 220ms;
  --cn-motion-ease: cubic-bezier(.2,.8,.2,1);
  --cn-motion-reduced: 0ms;
  --cn-type-display-size: 56px;
  --cn-type-display-line: 60px;
  --cn-type-display-weight: 800;
  --cn-type-display-tracking: -0.045em;
  --cn-type-page-size: 32px;
  --cn-type-page-line: 40px;
  --cn-type-page-weight: 800;
  --cn-type-page-tracking: -0.035em;
  --cn-type-section-size: 20px;
  --cn-type-section-line: 28px;
  --cn-type-section-weight: 700;
  --cn-type-section-tracking: -0.02em;
  --cn-type-body-size: 16px;
  --cn-type-body-line: 24px;
  --cn-type-body-weight: 400;
  --cn-type-body-tracking: 0;
  --cn-type-label-size: 14px;
  --cn-type-label-line: 20px;
  --cn-type-label-weight: 600;
  --cn-type-label-tracking: 0;
  --cn-type-meta-size: 12px;
  --cn-type-meta-line: 18px;
  --cn-type-meta-weight: 500;
  --cn-type-meta-tracking: 0;
  --cn-type-amount-size: 40px;
  --cn-type-amount-line: 48px;
  --cn-type-amount-weight: 600;
  --cn-type-amount-tracking: -0.03em;
  --cn-font-body: "Inter", system-ui, sans-serif;
  --cn-font-display: "Manrope", "Inter", system-ui, sans-serif;
}
:root, [data-theme="light"] {
  color-scheme: light;
  --cn-background: #F7F7FA;
  --cn-surface: #FFFFFF;
  --cn-surface-subtle: #EFEDF8;
  --cn-text: #29263D;
  --cn-text-secondary: #625F73;
  --cn-text-muted: #6B6779;
  --cn-border: #E1DEEB;
  --cn-border-control: #858194;
  --cn-action: #5B49C7;
  --cn-action-hover: #4D3DAE;
  --cn-action-pressed: #403194;
  --cn-on-action: #FFFFFF;
  --cn-brand-soft: #F0ECFC;
  --cn-accent: #FFC4A0;
  --cn-on-accent: #29263D;
  --cn-focus: #5B49C7;
  --cn-success: #226247;
  --cn-success-bg: #EAF4ED;
  --cn-warning: #79501B;
  --cn-warning-bg: #FFF3DF;
  --cn-error: #AE302C;
  --cn-error-bg: #FFEEEC;
  --cn-unresolved: #68449B;
  --cn-unresolved-bg: #F3EDF9;
  --cn-money-in: #445BA1;
  --cn-money-out: #95603E;
  --cn-transfer: #625F73;
  --cn-chart-1: #5B49C7;
  --cn-chart-2: #95603E;
  --cn-chart-3: #445BA1;
  --cn-chart-4: #226247;
  --cn-disabled: #E6E3ED;
  --cn-on-disabled: #625F73;
  --cn-story-surface: #29263D;
  --cn-story-text: #FFFFFF;
  --cn-story-muted: #D9D4E9;
  --cn-story-accent: #FFC4A0;
  --cn-story-money-in: #BACAFB;
  --cn-story-money-out: #F1BA94;
}
[data-theme="dark"] {
  color-scheme: dark;
  --cn-background: #191723;
  --cn-surface: #242131;
  --cn-surface-subtle: #322C43;
  --cn-text: #F6F3FB;
  --cn-text-secondary: #C1BBCE;
  --cn-text-muted: #B1AABE;
  --cn-border: #423B53;
  --cn-border-control: #8C849D;
  --cn-action: #BEAEFF;
  --cn-action-hover: #D0C3FF;
  --cn-action-pressed: #AB96F0;
  --cn-on-action: #27203E;
  --cn-brand-soft: #322745;
  --cn-accent: #FFC4A0;
  --cn-on-accent: #29263D;
  --cn-focus: #D0C3FF;
  --cn-success: #9DD5AD;
  --cn-success-bg: #203B2C;
  --cn-warning: #F4CE91;
  --cn-warning-bg: #423322;
  --cn-error: #FFABA3;
  --cn-error-bg: #432624;
  --cn-unresolved: #D1B1F2;
  --cn-unresolved-bg: #372945;
  --cn-money-in: #BACAFB;
  --cn-money-out: #F1BA94;
  --cn-transfer: #C1BBCE;
  --cn-chart-1: #BEAEFF;
  --cn-chart-2: #F1BA94;
  --cn-chart-3: #BACAFB;
  --cn-chart-4: #9DD5AD;
  --cn-disabled: #383245;
  --cn-on-disabled: #C1BBCE;
  --cn-story-surface: #322745;
  --cn-story-text: #FFFFFF;
  --cn-story-muted: #D9D4E9;
  --cn-story-accent: #FFC4A0;
  --cn-story-money-in: #BACAFB;
  --cn-story-money-out: #F1BA94;
}
@media(prefers-reduced-motion:reduce){:root{--cn-motion-press:0ms;--cn-motion-control:0ms;--cn-motion-panel:0ms}}
```

### Naming and documentation

Use `CN/Button`, `CN/NarrationInput`, `CN/ClarificationCard`, `CN/RecordRow`, `CN/ReviewSummary`, `CN/TraceableNumber`, `CN/AccountCard`, `CN/StoryChapter`, `CN/PacePanel`, `CN/ChangePreview`, `CN/Notice`, `CN/Dialog`, and utilities from section 7. Code uses corresponding names without the slash. Variants identify meaning: `intent=primary`, `state=saving`, `theme=dark`, `density=comfortable`, not `greenButton2`.

Design variables use `color/action`, `color/on-action`, `color/unresolved`, `space/4`, and `radius/card`; their CSS equivalents are `--cn-action`, `--cn-on-action`, `--cn-unresolved`, `--cn-space-base`, and `--cn-radius-surface`. Record schema/type names are owned by the financial domain; visible human labels are translations of that meaning.

Each component documentation page includes purpose, anatomy, tokens, responsive rules, supported states, keyboard/screen-reader behaviour, content examples, forbidden uses, and a fixture from the shared dataset. Screens reference those components and do not redraw controls locally. Illustrations and mark vectors have versioned filenames and a proposed/approved status. Do not let a developer-generated alternative mark silently replace the canonical vector.

Keep public copy in message keys such as `capture.localDraft`, `batch.ready`, `save.outcomeUnknown`, `debt.partPayment`, and `forecast.insufficientHistory`. Test count/plural rules and amount formatting. Do not allow the language model to write “Saved” or a total independently of the actual application state.

### Small-team implementation rules

Use one theme system, one responsive shell, one review-row layout, and one change-preview pattern. Reuse the same domain operations for direct editing and conversational corrections. Preserve each narration revision, extraction version, user changes, record links and authoritative save receipt according to the retention policy. The UI accepts official totals from deterministic services and reveals their inputs.

Budget proposals: initial product shell should render and accept input before AI response; one 352KB font download cached after first use; no autoplay media; lazy-load future voice/export code and large chart features. A compressed initial JavaScript budget of 200KB and a useful first render within 3 seconds on a representative modest phone/connection are hypotheses to measure, not achieved results. Capture performance, font fallback, and recovery take priority over decorative motion.

Enforce draft ownership, explicit save authority, retry keys, revision conflict checks, exact monetary types, atomic transfers, and source references. Avoid fetching or logging raw financial data for design analytics. Use event durations/counts without payloads. The guide's static HTML deliberately contains no network requests or live financial processing.

## 14 Validation priorities and one-page build brief

### Validation plan

Run two rounds with **6–8 participants each**: people using personal records and owner-operated businesses; cash/MoMo/bank mixes; varying literacy and financial/digital confidence; users who record daily and those who catch up. Include people with low vision, motor limitations, or screen-reader experience through separate accessibility sessions if necessary. Recruit without treating this small qualitative sample as representative of all Ghanaian users.

Use fictional tasks first, then consenting users' own pilot data under the implemented privacy arrangements. Include a 2–4GB RAM Android phone at 360px, a 320px viewport, current Android Chrome/TalkBack, an iPhone/Safari/VoiceOver, and desktop keyboard/NVDA. Test constrained network, latency, connection loss, battery saver, font failure, browser-storage failure, and server-response loss after a successful save.

Tasks: record the full eight-record story; answer included/additional credit-sale ambiguity; correct 80 to 100; split stock; find Abena and record a partial/full payment; recognise a possible duplicate; recover an offline draft; distinguish saved from save-not-confirmed; explain the recorded MoMo balance; inspect a partial-week Money Story; interpret an allocation-based forecast and a what-if scenario; export a report with privacy choices; sign out on a shared device.

| Measure | Definition | Initial target hypothesis |
|---|---|---|
| Time to first useful record | Start real flow → authoritative first save and understood result; report median and spread, separate sign-in/network time | Median under 2 minutes for a simple narration; not a marketing promise. |
| Multi-event task success | Correct accounts/types/amounts/debt linkage without moderator assistance | At least 85% in prototype rounds; **all** money-integrity defects fixed before pilot. |
| Clarification burden | Required questions per narration, repeats, and abandonment; analyse material ambiguity separately | Median no more than 2 for the shared example; do not suppress needed questions to hit target. |
| Correction recovery | User finds record, understands change, applies valid correction and sees effect | At least 90% task success in pilot usability testing. |
| Financial comprehension | User distinguishes receipts/sales, transfer/spending, recorded/verified, review/completeness, allocation/payment | At least 90% correct for each tested distinction before promoting the associated feature. |
| Forecast comprehension | User can state pace, assumptions, and that scenario changes no actual records | At least 90%; reword before expanding features if missed. |
| Save/retry integrity | Posting result under retries, network loss, concurrent edits | Zero duplicate or partial invalid postings in controlled tests. This is a correctness gate, not a UX average. |
| Consistent useful use | Review/capture frequency relative to chosen rhythm, self-reported value, reasons for absence | Learn from a 4-week pilot; no invented retention benchmark or incentive to maximise time in app. |
| Accessibility | Complete-process manual checks plus automation | No known blocking failures; document scope, browsers, methods and unresolved findings before any conformance claim. |

Do not interpret a low correction rate as accuracy without checking whether users noticed errors. Validate extraction against adjudicated financial examples, including loans, owner money, inventory purchases, ambiguous sales totals, multiple people with the same name, approximate amounts, and malicious instructions embedded in narration. Use a qualified financial reviewer for semantics. AI model confidence is not a substitute for those evaluations.

### First-release priorities

**Build first:** authentication/privacy notice; workspace/manual accounts; text capture; draft states; consequential clarification; atomic batch review/save; record provenance and valid corrections; debt settlements; offline draft and outcome recovery; traceable daily/weekly/monthly stories; CSV/PDF/XLSX exports; basic optional fixed-amount goals with honest pace/insufficient-data states; settings, check-in counts and quiet reminders.

**Follow after core validation:** short voice/transcript flow; simple amount/date what-if scenarios; better export formats; saved categorisation rules with explicit user acceptance; refined motion. Dark theme can be introduced once the existing specified tokens and all implemented components are tested; the spec must already support it.

**Defer:** richer debt/reserve/profit goals, seasonality/interest/inflation models, statement imports/OCR, external reconciliation, bank/MoMo/SMS feeds, accountant collaboration, public sharing links, payments, lending, securities advice and tax filing. A feature becoming regulated requires reassessing its service and claims, not just renaming a button.

Owners: designer maintains tokens, specimens and accessibility annotations; engineer owns save/recovery/financial invariants; content owner maintains state-linked copy; financial reviewer approves example semantics; privacy/legal owner resolves operator/data/BoG/GRA questions; founder approves final identity after clearance and pilot learning. One person may hold several roles, but each responsibility remains explicit.

**Final consistency check:** all totals, examples and screens use the Ama Works dataset; all financial statuses derive from actual state; colour roles and tokens agree; no unearned completeness/confidence labels; font and icon licences retained; proposed artwork labelled; core tasks remain usable without goals, voice, animation or reminders.

### Research reference register

All references accessed or checked on 13 October 2026. “Located” means the official file was found but its contents were not fully searchable here.

| ID | Primary source |
|---|---|
| R01 | Duolingo, [The craft behind the core tabs redesign](https://blog.duolingo.com/core-tabs-redesign/) |
| R02 | Duolingo, [Improving the streak](https://blog.duolingo.com/improving-the-streak/) — reported relative experiment effects. |
| R03 | Monzo, [The differences between Summary and Trends](https://monzo.com/help/budgeting-overdrafts-savings/web-the-differences-between-Summary-and-Trends) — product help, not CashNarra outcome evidence. |
| R04 | Todoist, [Introduction to Karma](https://www.todoist.com/help/todoist/features/introduction-to-karma-OgWkWy) |
| R05 | YNAB, [Goal tracking](https://www.ynab.com/features/goal-tracking) and [How to use targets](https://support.ynab.com/how-to-use-targets-rk5kkI9ks) |
| R06 | GOV.UK, [Check answers](https://design-system.service.gov.uk/patterns/check-answers/) |
| R07 | GOV.UK, [Error summary](https://design-system.service.gov.uk/components/error-summary/) |
| R08 | GOV.UK, [Question pages](https://design-system.service.gov.uk/patterns/question-pages/) |
| R09 | Amershi et al., CHI 2019, [Guidelines for Human–AI Interaction](https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/) and [paper](https://www.microsoft.com/en-us/research/wp-content/uploads/2019/01/Guidelines-for-Human-AI-Interaction-camera-ready.pdf) |
| R10 | FCA, [Digital engagement practices trading-app experiment](https://www.fca.org.uk/publications/fca-research/research-note-digital-engagement-practices-trading-apps-experiment) — behavioural research, not Ghanaian legal requirements. |
| R11 | W3C, [WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/) |
| R12 | W3C, [Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) |
| R13 | W3C, [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) |
| R14 | W3C, [Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) |
| R15 | W3C, [Focus Not Obscured Minimum](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) |
| R16 | W3C, [Accessible Authentication Minimum](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html) |
| R17 | W3C, [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) |
| R18 | W3C, [Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) |
| R19 | Rasmus Andersson, [Inter official font site](https://rsms.me/inter/) |
| R20 | Inter v4.1, [SIL Open Font License](https://raw.githubusercontent.com/rsms/inter/v4.1/LICENSE.txt) |
| R21 | Lucide, [ISC and inherited MIT licence notices](https://lucide.dev/license) |
| R22 | Ghana DPC, [Data Protection Act 2012 Act 843](https://dataprotection.org.gh/wp-content/uploads/2025/05/Data-Protection-Act-2012-Act-843.pdf) |
| R23 | Ghana DPC, [For organisations](https://dpc.gov.gh/for-organisations/) — official implementation guidance. |
| R24 | Bank of Ghana, [PFTSP notice BG GOV SEC 2020 14](https://www.bog.gov.gh/wp-content/uploads/2020/11/Notice-Payment-and-Fintech-Service-Providers-_Final-26th-November-2020.pdf) |
| R25 | Bank of Ghana, [Licence categories](https://www.bog.gov.gh/fintech-innovation/licence-categories/) |
| R26 | Ghana SEC, [Current warning explaining Act 929 section 109](https://sec.gov.gh/public-notice-warning-against-unlicensed-investment-scheme-mekanism-marketing-ltd/) dated 16 February 2026. |
| R27 | GRA, [Taxpayer rights and obligations](https://gra.gov.gh/domestic-tax/taxpayer-rights-and-obligations/) |
| R28 | GRA, [2024 Certified Invoicing System guidelines](https://gra.gov.gh/wp-content/uploads/2024/07/E-VAT-GUIDELINES_20240222.pdf), section 13 — current applicability unresolved. |
| R29 | GRA, [Current E-VAT information](https://gra.gov.gh/e-services/e-vat/) |
| R30 | GRA, [Value Added Tax Act 2025 Act 1151](https://gra.gov.gh/wp-content/uploads/2026/01/VALUE-ADDED-TAX-ACT-2025-ACT-1151.pdf) — located; scanned text not fully reviewed. |
| R31 | GRA, [VAT Guidelines for Act 1151](https://gra.gov.gh/wp-content/uploads/2026/01/VAT-Guidelines-for-VAT-ACT-1151.pdf) — located; extraction/verification wall limited review. |
| R32 | W3C, [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/) |
| R33 | OpenAI, [API data controls](https://developers.openai.com/api/docs/guides/your-data) — no-training defaults, retention and residency are separate controls. |
| R34 | Supabase, [Database backups](https://supabase.com/docs/guides/platform/backups) — database backup excludes Storage object bytes. |
| R35 | NITA, [Official mandate and responsibilities](https://www.nita.gov.gh/about) — precise scheme applicability remains unresolved. |
| R36 | Next.js, [Server and client components](https://nextjs.org/docs/app/getting-started/server-and-client-components) |
| R37 | Next.js, [Fonts](https://nextjs.org/docs/app/getting-started/fonts) |
| R38 | Next.js, [Progressive web apps](https://nextjs.org/docs/app/guides/progressive-web-apps) |
| R39 | GRA, [Revenue Administration Act 2016 Act 915](https://gra.gov.gh/wp-content/uploads/2023/01/Revenue-Administration-Act-2016-.pdf), section 27. |
| R40 | GRA, [VAT Regulations 2016 L.I.2243](https://gra.gov.gh/wp-content/uploads/2022/07/VALUE-ADDED-TAX-REGULATIONS-2016-L.I.-2243.pdf), regulation 31. |
| R41 | Vercel, [Fair-use guidelines](https://vercel.com/docs/limits/fair-use-guidelines) — Hobby commercial-use constraints. |


Additional visual-craft references reviewed for v2 on 13 October 2026: Duolingo [core tabs redesign](https://blog.duolingo.com/core-tabs-redesign/) advocates tiered hierarchy, purposeful variation and fewer forced containers; this is a design lesson, not CashNarra outcome evidence. Apple [design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles/) foreground hierarchy, feedback and user control; the live page requires JavaScript here, so this review used official indexed descriptions rather than claiming a complete page read. [Manrope font source and OFL](https://github.com/google/fonts/tree/main/ofl/manrope) was obtained with its licence; local glyph coverage was inspected.

### One-page implementation brief

**Product:** CashNarra. **Tagline:** Tell Your Money Story. See the Numbers. **Structure:** Record → Understand → Plan. **Principle:** Serious money. Light interaction.

**Direction:** Narra — words into clarity. Filled opposing speech shapes; outlined Manrope 800 wordmark. Violet #5B49C7, ink #29263D, apricot #FFC4A0, paper #F7F7FA, tint #F0ECFC. White surfaces. Dark values and status roles come from the supplied semantic tokens. No mascot, financial glow or stock finance imagery.

**Type:** Manrope 700–800 for headings; Inter 400–600 for copy and all amounts. Inter supports ₵ and tabular numerals; the supplied Manrope does not. Desktop page 32/40; mobile 27/34; amount 40/48 desktop, 37/46 mobile; editable fields 16/26. Minimum effective touch target 44 px, primary mobile flow action 48 px. Control radius 12, surface 20, hero/dialog 24. 4 px spacing scale.

**Navigation:** Today / Records / Money Stories / Plan. Accounts and workspace selector in app chrome; settings and privacy accessible directly. Sidebar 224 px; bottom navigation 72 px at 760 px and below. Mobile home makes narration visible before secondary metrics. Search never requires chat.

**Reusable pieces:** AppNavigation, Button/IconButton, TextInput/Textarea, Composer, SourceQuote, AccountChoice, RecordRow, BatchSummary, SegmentedFilter, AccountCard, StatusBadge, GoalProgress, Rhythm, StoryPreview, Notice, Dialog, Feedback. Keep working rows level, aligned and lightly separated. Don't box every paragraph.

**Signature behaviour:** words → important question only → compact batch review → confirmed saving → traceable Money Story. Every important number opens its records/period/assumptions. Correction preserves the original source and updates affected totals. Rest and catch-up never erase history; check-ins never assert completeness.

**Safeguards:** locally captured is not saved; unknown is not zero; transfer isn't spending; old debt payment isn't new sales; allocations aren't money moved; forecasts aren't affordability guarantees. Save atomically with idempotent posting, exact decimals and tenant isolation. Retain narration through processing/save errors. Resolve Ghanaian launch applicability and provider/retention questions from the stack guide. Target WCAG 2.2 AA; don't claim tested conformance.

**Build order:** Next.js/React/TypeScript/CSS Modules locally; Supabase Free with migrations and synthetic seed data; mock AI first. Build accounts/openings, text extraction, clarification, review/save and correction; then traceable Money Stories and exports; then goals/scenarios; short voice after text validation. Intended production host remains Vercel subject to terms/actual operational needs. No paid deployment is authorised by this handoff.

**Start now:** inspect the interactive preview, copy tokens and outlined mark, implement the narration/review loop with the shared Ama Works dataset, then verify 320 px reflow, keyboard and save recovery. Campaign assets are proposed: three concepts, feed and story exports. The demo is a design tool, not a production financial application.
