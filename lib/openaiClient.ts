// Server-only OpenAI client — never import this in client components
import OpenAI from "openai";

if (!process.env.NVIDIA_API_KEY) {
  throw new Error("NVIDIA_API_KEY environment variable is not set");
}

export const openaiClient = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL ?? "https://integrate.api.nvidia.com/v1",
});

export const NVIDIA_MODEL =
  process.env.NVIDIA_MODEL ?? "nvidia/nemotron-3-super-120b-a12b";
