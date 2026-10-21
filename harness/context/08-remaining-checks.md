# Phase 08 remaining checks — prepared 21 October 2026

This packet prepares the checks in section 0.5 of `docs/ux/CASHNARRA_FINAL_HANDOFF.md`. The one consented transcription is recorded below. It does not record a screen-reader session or a large-workspace timing. Do not set `VOICE_QUALITY_APPROVED`. Do not send this script to the story reader. Do not save it as a financial record.

Branch at preparation: `work/cashnarra-v1`. HEAD: `b8012f049c7d18fd2addec252ad50929763c5b72`. Later uncommitted work stays in place.

The Groq key and the Free-plan confirmation are already saved. Do not ask for them again. The one consented clip below was sent on 21 October 2026 and the audio was deleted. Do not record or send it again. `.local/voice-evaluation/manifest.json` is still absent, so the five-speaker intake remains NOT READY. The synthetic files in `.local/voice-smoke` are not that corpus.

## Voice clip

Completed for one computer-spoken clip. The returned words kept 500, 100, 200, Ama, “has not paid”, and Cash to MoMo. “Momo” was not capitalised as MoMo. No record was saved. The audio is already deleted.

The original instruction was: say only this, once, in a quiet room:

“I sold 500 cedis for cash. Ama has not paid the 100 cedis she owes. I moved 200 cedis from cash to MoMo.”

It is one fictional sale, one unpaid debt, and one transfer. Ama’s GH₵100 was not received. The GH₵200 left Cash and went to MoMo. It is not a new expense and not a debt payment.

Before anyone records, the speaker agrees in a private file outside Git that:

- the clip is this fictional sentence only
- this computer may send that one clip to the already configured Groq Free transcription
- the words come back for editing
- CashNarra must not save a financial record from the transcript alone
- a deletion date is written down before the recording

One clip does not show how well the service handles Ghanaian accents. Customer recordings stay within the one-minute limit already configured. Do not use a paid model if Free transcription fails. Do not send the same clip again after a timeout. Editing the words is not a reason to transcribe again. If the story is read afterwards, that is a separate step and is not authorised by this packet.

After a real clip, keep the evidence private and record only these facts in the build log:

| Item | What to write |
| --- | --- |
| Start, elapsed time, plan limit, stop | What the screen showed |
| Words returned | Whether 500, 100, 200, Ama, “has not paid”, and Cash to MoMo survived |
| Negation | “Has not paid” must not have become “has paid” |
| Editing | The words stayed editable |
| Leaving and returning | The same words were still there, without a second transcription |
| Save | No financial record was saved from the transcript |
| Failure | The words remained, and the clip was not sent again |

The unpaid scorer for this sentence is case `phase08-sale-unpaid-transfer` in `harness/context/voice-transcription-cases.json`. It checks text only. A passing score is not a transcription result.

## Screen-reader task

A person uses their own browser and screen reader with the fictional sample. Keyboard focus and automated checks do not replace this. Ask them to do these steps and write down what they heard. Do not record their financial life, and do not put their name in Git.

1. Find the workspace name and the date.
2. Find the story box. Say whether **Understand my story** is available, and why it is not, while the box is empty.
3. Open **Workspace, accounts and settings**, hear the dialog, close it, and say where focus returns.
4. Open a story that asks one question. Hear the question and the choices.
5. On the review, hear the original words and one proposed row.
6. Use **Change** on that row and say whether the edit stayed on the page.
7. Find the save button and say its name, including the number of records.
8. Hear one status or error. A disposable demo state is enough. Say whether the message told them what happened and what they can do next.
9. Hear one amount and say whether the currency was clear.

Write the reader name, browser, what was understandable, and what blocked the task. That session stays NOT RUN until those notes exist.

## Large-workspace measurement

Finding 24 is optional and NOT RUN. The phase file does not give a pass or fail time. Do not invent one.

If it is done later, use a disposable fictional workspace, not the owner’s records. Record the record count (100, 1,000, or 5,000), the browser and computer, and the time to open the list, change a filter, and open the period report. Compare those notes with any target that already exists. A local time is not field loading speed. Do not change the ledger to make a number smaller before the measurement exists.

## Empty day

On 21 October 2026, Edge opened the fictional sample and moved Today from 13 October 2026 to 12 October 2026. The empty day said “No records for this day. That does not mean nothing happened.” The Money in control said “No records for this day” and did not show GH₵0.00. Returning to 13 October still showed a cedi amount. The sample records were not deleted. This does not check a real phone keyboard or landing field speed. The two typecheck files were repaired later on 21 October 2026 and `npm run typecheck` passes; see the Claude entry in `harness/build-log.md`.
