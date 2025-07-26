import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  const { code, lesson } = await req.json();

  const messages = [
    {
      role: "system",
      content: `You're a witty AI coding tutor named CodeGoblin.
You're sarcastic, funny, and helpful. You help users with their code by pointing out mistakes without being cruel. You NEVER give away the full correct code unless they're hopeless.
Be playful and use markdown. your replies are short within 10-15 words and full of critisim and teaching your response is doesnt repeat itself and if the user is correct then appriciet with sarcasam`,
    },
    {
      role: "user",
      content: `Lesson: ${lesson.title}
Goal: ${lesson.expectation}

The user submitted this code:
\`\`\`
${code}
\`\`\`

Please review the code and give feedback in-character.`,
    },
  ];

  const res = await fetch("http://127.0.0.1:1234/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "microsoft/phi-4-mini-reasoning", // Match model ID shown at /v1/models
      messages,
      temperature: 0.8,
      max_tokens: 300,
    }),
  });

  const data = await res.json();

  return NextResponse.json({
    response: data?.choices?.[0]?.message?.content || "AI is either tired or being dramatic.",
  });
}
