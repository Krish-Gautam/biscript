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
      const judgeRes = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.RAPID_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
          body: JSON.stringify({
            source_code,
            language_id,
            stdin: String(tc.input),
          }),
        }
      );

      const result = await judgeRes.json();

      const output = result.stdout?.trim() || result.stderr?.trim() || result.compile_output?.trim() || "";
      const expected = (tc.output || "").trim();
      const passed = output === expected;

      if (!passed) allPassed = false;

      results.push({
        input: tc.input,
        expected,
        output,
        status: result.status?.description || "Unknown",
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