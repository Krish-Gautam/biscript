import { supabase } from "@/app/utils/supabaseClient";


export async function POST(req) {
  const { userId, message } = await req.json();

  // 1️⃣ Fetch the user state
  const { data: userState } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .single();

  // 2️⃣ Build the prompt
  const dynamicPrompt = `
You are Biscript: a funny coding tutor AI.
Student data:
First visit: ${userState.first_visit}
Achievements: ${userState.achievements.join(", ")}
Last lesson: ${userState.last_lesson}
Points: ${userState.points}

When replying:
- Be short (<=2 sentences)
- Add light humor
- Suggest next challenge if user mastered current topic

Student says: ${message}
`;

  // 3️⃣ Query Ollama
  const response = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "llama3", prompt: dynamicPrompt }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let output = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter(Boolean);
    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        if (json.response) output += json.response;
      } catch {}
    }
  }


  return new Response(JSON.stringify({ reply: output }), {
    headers: { "Content-Type": "application/json" },
  });
}
