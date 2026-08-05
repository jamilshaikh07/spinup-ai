export const dynamic = "force-dynamic";

import OpenAI from "openai";

export async function POST(req: Request) {
  const client = new OpenAI({
    baseURL: process.env.ROUTEPLANE_BASE_URL,
    apiKey: process.env.ROUTEPLANE_API_KEY,
  });
  const { messages, model } = await req.json();

  const stream = await client.chat.completions.create({
    model: model ?? "claude-sonnet-4-5",
    messages,
    stream: true,
    max_tokens: 4096,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
