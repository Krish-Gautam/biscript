"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getChallengeData } from "@/app/services/getChallengeData";
import { updateChallenge } from "@/app/services/updateChallenge";

export default function EditChallengeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const challengeId = searchParams.get("challengeId");

  const [loading, setLoading] = useState(true);

  // string state for input
  const [skillInput, setSkillInput] = useState("[]");

  // canonical form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    challengeType: "",
    solution: "",
    skill_tested: [],
    function_name: "",
    hint: "",
    participants: 1,
    category: "",
    points: 0,
  });

  // fetch challenge
  useEffect(() => {
    if (!challengeId) return;

    const fetchChallenge = async () => {
      const c = await getChallengeData(challengeId);

      const skills = Array.isArray(c.skill_tested) ? c.skill_tested : [];

      setForm({
        title: c.title || "",
        description: c.description || "",
        challengeType: c.type || "",
        solution: c.solution || "",
        skill_tested: skills,
        function_name: c.function_name || "",
        hint: c.hint || "",
        participants: c.participants ?? 1,
        category: c.category || "",
        points: c.points ?? 0,
      });

      // sync string input ONCE after fetch
      setSkillInput(JSON.stringify(skills));

      setLoading(false);
    };

    fetchChallenge();
  }, [challengeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "points" || name === "participants"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // final validation before submit
    try {
      const parsed = JSON.parse(skillInput);
      if (!Array.isArray(parsed)) throw new Error();
      form.skill_tested = parsed;
    } catch {
      alert("Skill Tested must be a valid JSON array");
      return;
    }

    const { error } = await updateChallenge(challengeId, form);

    if (error) {
      console.error(error);
      alert("Failed to update challenge");
      return;
    }

    alert("Challenge updated successfully");
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18181b] text-gray-400">
        Loading challenge…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b] text-white">
      <div className="w-full max-w-xl bg-[#232526] p-8 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-6">Edit Challenge</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block mb-1 text-gray-300">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Challenge Type</label>
            <div className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600 text-gray-400">
              {form.challengeType}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Function Name</label>
            <input
              name="function_name"
              value={form.function_name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">
              Skill Tested (JSON Array)
            </label>
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder='["Conditionals","Loops","State","EdgeCases"]'
              className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600 font-mono text-sm"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Solution</label>
            <textarea
              name="solution"
              value={form.solution}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Hint</label>
            <input
              name="hint"
              value={form.hint}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-gray-300">Participants</label>
              <input
                type="number"
                name="participants"
                value={form.participants}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Points</label>
              <input
                type="number"
                name="points"
                value={form.points}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="flex-1 py-2 bg-gray-600 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-[#28c244] rounded-lg hover:bg-green-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
