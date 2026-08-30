import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const socketId = data.get("socket_id") as string;
    const channel = data.get("channel_name") as string;

    // Presence channels require a user_id
    // We generate a random one for anonymous users
    const presenceData = {
      user_id: Math.random().toString(36).substring(2, 10),
      user_info: {},
    };

    const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
    return new Response(JSON.stringify(authResponse), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Pusher auth error:", error);
    return new Response("Forbidden", { status: 403 });
  }
}
