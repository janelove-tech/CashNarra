# Model check — 2026-10-16

Read official pages (documentation only; no API call):
- https://developers.openai.com/api/docs/models/gpt-4.1-mini
- https://developers.openai.com/api/docs/deprecations

The configured snapshot gpt-4.1-mini-2025-04-14 remains listed, supports Responses and structured outputs, but is deprecated as of October 14, 2026 with shutdown January 14, 2027. The recommended replacement is gpt-6-luna. Keep OPENAI_MODEL configurable and retain the currently available snapshot for this phase. A replacement must be evaluated against the same corpus before shutdown. This is not a quality or account-access claim.

Corpus context: synthetic fixture() Ama Works Business workspace, date 2026-10-13. Correction case selects the existing delivery expense. Cases specify acceptable expected meaning or required clarification; they are not mocked model successes. The fixtures must never be promoted into a general hardcoded interpreter. For personal-workspace tests change workspace type explicitly, not narration authority.

2026-10-17 comparative evidence: the deprecated snapshot failed four synthetic runs despite instruction improvements. gpt-6-luna passed the unchanged 28-case corpus using the retained explicit-field-rule prompt. See 08-evaluation-runner.md for private run identifiers, costs, reviewed references and limitations. Production defaults remain unchanged; this is evaluation evidence, not an enablement instruction or representative voice approval.
