// Real-time active users via Server-Sent Events.
//
// Key reliability fix: we use `request.signal` (AbortSignal) for disconnect detection.
// On Vercel, this fires promptly when the browser tab closes or navigates away.
// ReadableStream cancel() is kept as a fallback for non-serverless environments.
// A `cleaned` flag prevents double-decrement if both fire.
//
// Required env vars for persistent visit count:
//   UPSTASH_REDIS_REST_URL   — e.g. https://us1-xxx.upstash.io
//   UPSTASH_REDIS_REST_TOKEN — from your Upstash dashboard
//
// If env vars are missing, totalVisits falls back to in-memory (resets on deploy).

export const dynamic = "force-dynamic";

const encoder = new TextEncoder();
const VISITS_KEY = "tc:total_visits";

// ── Upstash Redis helpers (raw REST — no package needed) ──────────────────────
async function redisIncr(key: string): Promise<number> {
  const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } = process.env;
  if (!url || !token) return ++memVisits;
  try {
    const res = await fetch(`${url}/incr/${key}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const json = await res.json() as { result: number };
    return json.result ?? 0;
  } catch {
    return ++memVisits;
  }
}

// In-memory fallback when Redis env vars are absent
let memVisits = 0;

// ── In-memory active connections (real-time concurrent users) ─────────────────
let activeConnections = 0;
const clients = new Set<ReadableStreamDefaultController<Uint8Array>>();

function broadcast(active: number, total: number) {
  const frame = encoder.encode(
    `data: ${JSON.stringify({ active, total })}\n\n`
  );
  for (const ctrl of clients) {
    try {
      ctrl.enqueue(frame);
    } catch {
      clients.delete(ctrl);
    }
  }
}

export async function GET(request: Request) {
  const totalVisits = await redisIncr(VISITS_KEY);
  activeConnections++;

  let ctrl!: ReadableStreamDefaultController<Uint8Array>;
  let pingTimer: ReturnType<typeof setInterval>;
  // Guard: prevents double-cleanup if both AbortSignal and cancel() fire
  let cleaned = false;

  function cleanup() {
    if (cleaned) return;
    cleaned = true;
    clearInterval(pingTimer);
    clients.delete(ctrl);
    activeConnections = Math.max(0, activeConnections - 1);
    broadcast(activeConnections, totalVisits);
  }

  // ── PRIMARY disconnect detection: request.signal ──────────────────────────
  // Vercel fires this reliably when the browser tab closes or navigates away.
  request.signal.addEventListener("abort", cleanup, { once: true });

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      ctrl = controller;
      clients.add(controller);

      // Send this visitor's first snapshot immediately
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ active: activeConnections, total: totalVisits })}\n\n`
        )
      );

      // Notify all other open tabs of the updated active count
      broadcast(activeConnections, totalVisits);

      // Keepalive ping every 15 s — prevents proxy timeouts
      // Shorter than before so stale write-failures are caught sooner
      pingTimer = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          // Write failed → client is gone but AbortSignal didn't fire (fallback path)
          cleanup();
        }
      }, 15_000);
    },

    // ── FALLBACK disconnect detection: ReadableStream cancel ─────────────────
    // Fires in non-serverless / Node.js environments where AbortSignal may not work.
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // disable Nginx buffering
    },
  });
}
