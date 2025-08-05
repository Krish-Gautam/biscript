"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addScript } from "../../services/addScript";


const defaultPlan = [
  {
    trigger: "intro",
    message: "Today we learn 'for loops'. Finally, you’ll repeat something *on purpose*.",
    waitFor: null,
    reactions: null
  }
];

export default function ScriptForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("Python");
  const [plan, setPlan] = useState(defaultPlan);

  const handleAddStep = () => {
    setPlan((p) => [
      ...p,
      { trigger: "", message: "", waitFor: null, reactions: null },
    ]);
  };

  const handleStepChange = (index, updated) => {
    setPlan((p) => {
      const copy = [...p];
      copy[index] = { ...copy[index], ...updated };
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('title', title)
    console.log('plan', plan)


    const { data, error } = await addScript({title, lessonId, plan})

    if (error) {
      console.log(error)
    } else {
      alert("Script is been added")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18181b] text-white">
      <div className="w-full max-w-lg bg-[#232526] p-8 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-6"> "Add Script"</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-gray-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#18181b] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
          {plan.map((step, i) => (
            <div
              key={i}
              className="border border-gray-600 rounded-lg p-4 bg-[#1f2124] mb-4 relative"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                <div className="text-sm font-semibold text-white">Step {i + 1}</div>
                <button
                  type="button"
                  onClick={() =>
                    setPlan((p) => {
                      const copy = [...p];
                      copy.splice(i, 1);
                      return copy;
                    })
                  }
                  className="text-red-400 hover:text-red-500 text-xs self-end"
                  aria-label="Remove step"
                >
                  Remove
                </button>
              </div>

              {/* Trigger & Message */}
              <div className="grid grid-cols-1 gap-4 mb-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Trigger</label>
                  <input
                    placeholder="e.g. user_code_check_1"
                    value={step.trigger}
                    onChange={(e) => handleStepChange(i, { trigger: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#272a2e] border border-gray-500 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Message</label>
                  <textarea
                    placeholder="Goblin says this"
                    value={step.message}
                    onChange={(e) => handleStepChange(i, { message: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-[#272a2e] border border-gray-500 text-white focus:outline-none resize-none"
                    rows={3}
                  />
                </div>
              </div>

              {/* waitFor + Reactions side-by-side on large, stacked on small */}
              <div className="flex flex-col  gap-6 mb-3 items-stretch">
                {/* waitFor panel */}
                <div className="flex-1 flex flex-col bg-[#1f2124] p-3 rounded border border-gray-600 min-w-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                    <div className="text-xs font-medium text-gray-300">waitFor</div>
                    <div className="text-xs text-gray-500">Condition to proceed</div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={(step.waitFor && step.waitFor.type) || ""}
                      onChange={(e) =>
                        handleStepChange(i, {
                          waitFor: {
                            type: e.target.value || null,
                            value: (step.waitFor && step.waitFor.value) || "",
                          },
                        })
                      }
                      className="w-full sm:w-1/3 px-2 py-1 rounded bg-[#272a2e] border border-gray-500 text-white focus:outline-none"
                    >
                      <option value="">None</option>
                      <option value="includes">Includes</option>
                      <option value="regex">Regex</option>
                    </select>
                    <input
                      placeholder="e.g. for"
                      value={(step.waitFor && step.waitFor.value) || ""}
                      onChange={(e) =>
                        handleStepChange(i, {
                          waitFor: {
                            type: (step.waitFor && step.waitFor.type) || "includes",
                            value: e.target.value,
                          },
                        })
                      }
                      className="flex-1 px-3 py-1 rounded bg-[#272a2e] border border-gray-500 text-white focus:outline-none min-w-0"
                      disabled={!step.waitFor || !step.waitFor.type}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Example: type=includes, value="for" passes when code includes "for".
                  </div>
                </div>

                {/* reactions panel */}
                <div className="flex-1 flex flex-col bg-[#1f2124] p-3 rounded border border-gray-600 min-w-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs font-medium text-gray-300">Reactions</div>
                    <button
                      type="button"
                      onClick={() =>
                        handleStepChange(i, {
                          reactions: [
                            ...(step.reactions || []),
                            { type: "includes", value: "", response: "" },
                          ],
                        })
                      }
                      className="text-green-400 hover:text-green-500 text-xs"
                    >
                      + Add Reaction
                    </button>
                  </div>

                  {step.reactions && step.reactions.length ? (
                    <div className="space-y-3">
                      {step.reactions.map((r, ri) => (
                        <div
                          key={ri}
                          className="flex flex-col sm:flex-row gap-2 items-start bg-[#252a30] p-3 rounded border border-gray-500"
                        >
                          <div className="flex flex-col gap-1 w-full sm:w-1/4 min-w-0">
                            <label className="text-xs text-gray-400">Type</label>
                            <select
                              value={r.type}
                              onChange={(e) => {
                                const updated = [...(step.reactions || [])];
                                updated[ri] = { ...updated[ri], type: e.target.value };
                                handleStepChange(i, { reactions: updated });
                              }}
                              className="w-full px-2 py-1 rounded bg-[#272a2e] border border-gray-500 text-white text-xs"
                            >
                              <option value="includes">Includes</option>
                              <option value="regex">Regex</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-1 w-full sm:w-1/4 min-w-0">
                            <label className="text-xs text-gray-400">Value</label>
                            <input
                              value={r.value}
                              onChange={(e) => {
                                const updated = [...(step.reactions || [])];
                                updated[ri] = { ...updated[ri], value: e.target.value };
                                handleStepChange(i, { reactions: updated });
                              }}
                              placeholder="e.g. while"
                              className="w-full px-2 py-1 rounded bg-[#272a2e] border border-gray-500 text-white text-xs"
                            />
                          </div>
                          <div className="flex flex-col gap-1 flex-1 min-w-0">
                            <label className="text-xs text-gray-400">Response</label>
                            <input
                              value={r.response}
                              onChange={(e) => {
                                const updated = [...(step.reactions || [])];
                                updated[ri] = { ...updated[ri], response: e.target.value };
                                handleStepChange(i, { reactions: updated });
                              }}
                              placeholder="Goblin response"
                              className="w-full px-3 py-1 rounded bg-[#272a2e] border border-gray-500 text-white text-xs"
                            />
                          </div>
                          <div className="flex-shrink-0 mt-1 sm:mt-0">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...(step.reactions || [])];
                                updated.splice(ri, 1);
                                handleStepChange(i, { reactions: updated });
                              }}
                              className="text-red-400 hover:text-red-500 text-xs"
                              aria-label="Remove reaction"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">No reactions yet.</div>
                  )}
                </div>
              </div>
            </div>
          ))}



          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleAddStep}>Add Step</button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 