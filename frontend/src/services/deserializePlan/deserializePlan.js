import { waitForConvertor } from "./waitForconvertor";
import { reactionConvertor } from "./reactionConvertor";

export const deserializePlan = (rawPlan) => {
  if (!Array.isArray(rawPlan)) return [];

  return rawPlan.map((step) => ({
    ...step,
    waitFor: waitForConvertor(step.waitFor),
    reactions: Array.isArray(step.reactions)
      ? step.reactions.map((r) => ({
          trigger: reactionConvertor(r),
          response: r?.response ?? "",
        }))
      : null,
  }));
};
