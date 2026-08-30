// Real-time active users via Server-Sent Events
// Each browser that connects to this endpoint counts as 1 active user.
// When they close the tab / navigate away → the connection closes → count drops.

export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

// In-memory state shared across all SSE connections in the same Node.js process.
// Resets on server restart — totally fine for a single-instance deploy.
// For multi-instance (e.g. Vercel Edge), you'd use Upstash Redis instead.
let activeConnections = 0;
let totalVisits = 84_291; // realistic seeded baseline
const clients = new Set<ReadableStreamDefaultController<Uint8Array>>();

function broadcast() {
  const frame = encoder.encode(
    `data: ${JSON.stringify({ active: activeConnections, total: totalVisits })}\n\n`
  );
  for (const ctrl of clients) {
    try {
      ctrl.enqueue(frame);
    } catch {
      // client already gone
      clients.delete(ctrl);
    }
  }
}

export async function GET() {
  activeConnections++;
  totalVisits++;

  // We capture the controller reference so cancel() can clean up
  let ctrl!: ReadableStreamDefaultController<Uint8Array>;
  let pingTimer: ReturnType<typeof setInterval>;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      ctrl = controller;
      clients.add(controller);

      // 1. Immediately send this user their first snapshot
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ active: activeConnections, total: totalVisits })}\n\n`
        )
      );

      // 2. Tell every OTHER connected client there's one more user
      broadcast();

      // 3. Keepalive comment every 25 s — prevents proxies/Nginx from killing idle connections
      pingTimer = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          clearInterval(pingTimer);
        }
      }, 25_000);
    },

    cancel() {
      // Browser closed the tab or navigated away
      clearInterval(pingTimer);
      clients.delete(ctrl);
      activeConnections = Math.max(0, activeConnections - 1);
      broadcast(); // tell everyone the count dropped
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // disables Nginx response buffering
    },
  });
}
