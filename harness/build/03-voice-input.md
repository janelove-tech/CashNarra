# Phase 03 — Voice input V1

## Purpose

Voice is required in the first version. It is another input into the existing narration pipeline, not a second financial interpreter.

## Required flow

```text
record → transcribe → editable transcript → narration interpretation
→ clarification → review → user confirmation → deterministic save
```

Typed narration remains available. Voice must not post automatically. Transcription is not confirmation.

## Preserve first

Inspect the current recorder, upload limits, WebM/Opus validation, and transcription route. Reuse them where they are correct. Historical docs disabled voice pending quality approval. The 16 October 2026 user decision overrides deferral, but it does not override the quality gate or the no-automatic-post rule.

## Recording

Verify or fix: microphone only after explicit action; denied permission; pending-permission cancellation; late grant cleanup; start, stop, cancel, playback, replacement, discard; private download if the design includes it; close behaviour; unsupported browser fallback; secure-context behaviour; no automatic upload or post.

## Audio validation

Keep streamed size limits, duration limits, format checks, intended WebM/Opus handling, and rejection of malformed, truncated, and unsupported containers. Timeouts and abort/cancel must fail closed.

## Transcription

Server-side provider call, bounded request, provider errors, empty transcript, malformed provider response, editable transcript, and correction before interpretation.

## Quality evaluation

Write a representative plan using synthetic or consented material: Ghanaian English accents, GH₵ amounts, MoMo, business terms, common Ghanaian names, natural speed, modest noise, and mixed multi-event sequences. Do not claim local-language or code-switching support unless it is explicitly implemented and evaluated. Voice is not production-ready until measured quality evidence exists. Typed narration stays the fallback.

## Acceptance

- The flow above is the only voice save path.
- Recording and validation tests cover the cases above, with honest NOT RUN where a physical microphone or provider was unavailable.
- Quality evaluation is recorded as PASS, FAIL, NOT RUN, or EXTERNAL.
- Text fallback remains usable when voice is unavailable.
