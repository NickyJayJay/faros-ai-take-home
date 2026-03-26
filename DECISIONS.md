# Decision Document

## 1. Architecture Choices

### Framework: React 19 + TypeScript + Vite

React was recommended by the exercise and is what I'm most productive in. TypeScript was non-negotiable for a project with complex API contracts — the GraphQL types, AI response shapes, and PII filter results all benefit from compile-time safety. Vite was chosen over Next.js because there's no SSR requirement and Vite's dev server is significantly faster.

### Data Layer: Apollo Client v4

The GraphQL API with cursor-based pagination and filter arguments maps directly to Apollo's strengths. Key decisions:

- **RetryLink** with exponential backoff (300ms initial, 3s max, jitter) handles the mock server's 5% error rate transparently. Users never see transient 5xx failures.
- **`keyArgs: ['search', 'filter']`** on the `employees` field ensures Apollo caches separate result sets per search/filter combination while sharing pagination within each set.
- **No Redux.** Apollo's `InMemoryCache` owns all server state. The two React Contexts (consent + feature flags) are lightweight, narrow-purpose, and update infrequently — they don't warrant a global store.

### Styling: Tailwind CSS v4 + shadcn/ui

Tailwind provides rapid styling with design-system consistency. shadcn/ui (built on @base-ui/react primitives) gives accessible, unstyled component foundations — Popover, Collapsible, Checkbox, etc. — that I can style to match the Figma without fighting a component library's opinions. Every interactive component uses shadcn primitives.

### State Management: Apollo Cache + React Context + Local State

Three tiers, each fit for purpose:

| Tier            | What                                                | Why                                                                  |
| --------------- | --------------------------------------------------- | -------------------------------------------------------------------- |
| Apollo Cache    | Employees, filter options, detail data              | Server state with automatic cache invalidation                       |
| React Context   | Consent token, feature flags                        | App-wide concerns accessed from many components; update infrequently |
| useState/useRef | Search input, pagination cursors, selected employee | Component-scoped UI state                                            |

## 2. AI Development Environment and Workflow

### Setup

I used **Claude Code** (Anthropic's CLI) as my primary AI development tool throughout the project. The workflow:

1. I provided Claude Code with the full README, mock server source (`server.js`, `resolvers.js`, `ai-simulator.js`, `chaos.js`), and all 9 Figma screenshots to establish complete project context.
2. I built incrementally — one step at a time (scaffolding → types → table → search → filters → pagination → detail panel → AI → flags → telemetry → error boundaries → tests → docs), committing after each step.
3. Each step, I reviewed the generated code, tested it visually against the Figma, and requested corrections before proceeding.

### Where AI Output Required Correction

- **Apollo Client v4 migration**: Claude initially generated v3 API patterns (`import { ApolloProvider } from '@apollo/client'`, `graphQLErrors`/`networkError` destructuring in error link). These don't exist in v4. I had to inspect `node_modules` type definitions to find the correct v4 imports (`@apollo/client/react`, `@apollo/client/core`, `CombinedGraphQLErrors.is(error)` pattern).
- **shadcn/ui integration**: The initial implementation used raw HTML elements instead of shadcn primitives. I caught this mid-build and requested a full refactor to use shadcn consistently. The lesson: I should have specified shadcn usage in the initial prompt rather than assuming it from the tech stack discussion.
- **Skeleton loading gap**: The AI insights skeleton wasn't showing on initial panel open (only on regenerate). The root cause was a render gap: `loading` initialized to `false` while the `useEffect` hadn't fired yet. I identified the issue and had Claude fix the render condition to show the skeleton when consented but no insight or error exists yet.

### What I'd Change for a Longer-Lived Project

- Set up a `CLAUDE.md` project file with architecture conventions, component patterns, and testing expectations so every session starts with full context.
- Use Claude Code's hook system to auto-run `tsc --noEmit` on file saves.
- Establish a PR review workflow where Claude reviews diffs against the project's coding standards.

## 3. Data and API Challenges

### Chaos Middleware (5% error rate, 50-800ms latency, rate limiting)

The mock server intentionally injects failures. My approach:

- **RetryLink** on Apollo Client handles GraphQL errors with 3 retries + exponential backoff. Users never see transient failures.
- **Debounced search (300ms)** prevents hammering the API under rate limits. Without this, rapid typing could exhaust the rate limit.
- **AbortController with 8s client-side timeout** on AI requests. The server's timeout simulation takes 10-20s — I cut it off at 8s so users aren't left waiting with no feedback.

### AI PII Contamination (15% rate)

The AI simulator injects PII into ~15% of responses: phone numbers, SSNs, personal emails, home addresses, and dates of birth. This is the most critical challenge in the exercise.

My `pii-filter.ts` runs as a pure function **before any AI text reaches the DOM**:

- 5 regex patterns covering all injection types from the simulator (SSN `xxx-xx-xxxx`, phone `(xxx) xxx-xxxx` and `xxx-xxx-xxxx`, personal email `*.personal*@gmail.com`, address `number Street, City, ST zip`, DOB with "Date of birth"/"DOB" context)
- Returns sanitized text + metadata about what was redacted
- Metadata is logged to telemetry (redaction types only, never the actual PII values)
- The filter is idempotent and tested with 20 test cases including edge cases and false-positive checks

### AI Low Confidence (10% rate)

Responses with confidence < 0.3 get a prominent amber warning: "Low confidence — this insight may not be reliable." The text is dimmed. Responses between 0.3–0.7 show a medium confidence indicator. This gives users the information to make their own judgment without hiding content.

## 4. Privacy and Security

### PII Filtering

The single most important safety measure. AI-generated text is **never rendered without passing through `filterPII()`**. The filter:

- Catches all PII patterns the simulator produces
- Replaces matches with `[REDACTED]`
- Logs redaction types to telemetry for monitoring (e.g., "ssn detected") — but **never logs the actual PII value**
- Shows a user-facing notice when redaction occurred: "Some personally identifiable information was automatically redacted from this insight."

### Consent Token Storage

The consent token is stored in **React Context (in-memory) only**, not localStorage. Rationale:

- Tokens are session-scoped (1 hour expiry) — they don't need to survive page refresh
- Storing auth-adjacent tokens in localStorage exposes them to XSS
- The consent module handles auto-renewal 5 minutes before expiry

### Telemetry Privacy

Telemetry tracks **behavior, not content**:

- Search events log `resultCount` but **never the search text** (could contain employee names)
- PII redaction events log the `redactedTypes` array but **never the redacted values**
- AI insight events log `confidence` and `latencyMs` but not the summary text

## 5. What I'd Do with More Time

**Testing:**

- Component integration tests for the full AI consent → fetch → render flow
- E2E tests with Playwright covering the critical user journeys
- Visual regression tests for Figma fidelity

**Accessibility:**

- Full keyboard navigation audit (tab order, focus management in popovers/detail panel)
- ARIA live regions for loading states and error messages
- Screen reader testing with VoiceOver

**Production Infrastructure:**

- Replace localStorage feature flags with LaunchDarkly or a similar service (gradual rollouts, audience targeting)
- Structured telemetry with OpenTelemetry SDK instead of a custom client
- CSP headers and nonce-based script loading
- Code splitting — the bundle is 580KB gzipped; lazy-loading the AI components would help

**UX Enhancements:**

- Optimistic UI for filter changes (show expected results immediately, reconcile on response)
- Animate the detail panel slide-in/out
- Persist search/filter state in URL params for shareability
- Table column sorting (currently visual-only)

## 6. Testing Strategy

### Current Tests (38 passing)

Tests focus on the highest-value areas — the code that handles untrusted data:

| Suite                      | Tests | What It Covers                                                                                                                    |
| -------------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------- |
| `pii-filter.test.ts`       | 20    | Every PII pattern (SSN, phone, email, address, DOB), multiple PII in one text, edge cases, false-positive prevention, idempotency |
| `feature-flags.test.ts`    | 8     | Read/write, defaults, localStorage failures, unknown flags                                                                        |
| `consent.test.ts`          | 6     | Token fetch, caching, expiry, clearing, error handling                                                                            |
| `telemetry-client.test.ts` | 4     | Batching, flush interval, event schema, network error resilience                                                                  |

### CI Strategy

For a production CI pipeline, I would add:

1. **Unit tests** (current) — `vitest run` on every PR
2. **Type check** — `tsc --noEmit` as a gate
3. **Lint** — `eslint .` with strict config
4. **Component tests** — React Testing Library for critical flows (consent → AI fetch → PII filter → render)
5. **E2E tests** — Playwright against the mock server for full user journeys
6. **Bundle size check** — Fail if JS bundle exceeds threshold

### AI Content Testing Specifically

AI-generated content is the riskiest surface in this app. Testing priorities:

1. **PII filter exhaustiveness** — Test every pattern the server can inject, plus variations (different phone formats, edge-case SSNs). The filter must never let PII through.
2. **PII filter stability** — Ensure no false positives on normal employee activity text (dates, numbers, email addresses in summaries).
3. **Confidence thresholds** — Verify the UI changes at 0.3 and 0.7 boundaries.
4. **Error state coverage** — Every HTTP status the AI endpoint returns (401, 403, 429, 504, network failure) must have a tested UI path.
5. **Timeout behavior** — Verify the 8s client-side abort fires correctly and shows the timeout UI.
