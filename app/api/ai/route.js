let userState = {
  firstVisit: true,
  achievements: ["variablesMastered"],
  lastLesson: "variables",
};


export async function POST(req) {
  try {
    const { message } = await req.json();

    // Fixed + conditional lines
    let fixedLines = [];
    if (userState.firstVisit) {
      fixedLines.push("👋 Hello! Welcome to Biscript, your funny coding tutor!");
      userState.firstVisit = false;
    }
    if (userState.achievements.includes("loopsCompleted")) {
      fixedLines.push("🎉 I see you completed loops! Ready for some functions or recursion?");
    }

    // Build dynamic prompt
    const dynamicPrompt = `
You are Biscript: a funny coding tutor AI.
Rules:
- Always use humor
- Suggest next topics based on user achievements
- Keep answers concise keep it only 5-6 words
User state:
Achievements: ${userState.achievements.join(", ")}
Last lesson: ${userState.lastLesson}

User asks: ${message}
`;

    // Call Ollama API
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt: dynamicPrompt,
      }),
    });

    // Ollama streams NDJSON → collect into full string
    const reader = response.body.getReader();
    let result = "";
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true }).trim();
      const lines = chunk.split("\n").filter(Boolean);

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.response) result += json.response;
        } catch (e) {
          console.error("Bad JSON chunk:", line);
        }
      }
    }

    const dynamicLine = result || "Hmm, I got nothing 😅";
    const fullResponse = [...fixedLines, dynamicLine].join("\n");

    return new Response(JSON.stringify({ reply: fullResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("AI route error:", err);
    return new Response(JSON.stringify({ reply: "Error connecting to Ollama" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
