# AI Insights Runbook

One-page triage guide for the AI employee insights feature in production.

---

## Quick Health Check

1. **Server health**: `GET /health` — should return `200`
2. **Telemetry feed**: `GET /api/telemetry` — verify `ai_*` events are flowing
3. **Feature flag**: Console: `localStorage.getItem('ff_AI_INSIGHTS_ENABLED')` — should be `"true"`

---

## Symptom → Cause → Action

### AI insights not loading (spinner persists)

| Check | How | Fix |
|-------|-----|-----|
| Consent token exists | Network tab → look for `POST /api/ai/consent` response | If missing: user hasn't granted consent. The ConsentPrompt should be visible — this is normal first-visit behavior |
| Token expired | `403` response on `/api/ai/insights/` | The app auto-renews 5 min before expiry. If renewal failed, the user sees the consent prompt again |
| Feature flag off | Console: `localStorage.getItem('ff_AI_INSIGHTS_ENABLED')` | Set to `"true"` or use the dev toggle (gear icon, bottom-right) |
| Client timeout | Network tab shows aborted request after ~8s | Working as designed. User sees "Insight generation timed out" with a retry button. If consistently slow, check server health |

### "Rate limit exceeded" error

| Check | How | Fix |
|-------|-----|-----|
| AI rate limit hit | `429` response with `Retry-After` header | The app shows a countdown. Wait, then retry. Default: 10 requests/min per IP |
| Frequency | Filter telemetry for `ai_insight_error` where `errorType: "rate_limit"` | If frequent: reduce AI request frequency or increase `AI_RATE_LIMIT` in server config |

### PII appearing in AI summaries

**Severity: HIGH — this should never happen.**

| Check | How | Fix |
|-------|-----|-----|
| Filter working? | Search telemetry for `ai_pii_redacted` events | If events exist: the filter caught it. `[REDACTED]` should appear in the UI |
| Filter bypassed? | Verify `filterPII()` is called in `useAIInsights.ts` before `setInsight()` | If missing: **critical bug**. Hotfix immediately |
| New PII pattern? | Inspect raw AI response in Network tab | If PII is in an unrecognized format: add the regex to `src/lib/pii-filter.ts`, add a test, deploy |

**Monitoring**: Alert if `ai_pii_redacted` events exceed 20% of `ai_insight_received` — indicates the AI model is leaking PII above the expected ~15% rate.

### Low confidence warnings appearing frequently

| Check | How | Fix |
|-------|-----|-----|
| Expected rate | ~10% of responses have confidence < 0.3 | If within range: normal. The warning UI is working as designed |
| Rate increasing | Filter telemetry `ai_insight_received`, check `confidence` distribution | If significantly above 10%: AI model may be degrading. Escalate to AI/ML team |

### Consent token errors (401/403 loop)

| Check | How | Fix |
|-------|-----|-----|
| Token in request | Network tab → verify `X-Consent-Token` header on insight requests | If missing: consent state was cleared. Check `ConsentContext` is mounted in the component tree |
| Token not recognized | `403` with "not recognized" message | Server may have restarted (tokens are in-memory). User needs to re-consent |
| Auto-renewal | Look for periodic `POST /api/ai/consent` every ~55 min | If not renewing: check `consent.ts` `scheduleRenewal()` timer |

---

## Key Telemetry Events

| Event | What to Watch | Alert Threshold |
|-------|---------------|-----------------|
| `ai_insight_error` | Error rate by `errorType` | > 20% of requests |
| `ai_pii_redacted` | PII detection rate + `redactedTypes` | > 20% of insights |
| `ai_insight_received` | `latencyMs` p95, `confidence` distribution | p95 latency > 5s |
| `ai_consent_granted` | Consent adoption rate | Declining trend |

---

## Escalation Path

1. **PII leak (filter bypass)** → **Immediate hotfix** + security team
2. **AI model quality degradation** (low confidence spike, irrelevant summaries) → AI/ML team
3. **Server errors / rate limiting** → Infrastructure/SRE team
4. **Consent/compliance questions** → Legal + product team
