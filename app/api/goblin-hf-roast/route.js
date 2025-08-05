import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { code, lessonTrigger, expectedSkill } = await req.json();

    const prompt = `
You are a sarcastic programming tutor. The student is learning "${expectedSkill}" and wrote the following code:
\`\`\`
${code}
\`\`\`
Critique it with wit and technical accuracy in 2 sentences. Be mildly judgmental, like a disappointed mentor with high standards.
`;

    const HF_API_KEY = process.env.HF_API_KEY;

    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1", {
      method: "POST",
      headers: {
        Authorization: `Bearer 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`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          temperature: 0.8,
          max_new_tokens: 100,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API Error:", errorText);
      return NextResponse.json({ message: "Hugging Face API Error: " + errorText }, { status: 500 });
    }

    const data = await response.json();

    const message = Array.isArray(data) && data[0]?.generated_text
      ? data[0].generated_text
      : "The goblin saw nothing but darkness.";

    return NextResponse.json({ message });

  } catch (error) {
    console.error("Goblin API crash:", error);
    return NextResponse.json({ message: "Internal server error. Goblin tripped again." }, { status: 500 });
  }
}
