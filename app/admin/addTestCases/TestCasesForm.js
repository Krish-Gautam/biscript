"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addTestCases } from "@/app/services/addTestCases"

export default function AddTestCasesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const challengeId = searchParams.get("challengeId");

  if (!challengeId) {
    return <div className="text-red-400 p-10">challengeId missing</div>;
  }

  const [params, setParams] = useState('');
  const [inputs, setInputs] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const safeParse = (value, label) => {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error(`${label} must be valid JSON`);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  let parsedParams, parsedInputs, parsedOutput;

  try {
    parsedParams = JSON.parse(params);
    parsedInputs = JSON.parse(inputs);
    parsedOutput = JSON.parse(output);
  } catch {
    alert("All fields must be valid JSON");
    return;
  }

  // validation — strict, no mercy
  if (
    typeof parsedParams !== "object" ||
    !Array.isArray(parsedParams.params) ||
    !Array.isArray(parsedParams.testCases)
  ) {
    alert("params must contain { params: [], testCases: [] }");
    return;
  }

  if (!Array.isArray(parsedInputs)) {
    alert("inputs must be a JSON array");
    return;
  }

  if (!Array.isArray(parsedOutput)) {
    alert("output must be a JSON array");
    return;
  }

  const TestCases = {
    challenge_id: challengeId,
    data: parsedParams,
    input: parsedInputs,
    output: parsedOutput,
  };

  setLoading(true);
  const { error } = await addTestCases(TestCases);
  setLoading(false);

  if (error) {
    console.error(error);
    alert("Failed to add test case");
    return;
  }

  alert("Test case added ✅");
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b] text-white">
      <div className="w-full max-w-2xl bg-[#232526] p-8 rounded-xl border border-gray-700">
        <h2 className="text-2xl font-bold mb-6">Add Test Case</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Params */}
          <div>
            <label className="block text-gray-300 mb-1">
              data (JSON Array)
            </label>
            <textarea
              value={params}
              onChange={(e) => setParams(e.target.value)}
              rows={2}
              className="w-full bg-[#18181b] border border-gray-600 rounded px-3 py-2 font-mono"
            />
          </div>

          {/* Inputs */}
          <div>
            <label className="block text-gray-300 mb-1">
              Inputs (JSON Array)
            </label>
            <textarea
              value={inputs}
              onChange={(e) => setInputs(e.target.value)}
              rows={3}
              className="w-full bg-[#18181b] border border-gray-600 rounded px-3 py-2 font-mono"
              placeholder='["Hello World", ["o"]]'
            />
          </div>

          {/* Output */}
          <div>
            <label className="block text-gray-300 mb-1">
              Output (JSON)
            </label>
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              rows={2}
              className="w-full bg-[#18181b] border border-gray-600 rounded px-3 py-2 font-mono"
              placeholder='"Hell Wrld"'
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="flex-1 py-2 bg-gray-600 rounded hover:bg-gray-700"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-green-500 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Add Test Case"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
