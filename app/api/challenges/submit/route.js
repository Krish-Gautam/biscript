// app/api/challenges/submit/route.js
import { getTestCases } from "@/app/services/getTestCases";
import { getChallengeData } from "@/app/services/getChallengeData";
import { supabase } from "@/app/utils/supabaseClient";

export async function POST(req) {
  try {
    const { challengeId, source_code, language_id, userId } = await req.json();

    if (!challengeId || !source_code || !language_id || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Fetch challenge data and test cases
    const testCases = await getTestCases(challengeId);
    const challengeDataArr = await getChallengeData(challengeId);

    const challengeData = challengeDataArr[0]; // adjust based on API shape
    console.log('testCases:', testCases);
    console.log('challengeData:', challengeData);

    let allPassed = true;
    let results = [];

    for (let tc of testCases) {
      // Use Piston API for code execution
      const pistonRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/piston/runCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "python", // should match pistonLangMap
          version: "3.12.0",
          files: [
            {
              name: `main.py`,
              content: source_code,
            },
          ],
          stdin: String(tc.input),
        }),
      });
      const result = await pistonRes.json();
      const output = result.run?.stdout?.trim() || result.run?.stderr?.trim() || result.compile?.stdout?.trim() || "";
      const expected = (tc.output || "").trim();
      const passed = output === expected;
      if (!passed) allPassed = false;
      results.push({
        input: tc.input,
        expected,
        output,
        status: result.run?.code === 0 ? "Success" : "Error",
        passed,
      });
    }
 
    if (allPassed) {
      const { data, error } = await supabase.from("user_challenges").insert({
        challenge_id: challengeId,
        user_id: userId,
        title: challengeData.title,
        participants: challengeData.participants,
      });

      if (error) console.error("Supabase insert error:", error);
      else console.log("Insert success:", data);
    }

    return new Response(JSON.stringify({ allPassed, results }), { status: 200 });

  } catch (error) {
    console.error("Error in /api/challenges/submit:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500 }
    );
  }
}


// n = int(input())
// for i in range(1, n + 1):
//     print(i)