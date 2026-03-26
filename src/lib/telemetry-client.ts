/**
 * Telemetry client — batches events in memory and flushes to POST /api/telemetry.
 *
 * - Events are flushed every 5 seconds
 * - On page unload, remaining events are sent via navigator.sendBeacon
 * - Each event is enriched with a timestamp and sessionId
 * - IMPORTANT: Never include PII (search text, names, emails) in event properties
 */

import type { TelemetryEvent } from '@/types';

const TELEMETRY_URL = 'http://localhost:4000/api/telemetry';
const FLUSH_INTERVAL_MS = 5_000;

// Generate a unique session ID per page load
const sessionId = crypto.randomUUID();

let eventQueue: TelemetryEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;

/**
 * Track a telemetry event. Events are batched and flushed periodically.
 */
export function trackEvent(event: string, properties?: Record<string, unknown>): void {
  eventQueue.push({
    event,
    properties,
    timestamp: new Date().toISOString(),
    sessionId,
  });

  // Start the flush timer on first event
  if (!flushTimer) {
    flushTimer = setInterval(flush, FLUSH_INTERVAL_MS);
  }
}

/**
 * Flush all queued events to the server.
 */
async function flush(): Promise<void> {
  if (eventQueue.length === 0) return;

  const batch = eventQueue;
  eventQueue = [];

  // Send each event individually (server expects single objects)
  const promises = batch.map((evt) =>
    fetch(TELEMETRY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evt),
    }).catch(() => {
      // Silently drop failed telemetry — never block the user
    })
  );

  await Promise.all(promises);
}

/**
 * Flush remaining events via sendBeacon on page unload.
 * sendBeacon is reliable for unload scenarios where fetch might be cancelled.
 */
function flushOnUnload(): void {
  for (const evt of eventQueue) {
    try {
      navigator.sendBeacon(
        TELEMETRY_URL,
        new Blob([JSON.stringify(evt)], { type: 'application/json' })
      );
    } catch {
      // Best effort — ignore failures
    }
  }
  eventQueue = [];
}

// Register unload handler
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushOnUnload();
    }
  });
}
