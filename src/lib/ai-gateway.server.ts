// Server-only Lovable AI Gateway helper.
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callLovableAI(opts: {
  model?: string;
  messages: ChatMessage[];
  jsonMode?: boolean;
}): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY is not configured");

  const body: Record<string, unknown> = {
    model: opts.model ?? "google/gemini-3-flash-preview",
    messages: opts.messages,
  };
  if (opts.jsonMode) body.response_format = { type: "json_object" };

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "raw-fetch",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please top up your workspace billing.");
    throw new Error(`AI gateway error ${res.status}: ${text.slice(0, 300)}`);
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI gateway returned an empty response");
  return content;
}
