// Real-time active users via Server-Sent Events.
// Each open browser tab = +1. Tab close/navigate away = -1.
// 100% in-memory, no database required.
// Disconnect is detected via request.signal (AbortSignal) which Vercel fires
// promptly when the client closes the connection.

export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

let activeConnections = 0;
const clients = new Set<ReadableStreamDefaultController<Uint8Array>>();

function broadcast(count: number) {
  const frame = encoder.encode(`data: ${JSON.stringify({ active: count })}\n\n`);
  for (const ctrl of clients) {
    try {
      ctrl.enqueue(frame);
    } catch {
      clients.delete(ctrl);
    }
  }
}

export async function GET(request: Request) {
  activeConnections++;

  let ctrl!: ReadableStreamDefaultController<Uint8Array>;
  let pingTimer: ReturnType<typeof setInterval>;
  let cleaned = false;

  function cleanup() {
    if (cleaned) return;
    cleaned = true;
    clearInterval(pingTimer);
    clients.delete(ctrl);
    activeConnections = Math.max(0, activeConnections - 1);
    broadcast(activeConnections);
  }

  // Vercel fires this reliably when the tab closes or navigates away
  request.signal.addEventListener("abort", cleanup, { once: true });

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      ctrl = controller;
      clients.add(controller);

      // Send this visitor their current count immediately
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ active: activeConnections })}\n\n`)
      );

      // Tell every other open tab the count went up
      broadcast(activeConnections);

      // Keepalive ping every 15s — also catches dead connections if AbortSignal misses
      pingTimer = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          cleanup(); // write failed → client is already gone
        }
      }, 15_000);
    },

    cancel() {
      cleanup(); // fallback for non-Vercel environments
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
