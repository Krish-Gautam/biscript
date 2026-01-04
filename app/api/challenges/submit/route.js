// app/api/challenges/submit/route.js
import { getTestCases } from "@/app/services/getTestCases";
import { getChallengeData } from "@/app/services/getChallengeData";
import { supabase } from "@/app/utils/supabaseClient";

/* -------------------- Runner builders -------------------- */

function buildPythonSource({ userCode, fnName, params, inputs }) {
  const assignments = params.map((p, i) => {
    return `${p} = ${JSON.stringify(inputs[i])}`;
  });

  return `
${assignments.join("\n")}

${userCode}

print(${fnName}(${params.join(", ")}))
`;
}

function buildJavaScriptSource({ userCode, fnName, params, inputs }) {
  const assignments = params.map((p, i) => {
    return `const ${p} = ${JSON.stringify(inputs[i])};`;
  });

  return `
${assignments.join("\n")}

${userCode}

console.log(${fnName}(${params.join(", ")}));
`;
}

/* -------------------- API -------------------- */

export async function POST(req) {
  try {
    const { challengeId, source_code, language_id, userId } = await req.json();

    if (!challengeId || !source_code || !language_id || !userId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* -------------------- Load test schema -------------------- */
    const tcRows = await getTestCases(challengeId);
    const testSchema = tcRows[0]?.data;

    if (!testSchema) {
      return Response.json(
        { error: "Test schema not found" },
        { status: 500 }
      );
    }

    const { params, testCases } = testSchema;

    /* -------------------- Load challenge metadata -------------------- */
    const [challenge] = await getChallengeData(challengeId);
    const function_name = challenge.function_name; // MUST exist in DB

    if (!function_name || !params?.length) {
      return Response.json(
        { error: "Challenge function signature not defined" },
        { status: 500 }
      );
    }

    const normalize = (s = "") =>
      s
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map(l => l.trim())
        .join("\n")
        .trim();

    /* -------------------- Execute one test -------------------- */
    const runTestCase = async (tc) => {
      if (!Array.isArray(tc.inputs)) {
        return { passed: false, error: "Invalid test case format" };
      }

      if (tc.inputs.length !== params.length) {
        return {
          passed: false,
          error: "Input count does not match parameter count",
        };
      }

      let wrappedSource = "";

      if (language_id === 71) {
        wrappedSource = buildPythonSource({
          userCode: source_code,
          fnName: function_name,
          params,
          inputs: tc.inputs,
        });
      } else if (language_id === 63) {
        wrappedSource = buildJavaScriptSource({
          userCode: source_code,
          fnName: function_name,
          params,
          inputs: tc.inputs,
        });
      } else {
        return { passed: false, error: "Language not supported yet" };
      }

      const res = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions?wait=true&base64_encoded=false",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.RAPID_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
          body: JSON.stringify({
            source_code: wrappedSource,
            language_id,
            stdin: "",
            cpu_time_limit: 2,
            memory_limit: 128000,
          }),
        }
      );

      const result = await res.json();
      console.log("RAW JUDGE0 RESPONSE:", result);
      console.log("WRAPPED SOURCE:\n", wrappedSource);


      if (result.status?.id !== 3) {
        return {
          passed: false,
          error: result.status?.description,
          details: result.stderr || result.compile_output,
        };
      }

      const stdout =
        typeof result.stdout === "string" ? result.stdout : "";

      const passed =
        normalize(stdout) === normalize(String(tc.output));

      return {
        passed,
        expected: tc.output,
        output: stdout,
      };
    };

    /* -------------------- Run all tests -------------------- */
    const results = [];
    for (const tc of testCases) {
      results.push(await runTestCase(tc));
    }

    const allPassed = results.every(r => r.passed);

    if (allPassed) {
      await supabase
        .from("user_challenges")
        .upsert(
          {
            challenge_id: challengeId,
            user_id: userId,
            title: challenge.title,
          },
          { onConflict: ["challenge_id", "user_id"] }
        );
    }

    return Response.json({ allPassed, results }, { status: 200 });

  } catch (err) {
    console.error("SUBMISSION ERROR", err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
