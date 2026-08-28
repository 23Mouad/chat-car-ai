import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/systemPrompt";
import type { ChatMessage, UserProfile } from "@/types/chat";
import OpenAI from "openai";

// Instantiate directly in route to avoid module-level env errors during build
function getClient() {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error("NVIDIA_API_KEY is not set");
  return new OpenAI({
    apiKey,
    baseURL: process.env.NVIDIA_BASE_URL ?? "https://integrate.api.nvidia.com/v1",
  });
}

const MODEL = process.env.NVIDIA_MODEL ?? "deepseek-ai/deepseek-v4-pro-0813";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages,
      profile,
    }: { messages: ChatMessage[]; profile: Partial<UserProfile> } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(profile ?? {});

    const apiMessages = [
      { role: "system" as const, content: systemPrompt },
      // Filter out empty assistant placeholder messages before sending
      ...messages
        .filter((m) => m.content.trim() !== "")
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
    ];

    const openai = getClient();

    // @ts-expect-error – NVIDIA-specific extension not in OpenAI types
    const stream = await openai.chat.completions.create({
      model: MODEL,
      messages: apiMessages,
      temperature: 0.9,
      top_p: 0.95,
      max_tokens: 1024,
      stream: true,
      // Disable chain-of-thought thinking for faster, cleaner responses
      chat_template_kwargs: { thinking: false },
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content ?? "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (err) {
          console.error("Stream error:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
