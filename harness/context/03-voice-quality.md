# V1 voice evaluation protocol

Status: EXTERNAL — no physical speaker recordings or live transcription evaluated in this programme. Do not set VOICE_QUALITY_APPROVED based on unit/browser tests.

Use consenting speakers reading synthetic stories from 02-narration-corpus.json. Include at least five Ghanaian-English speakers, normal and fast delivery, quiet and modest-background-noise conditions, and multiple recording devices. Include cedi/pesewa amounts, 2k/4.5k, MoMo, Bank/Cash, Kwame/Abena/Kojo/Efua, credit expense versus stock, partial debt settlement, principal versus interest, and several events in one clip. Do not claim local-language or code-switching support. Consent and raw audio remain private, outside Git, with a deletion schedule agreed before collection.

For each case retain locally: opaque case/speaker ID, consent scope, device/browser, noise/speed category, clip length/size, expected words and financial meaning, raw provider transcript, user edits, interpretation and questions, provider/model/date/latency/cost. No customer records. Fixed capture date and fixture workspace. Opt-in live calls require an approved spend ceiling before execution.

Report separately: amount exact-match, account/party/debt-name exact-match, financial kind match after interpretation, material clarification match, silent consequential guesses, word-error rate, timeout/failure rate and recovery success. A JSON-valid transcript is not financial success. Every consequential error must become correction or clarification before review; zero silent consequential errors in the release corpus is the minimum gate, not a guarantee for all users. Report numerator/denominator per speaker/device/noise subgroup. Any failure blocks quality approval pending fix and rerun.

Manual device matrix: explicit permission; deny; cancel pending permission then allow late; stop/cancel; replacement; discard retaining words; private download; close while recording/uploading; unsupported WebM browser; insecure non-local HTTP; device disconnect; offline; empty speech; three-minute and 8 MB boundaries. Verify microphone indicator off after close/stop. Never simulate success in the product.

Common pipeline inspection: VoiceCapture calls onTranscript only on Use reviewed words; CashNarra changeDraft appends those words and navigates to capture. Interpretation, material clarification, review and deterministic authoritative save are the existing text pipeline. No POST /api/workspaces occurs from VoiceCapture or /api/transcribe. Typed input is always reachable.

## Offline recording intake — 2026-10-17

`npm run eval:voice-intake` checks `.local/voice-evaluation/manifest.json` and files in that same private directory. It makes no network calls, loads no credentials, changes no quality flags and never touches the evaluation budget. Missing intake exits nonzero with NOT READY; this is not an evaluation failure or quality result.

Prepare recordings with consenting people before live evaluation. Agree on deletion dates before collection. Store actual consent evidence privately as the referenced JSON file; do not put names, signatures or recordings in Git. Use opaque speaker/device/clip identifiers. The checker verifies metadata assertions and file existence, not the authenticity or legal sufficiency of consent. A person must review that evidence before any upload. Files are not automatically deleted by this checker; the operator must honour the agreed deletion dates.

Example entry below is intentionally unapproved. Copy to the private manifest and replace values from actual consent and recordings; do not simply turn the consent flags on to pass a test. Repeat entries for the corpus, at least five Ghanaian-English speakers and multiple devices. Each speaker needs normal/fast delivery and quiet/background conditions; filenames must be unique. Expected synthetic words and financial meaning come from the referenced corpusId in 02-narration-corpus.json. Optional later edits, transcripts and provider results belong in separate private evaluation captures, not this intake manifest.

```json
{
  "version": 1,
  "clips": [{
    "id": "clip-001",
    "speakerId": "speaker-001",
    "deviceId": "device-001",
    "browser": "Record the actual browser and version",
    "corpusId": "cash-sale",
    "file": "clip-001.webm",
    "consentFile": "consent-001.json",
    "consent": {
      "syntheticStoriesOnly": false,
      "localEvaluation": false,
      "providerTranscription": false,
      "recordedOn": "YYYY-MM-DD",
      "deleteOn": "YYYY-MM-DD"
    },
    "accent": "Ghanaian English",
    "speed": "normal",
    "noise": "quiet"
  }]
}
```

Use the application's supported WebM/Opus format, up to three minutes and 8 MB. The checker reuses src/server/recording.ts to inspect audio structure and duration, rather than trusting a supplied duration. It bounds file sizes, rejects paths outside the resolved intake directory and reports only opaque coverage IDs/counts. A metadata/file PASS still requires human consent review and the budget-controlled transcription → editable transcript → shared narration pipeline evaluation. Live voice capture/scoring remains to be connected to the existing cumulative budget after audio pricing is verified; this command does not perform it.

## Groq candidates — 2026-10-21

Transcription and interpretation stay separate. The local adapter can send a validated recording to Groq and return editable text. It does not post records. Two fixed models are priced from Groq's published rates checked on 2026-10-21: `whisper-large-v3-turbo` at US$0.04 per audio hour, and `whisper-large-v3` at US$0.111 per audio hour. Requests shorter than 10 seconds are reserved at 10 seconds. The official endpoint is `https://api.groq.com/openai/v1/audio/transcriptions`. An OpenAI key is not a Groq key.

`harness/context/voice-transcription-cases.json` and `scripts/lib/voice-score.ts` score mock transcripts for amounts, dates, names, negations and spoken corrections. They do not contain recordings and they do not call a provider. A live comparison of the two Groq models still needs the consented private manifest, about 40–60 fictional clips, and an explicit invocation inside the existing US$10 approval. That comparison is NOT RUN. Do not set `VOICE_QUALITY_APPROVED` from this scorer. Hosted upload remains blocked by the 4.5 MB function-body limit against the 8 MB local recording cap. The OpenAI credit pause is a different file from a Groq pause.

The pilot policy is free-only. Free and Developer are account plans. There is no documented switch that spends a Free allowance and then charges the same organization. CashNarra does not upgrade an account or rotate keys. A future Groq call needs an operator record naming the organization, its plan, and when that plan was checked. If that record is missing, inconsistent, or Developer, the recording stays local. A confirmed Free success keeps payable audio spend at US$0 and stores only a reference cost. That reference cost is not deducted from the US$10 evaluation journal. The local capacity file cannot see other applications on the same Groq organization, and it is not a quota manager for more than one server. Voice stays off. These notes are not a Free-plan entitlement and not an accuracy result.
