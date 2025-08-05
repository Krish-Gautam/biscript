import { waitForConvertor } from "./waitForconvertor";

export const deserializePlan = (rawPlan) => {
  if (!Array.isArray(rawPlan)) return [];

  return rawPlan.map((step) => ({
    ...step,
    waitFor: waitForConvertor(step.waitFor),
    reactions: Array.isArray(step.reactions)
      ? step.reactions.map((r) => ({
          trigger: waitForConvertor(r),
          response: r?.response ?? "",
        }))
      : null,
  }));
};
