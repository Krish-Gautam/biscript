"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addChallenge } from "@/app/services/addChallenges";



export default function ChallengeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // challengeType comes from URL → /admin/challenge?type=solo
  const challengeType = searchParams.get("type") || "solo";

  const [form, setForm] = useState({
    title: "",
    description: "",
    challengeType,
    solution: "",
    hint: "",
    participants: 1,
    category: "",
    points: 60,
  });

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

    const { data, error } = await addChallenge(form);

    if (error) {
      console.error(error);
      alert("Failed to create challenge");
      return;
    }

    alert("Challenge created successfully");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b] text-white">
      <div className="w-full max-w-xl bg-[#232526] p-8 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-6">Add Challenge</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Title */}
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

          {/* Challenge Type (read-only) */}
          <div>
            <label className="block mb-1 text-gray-300">Challenge Type</label>
            <div className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600 text-gray-400">
              {challengeType}
            </div>
          </div>

          {/* Description */}
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

          {/* Solution */}
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

          {/* Hint */}
          <div>
            <label className="block mb-1 text-gray-300">Hint</label>
            <input
              name="hint"
              value={form.hint}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600"
            />
          </div>

          {/* Category */}
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

          {/* Participants + Points */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-gray-300">
                Participants
              </label>
              <input
                type="number"
                min={1}
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
                min={0}
                name="points"
                value={form.points}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="flex-1 py-2 bg-gray-600 rounded-lg hover:bg-gray-700"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 py-2 cursor-pointer bg-[#28c244] rounded-lg hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
