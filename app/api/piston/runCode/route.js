const LANGUAGE_MAP = {
  python: {
    language: "python",
    version: "3.10.0",
    file: "main.py",
  },
  javascript: {
    language: "javascript",
    version: "18.15.0",
    file: "main.js",
  },
  cpp: {
    language: "cpp",
    version: "10.2.0",
    file: "main.cpp",
  },
};

export async function POST(req) {
  try {
    const { source_code, language, stdin = "" } = await req.json();

    if (!source_code || !language) {
      return new Response(
        JSON.stringify({ error: "Missing source_code or language" }),
        { status: 400 }
      );
    }

    const langConfig = LANGUAGE_MAP[language];
    if (!langConfig) {
      return new Response(
        JSON.stringify({ error: "Unsupported language" }),
        { status: 400 }
      );
    }

    const pistonPayload = {
      language: langConfig.language,
      version: langConfig.version,
      files: [
        {
          name: langConfig.file,
          content: source_code,
        },
      ],
      stdin,
      run_timeout: 3000,
      compile_timeout: 10000,
    };

    const res = await fetch("http://localhost:2000/api/v2/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pistonPayload),
    });

    const data = await res.json();

    // Normalize output for your frontend
    return new Response(
      JSON.stringify({
        stdout: data.run?.stdout || "",
        stderr: data.run?.stderr || "",
        compile_output: data.compile?.stderr || "",
        exit_code: data.run?.code ?? null,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Piston Error:", err);
    return new Response(
      JSON.stringify({ error: "Code execution failed" }),
      { status: 500 }
    );
  }
}
