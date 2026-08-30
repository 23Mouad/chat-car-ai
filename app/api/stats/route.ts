// Real-time active users via Server-Sent Events.
// 100% in-memory, no database required.
//
// Key fix: deduplication by `clientId`.
// On page refresh, the browser drops the old connection and starts a new one,
// but the server might take up to 15s to notice the old one dropped (if AbortSignal fails).
// By tracking connections by a unique client ID, a refresh instantly replaces the old
// connection, preventing the count from jumping up artificially.

export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

// In Next.js dev mode, global variables get reset on every hot reload.
// To prevent memory leaks of old connections, we attach our Map to the global object.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalWithStats = global as any;

if (!globalWithStats.sseClients) {
  globalWithStats.sseClients = new Map<string, ReadableStreamDefaultController<Uint8Array>>();
}
const clients: Map<string, ReadableStreamDefaultController<Uint8Array>> = globalWithStats.sseClients;

function broadcast() {
  const activeCount = clients.size;
  const frame = encoder.encode(`data: ${JSON.stringify({ active: activeCount })}\n\n`);
  for (const [id, ctrl] of clients.entries()) {
    try {
      ctrl.enqueue(frame);
    } catch {
      clients.delete(id);
    }
  }
}

export async function GET(request: Request) {
  // Extract unique clientId from query params (e.g. ?clientId=abc-123)
  const url = new URL(request.url);
  const clientId = url.searchParams.get("clientId") || Math.random().toString(36).substring(7);

  // If this client is already connected (e.g., they refreshed the page),
  // forcefully close their old connection to prevent double-counting.
  if (clients.has(clientId)) {
    try {
      clients.get(clientId)?.close();
    } catch {
      // ignore
    }
    clients.delete(clientId);
  }

  let ctrl!: ReadableStreamDefaultController<Uint8Array>;
  let pingTimer: ReturnType<typeof setInterval>;
  let cleaned = false;

  function cleanup() {
    if (cleaned) return;
    cleaned = true;
    clearInterval(pingTimer);
    
    // Only delete if the current connection in the map is THIS connection
    // (prevents deleting a new connection if a refresh happened instantly)
    if (clients.get(clientId) === ctrl) {
      clients.delete(clientId);
      broadcast();
    }
  }

  request.signal.addEventListener("abort", cleanup, { once: true });

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      ctrl = controller;
      clients.set(clientId, controller);

      // Tell everyone (including this new client) the updated count
      broadcast();

      // Keepalive ping every 10s — catches dead connections fast if AbortSignal misses
      pingTimer = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          cleanup();
        }
      }, 10_000);
    },
    cancel() {
      cleanup();
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
