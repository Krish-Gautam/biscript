export async function POST(req) {
  try {
    const body = await req.json();
    console.log("➡️ Request to Piston:", body);

    const res = await fetch("http://localhost:2000/api/v2/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("⬅️ Response from Piston:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error in /api/piston/runCode:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
