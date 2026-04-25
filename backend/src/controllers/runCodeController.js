import { getChallengeById } from "../models/challengeModels.js";
import { upsertUserChallenge } from "../models/userChallengeModels.js";


/* -------------------- Runner builders -------------------- */


function buildPythonSource({ userCode, fnName, params, inputs }) {
  const assigns = params.map(
    (p, i) => `${p} = json.loads(${JSON.stringify(JSON.stringify(inputs[i]))})`
  );

  return `
import json

${assigns.join("\n")}

${userCode}

__result = ${fnName}(${params.join(", ")})
print(json.dumps(__result))
`;
}


function buildJavaScriptSource({ userCode, fnName, params, inputs }) {
  const assigns = params.map(
    (p, i) => `const ${p} = ${JSON.stringify(inputs[i])};`
  );

  return `
${assigns.join("\n")}

${userCode}

const __result = ${fnName}(${params.join(", ")});
console.log(JSON.stringify(__result));
`;
}

/* -------------------- Language map -------------------- */

const PISTON_LANG_MAP = {
  71: { language: "python", version: "3.12.0" },
  63: { language: "javascript", version: "18.15.0" },
};

/* -------------------- API -------------------- */
//judge0 implementation
export async function submitCode(req, res) {
  try {
    const { challengeId, source_code, language_id, userId } = req.body;

    if (!challengeId || !source_code || !language_id || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    /* -------------------- Load challenge -------------------- */
    const challenge = await getChallengeById(challengeId);

    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    const function_name = challenge.function_name;

    /* -------------------- Load test schema -------------------- */
    const tcRows = challenge.testcases;
    const testSchema = tcRows?.[0]?.data;

    if (!testSchema) {
      return res.status(500).json({ error: "Test schema not found" });
    }

    const { params, testCases } = testSchema;

    if (!function_name || !params?.length) {
      return res.status(500).json({
        error: "Challenge function signature not defined",
      });
    }

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

      const response = await fetch(
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
          }),
        }
      );

      const result = await response.json();

      if (result.status?.id !== 3) {
        return {
          passed: false,
          error: result.status?.description,
          details: result.stderr || result.compile_output,
        };
      }

      let actual;
      try {
        actual = JSON.parse(result.stdout || "");
      } catch {
        return {
          passed: false,
          expected: tc.output,
          output: result.stdout,
          error: "Output is not valid JSON",
        };
      }

      return {
        passed:
          JSON.stringify(actual) === JSON.stringify(tc.output),
        expected: tc.output,
        output: result.stdout,
      };
    };

    /* -------------------- Run all tests -------------------- */
    const results = [];
    for (const tc of testCases) {
      results.push(await runTestCase(tc));
    }

    const allPassed = results.every(r => r.passed);

    /* -------------------- Save result -------------------- */
    if (allPassed) {
      await upsertUserChallenge({
        userId,
        challengeId,
        title: challenge.title,
        language: language_id === 71 ? "python" : "javascript",
        score: challenge.points || 0,
      });
    }

    return res.json({ allPassed, results });

  } catch (err) {
    console.error("SUBMISSION ERROR", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// piston implementation

// export async function POST(req) {
//   try {
//     const { challengeId, source_code, language_id, userId } = await req.json();

//     if (!challengeId || !source_code || !language_id || !userId) {
//       return Response.json({ error: "Missing fields" }, { status: 400 });
//     }

//     /* ---------- Load test cases ---------- */

//     const tcRows = await getTestCases(challengeId);
//     const testSchema = tcRows?.[0]?.data;

//     if (!testSchema) {
//       return Response.json({ error: "Test schema missing" }, { status: 500 });
//     }

//     const { params, testCases } = testSchema;

//     /* ---------- Load challenge ---------- */

//     const challenge = await getChallengeById(challengeId);
//     const fnName = challenge?.function_name;

//     if (!fnName) {
//       return Response.json({ error: "Function name missing" }, { status: 500 });
//     }

//     /* ---------- Language ---------- */

//     const pistonLang = PISTON_LANG_MAP[language_id];
//     if (!pistonLang) {
//       return Response.json({ error: "Language not supported" }, { status: 400 });
//     }

//     /* ---------- Run one test ---------- */

//     const runTestCase = async (tc) => {
//       let wrappedSource = "";

//       if (language_id === 71) {
//         wrappedSource = buildPythonSource({
//           userCode: source_code,
//           fnName,
//           params,
//           inputs: tc.inputs,
//         });
//       } else {
//         wrappedSource = buildJavaScriptSource({
//           userCode: source_code,
//           fnName,
//           params,
//           inputs: tc.inputs,
//         });
//       }

//       const res = await fetch("http://localhost:2000/api/v2/execute", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           language: pistonLang.language,
//           version: pistonLang.version,
//           files: [
//             {
//               name: pistonLang.language === "python" ? "main.py" : "main.js",
//               content: wrappedSource,
//             },
//           ],
//         }),
//       });

//       const result = await res.json();
//       const run = result?.run;

//       if (!run || run.code !== 0) {
//         return {
//           passed: false,
//           error: run?.stderr || "Runtime error",
//         };
//       }

//       const stdout = run.stdout ?? "";

//       let actual;
//       try {
//         actual = JSON.parse(stdout.trim());
//       } catch {
//         return {
//           passed: false,
//           expected: tc.output,
//           output: stdout,
//           error: "Output is not valid JSON",
//         };
//       }

//       const passed =
//         JSON.stringify(actual) === JSON.stringify(tc.output);

//       return {
//         passed,
//         expected: tc.output,
//         output: actual,
//       };
//     };

//     /* ---------- Run all tests ---------- */

//     const results = [];
//     for (const tc of testCases) {
//       results.push(await runTestCase(tc));
//     }

//     const allPassed = results.every(r => r.passed);

//     /* ---------- Save progress ---------- */

//     if (allPassed) {
//       await supabase
//         .from("user_challenges")
//         .upsert(
//           {
//             challenge_id: challengeId,
//             user_id: userId,
//             title: challenge.title,
//           },
//           { onConflict: ["challenge_id", "user_id"] }
//         );
//     }

//     return Response.json({ allPassed, results });

//   } catch (err) {
//     console.error("PISTON ERROR:", err);
//     return Response.json({ error: "Internal error" }, { status: 500 });
//   }
// }






export async function runCode(req, res) {
  try {
    const body = req.body;

    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPID_API_KEY, // ✅ NEVER use import.meta.env here
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return res.json(data);
  } catch (err) {
    return res.status(500).json({
      error: err.message || "Unknown error",
    });
  }
}
