// Real-time active users via Server-Sent Events.
// Active connections = true live concurrent users (in-memory, resets on deploy — this is fine).
// Total visits = persistent, stored in Upstash Redis REST API (survives deploys).
//
// Required env vars:
//   UPSTASH_REDIS_REST_URL  — e.g. https://us1-xxx.upstash.io
//   UPSTASH_REDIS_REST_TOKEN — from your Upstash dashboard
//
// If env vars are missing, totalVisits falls back to an in-memory counter.

export const dynamic = "force-dynamic";

const encoder = new TextEncoder();
const VISITS_KEY = "tc:total_visits";

// ── Upstash Redis helpers (raw REST — no package needed) ──────────────────────
async function redisGet(key: string): Promise<number> {
  const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } = process.env;
  if (!url || !token) return 0;
  try {
    const res = await fetch(`${url}/get/${key}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const json = await res.json() as { result: string | null };
    return parseInt(json.result ?? "0", 10) || 0;
  } catch {
    return 0;
  }
}

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

// ── In-memory fallback (used when Redis env vars are absent) ──────────────────
let memVisits = 0;

// ── In-memory active connections (real-time, this process only) ───────────────
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

export async function GET() {
  // Increment real persistent visit count
  const totalVisits = await redisIncr(VISITS_KEY);
  activeConnections++;

  let ctrl!: ReadableStreamDefaultController<Uint8Array>;
  let pingTimer: ReturnType<typeof setInterval>;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      ctrl = controller;
      clients.add(controller);

      // 1. Send this user their first snapshot
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ active: activeConnections, total: totalVisits })}\n\n`
        )
      );

      // 2. Broadcast updated active count to all other clients
      broadcast(activeConnections, totalVisits);

      // 3. Keepalive every 25 s — prevents Nginx / Vercel from closing idle streams
      pingTimer = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          clearInterval(pingTimer);
        }
      }, 25_000);
    },

    cancel() {
      clearInterval(pingTimer);
      clients.delete(ctrl);
      activeConnections = Math.max(0, activeConnections - 1);
      // Note: we don't decrement totalVisits — a visit already happened
      broadcast(activeConnections, totalVisits);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
