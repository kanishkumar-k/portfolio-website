import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent`;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    // In-memory per-day attempt limit (resets on server restart)
    const aiAttemptStore: { [date: string]: number } = (globalThis as any).aiAttemptStore || {};
    (globalThis as any).aiAttemptStore = aiAttemptStore;
    const today = new Date().toISOString().slice(0, 10);
    if (!aiAttemptStore[today]) aiAttemptStore[today] = 0;
    if (aiAttemptStore[today] >= 3) {
      return NextResponse.json({ error: "AI support is temporarily not available" }, { status: 429 });
    }
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key not set due to limited access" }, { status: 500 });
    }

    const { subject, context } = await req.json();

    const prompt = `
You are an expert email writer. Given the following subject and context, generate:
- A concise, relevant email subject line (2-4 words, no punctuation, no greetings, no closing, no quotes).
- A friendly, concise email body in just 2 lines, based on the subject and context.
Do not add introduction or closing statements. Only provide the subject and body as shown below.

Context: ${context || "(no additional context)"}

Format your response exactly as:
Subject: <subject line>
Body: <email body, 2 lines>

`;

    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    // Increment attempt count only on successful API call
    aiAttemptStore[today] += 1;

    if (!geminiRes.ok) {
      let errorMsg = "";
      let errorCode = geminiRes.status;
      try {
        const errorJson = await geminiRes.json();
        errorMsg = errorJson?.error?.message || JSON.stringify(errorJson);
      } catch {
        errorMsg = await geminiRes.text();
      }
      // If error code starts with 4 or 5, show AI support unavailable
      if (errorCode >= 400 && errorCode < 600) {
        return NextResponse.json(
          { error: "AI support is temporarily not available" },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: "Gemini API error: " + errorMsg }, { status: 500 });
    }

    const geminiData = await geminiRes.json();
    const aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // Try to extract subject and body from the AI response
    let aiSubject = "";
    let aiBody = aiText;
    const subjectMatch = aiText.match(/Subject\s*:\s*(.+)/i);
    const bodyMatch = aiText.match(/Body\s*:\s*([\s\S]*)/i);

    if (subjectMatch && bodyMatch) {
      aiSubject = subjectMatch[1].trim();
      aiBody = bodyMatch[1].trim();
    } else if (subjectMatch) {
      aiSubject = subjectMatch[1].trim();
      aiBody = aiText.replace(subjectMatch[0], "").trim();
    }

    return NextResponse.json({ subject: aiSubject, body: aiBody });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
