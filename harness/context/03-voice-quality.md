# V1 voice evaluation protocol

Status: EXTERNAL — no physical speaker recordings or live transcription evaluated in this programme. Do not set VOICE_QUALITY_APPROVED based on unit/browser tests.

Use consenting speakers reading synthetic stories from 02-narration-corpus.json. Include at least five Ghanaian-English speakers, normal and fast delivery, quiet and modest-background-noise conditions, and multiple recording devices. Include cedi/pesewa amounts, 2k/4.5k, MoMo, Bank/Cash, Kwame/Abena/Kojo/Efua, credit expense versus stock, partial debt settlement, principal versus interest, and several events in one clip. Do not claim local-language or code-switching support. Consent and raw audio remain private, outside Git, with a deletion schedule agreed before collection.

For each case retain locally: opaque case/speaker ID, consent scope, device/browser, noise/speed category, clip length/size, expected words and financial meaning, raw provider transcript, user edits, interpretation and questions, provider/model/date/latency/cost. No customer records. Fixed capture date and fixture workspace. Opt-in live calls require an approved spend ceiling before execution.

Report separately: amount exact-match, account/party/debt-name exact-match, financial kind match after interpretation, material clarification match, silent consequential guesses, word-error rate, timeout/failure rate and recovery success. A JSON-valid transcript is not financial success. Every consequential error must become correction or clarification before review; zero silent consequential errors in the release corpus is the minimum gate, not a guarantee for all users. Report numerator/denominator per speaker/device/noise subgroup. Any failure blocks quality approval pending fix and rerun.

Manual device matrix: explicit permission; deny; cancel pending permission then allow late; stop/cancel; replacement; discard retaining words; private download; close while recording/uploading; unsupported WebM browser; insecure non-local HTTP; device disconnect; offline; empty speech; 60-second and 3 MB boundaries. Verify microphone indicator off after close/stop. Never simulate success in the product.

Common pipeline inspection: VoiceCapture calls onTranscript only on Use reviewed words; CashNarra changeDraft appends those words and navigates to capture. Interpretation, material clarification, review and deterministic authoritative save are the existing text pipeline. No POST /api/workspaces occurs from VoiceCapture or /api/transcribe. Typed input is always reachable.
