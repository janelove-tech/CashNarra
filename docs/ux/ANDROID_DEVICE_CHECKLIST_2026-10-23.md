# Android phone test — 23 October 2026

The Android testing baseline is local `work/cashnarra-v1` after it fast-forwards to the Story Log, phone-pass, and Next.js 16.4.1 checkpoint on `redesign/words-to-records`. This checklist is the physical pass. Emulated Edge checks are not a substitute for it.

Use the fictional example only. Do not type a real financial story. Do not turn voice quality on, call a paid reader, start a payment, or publish the app. The dev server stays on this computer at `http://127.0.0.1:3100`. Do not deploy it to reach the phone.

## How to open CashNarra on the phone

The server listens on this computer only, so the phone cannot open that address by itself.

1. Keep `npm run dev -- --port 3100` running on the computer.
2. On the phone, turn on Developer options and USB debugging.
3. Connect the phone with a USB cable and accept the computer prompt.
4. On the computer, open Chrome and go to `chrome://inspect/#devices`. Confirm the phone is listed.
5. In Port forwarding, add port `3100` forwarded to `127.0.0.1:3100` and enable it.
6. On the phone, open Chrome and go to `http://127.0.0.1:3100`.
7. On the public page, choose **Try an example**. That opens the fictional workspace. It does not create a customer account.

If the phone shows a connection error, the forward is off or the computer server has stopped. Do not point the phone at a public host to get around that.

## What to write down for every check

- Phone model, Android version, and Chrome version.
- Date and whether the page was a browser tab or an installed home-screen icon.
- What you did, what you saw, and what you expected.
- A screenshot or screen recording when the screen looks wrong.
- Say whether any words you typed were still there afterward.

Send that note back as a defect. Do not file it in Play Console. A pass is still worth a one-line note so the row can move off NOT RUN.

## Install

Add to your home screen only appears in the account menu when Chrome offers the install prompt, and only when the app is not already installed. Use that control if it is there. Cancelling it should leave the page as it was. Do not treat a menu item as proof that an icon was added. After an icon exists, open CashNarra from that icon and confirm it starts at the app rather than a broken address.

## Checks that still need the phone

Emulated results from 23 October 2026 are marked E. Everything below is R and starts as NOT RUN.

| ID | On the phone | What good looks like |
| --- | --- | --- |
| APP-02 | Close the installed icon, then open it again. Also try an expired sign-in if you have a real local account. | The fictional or signed-in app is usable. A signed-out person can sign in and return to the app. |
| APP-03 | Use Add to your home screen if Chrome offers it, then cancel once and accept once. | No repeated nag, and no message that claims the icon exists before it does. |
| APP-04 | Use Home, Records, Tell, Stories, and Plan. Open the account button. | The selected item is clear. Accounts, people, plan, settings, and sign-out are in the account menu. |
| APP-05 | Use the system Back gesture on a screen, a dialog, and during a recording. | Back closes the dialog and returns to the opener. Back does not throw away typed words. Back during a recording asks before discarding it. |
| APP-06 | Focus the story box and let the keyboard open on a short phone. | Understand my story, Speak, and the bottom bar stay reachable. The keyboard does not cover the main action. |
| APP-07 | Pinch-zoom the story screen. Tap the bar and the account button. | Pinch zoom still works. Targets are easy to hit. |
| APP-08 | Type a sentence, turn on Draft backup, leave the app, and come back. | The words are still there. A failed backup does not say the words were saved. |
| APP-11 | Tap Speak and refuse the microphone, then allow it on a second try. | Refusal leaves typing available. Recording starts only after you ask and the phone allows it. |
| APP-12 | Start a recording, switch away, lock the phone, and if you can, receive a call. | Recording stops with a clear message. A partial clip is not treated as ready without you checking it. |
| APP-13 | If a transcript appears, edit the words and run Understand my story once, then again after an edit. | The same recording is not sent again just because the words or the read failed. Voice quality stays off, so a missing transcript is an acceptable result. |
| APP-14 | Turn on airplane mode after a page has loaded, then open another screen. | The offline page is readable, says nothing was saved or lost, and does not create a record. |
| APP-15 | Add one fictional manual record and save it. Then try the same save again if the screen offers a retry. | Saved appears only after the receipt. A retry does not create a second record. |
| APP-16 | From Records, export CSV, PDF, and XLSX, then use the phone share sheet if Android offers one. | Each file downloads or shares. If sharing is unavailable, the download still works. |
| APP-17 | Sign out, then open the app again on the same phone. | The next person does not see the previous draft, recording, or figures. |
| APP-18 | If a “newer version” notice appears while you are recording or saving, leave it until you finish. | The notice does not reload the page in the middle of that work. |
| APP-19 | Open Plan and usage. | The plan and any unknown usage match the account. No payment screen claims money was taken. |
| APP-20 | Turn on TalkBack and move through Home, the story box, one dialog, and Save. | Names are spoken, focus is visible, and the dialog can be closed. |
| APP-21 | Rotate to landscape, then back. | The story, the bar, and the account menu still have a clear next action. |
| APP-23 | On your normal mobile connection, open the public page and then the example. Note roughly how long until you can type. | Record the phone and network. Do not describe the computer as if it were the phone. |

These emulated checks already passed and do not need to be repeated unless the phone shows a different result: APP-01 public example and manifest, APP-04 and APP-05 in Edge, APP-06 at 360×380, APP-07 at 200% zoom, APP-08 draft and backup, APP-09 address restore, APP-10 workspace isolation, APP-14 offline page, APP-15 save and receipt, APP-16 file download, APP-20 contrast and keyboard, APP-21 the six widths, and APP-22 the violet mark with the ink name. APP-24 typecheck, lint, unit tests, and the safe browser suite passed on this computer. Auth and recovery browser tests, database tests, and Supabase tests were not run because that local stack was not started.

## Stop if

- The phone is asked for a real card, MoMo, or a paid story.
- A recording starts by itself.
- Saved appears before you confirm a record.
- One workspace shows another person’s records.
- The only way to continue seems to be a production deploy or a Play upload.
