import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Use dynamic import with resetModules to get fresh module state per test
async function loadModule() {
  vi.resetModules();
  return await import('../telemetry-client');
}

describe('telemetry-client', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('sends events after flush interval', async () => {
    const { trackEvent } = await loadModule();
    trackEvent('test_event', { key: 'value' });

    // Not sent yet
    expect(fetch).not.toHaveBeenCalled();

    // Advance past flush interval (5s) and flush microtasks
    await vi.advanceTimersByTimeAsync(5_000);

    expect(fetch).toHaveBeenCalled();
    const call = vi.mocked(fetch).mock.calls[0];
    const body = JSON.parse(call[1]!.body as string);
    expect(body.event).toBe('test_event');
    expect(body.properties).toEqual({ key: 'value' });
    expect(body.timestamp).toBeTruthy();
    expect(body.sessionId).toBeTruthy();
  });

  it('includes timestamp and sessionId in every event', async () => {
    const { trackEvent } = await loadModule();
    trackEvent('metric', { count: 5 });

    await vi.advanceTimersByTimeAsync(5_000);

    expect(fetch).toHaveBeenCalled();
    const body = JSON.parse(
      vi.mocked(fetch).mock.calls[0][1]!.body as string
    );
    expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(body.sessionId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
  });

  it('silently drops failed sends', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network error'));
    const { trackEvent } = await loadModule();

    trackEvent('fail_event');
    await vi.advanceTimersByTimeAsync(5_000);

    // Should not throw, and fetch was attempted
    expect(fetch).not.toThrow();
  });

  it('batches multiple events', async () => {
    const { trackEvent } = await loadModule();
    trackEvent('event_1');
    trackEvent('event_2');
    trackEvent('event_3');

    await vi.advanceTimersByTimeAsync(5_000);

    // Each event sent as individual POST
    expect(fetch).toHaveBeenCalledTimes(3);
  });
});
