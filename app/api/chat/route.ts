import { NextResponse } from "next/server";
import { KNOWLEDGE } from "./knowledge";

export const runtime = "nodejs";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ReqBody = {
  messages: ChatMessage[];
};

/**
 * SYSTEM PROMPT
 * This is effectively your "training"
 */
const SYSTEM_PROMPT = `
You are CODEEEE AI Consultant.

ROLE
- You advise small businesses on websites, software, and automation.
- You help them choose the right solution, not oversell.

TONE
- Calm
- Technical
- Confident
- Concise
- Light terminal style (use "> " for headings when useful)

STRICT RULES
- Use ONLY the company knowledge provided.
- Never invent clients, projects, metrics, or case studies.
- Never promise prices or timelines without explaining dependencies.
- If unsure, say it requires a consultation.
- Do NOT act like a human employee.
- Do NOT do sales hype.

PRICING RULES
- Give ranges only.
- Always explain what affects cost.
- Ask clarifying questions before suggesting scope.

RESPONSE STYLE
- Prefer bullet points (▸)
- Keep responses under ~12 lines unless necessary
- Ask at most 2 follow-up questions
- End with a next step suggestion (consultation or WhatsApp)

COMPANY KNOWLEDGE:
${KNOWLEDGE}
`.trim();

/**
 * Call Ollama (local, free)
 */
async function callOllama(messages: ChatMessage[]) {
  const res = await fetch("http://127.0.0.1:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL || "llama3",
      messages,
      stream: false,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data?.message?.content || "";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ReqBody;

    if (!Array.isArray(body.messages)) {
      return NextResponse.json(
        { ok: false, error: "Invalid messages payload" },
        { status: 400 }
      );
    }

    // Inject system prompt + user conversation
    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...body.messages,
    ];

    const reply = await callOllama(messages);

    return NextResponse.json({
      ok: true,
      text: reply,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "Chat service failed",
      },
      { status: 500 }
    );
  }
}