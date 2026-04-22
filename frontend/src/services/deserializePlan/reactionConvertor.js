export const reactionConvertor = (spec) => {
  if (!spec || !spec.type) return null;

  if (spec.type === "includes") {
    return (code, output) => code.includes(spec.value);
  }

  if (spec.type === "regex") {
    if (typeof spec.value === "string") {
      try {
        // Case 1: Stringified function
        if (spec.value.includes("=>")) {
          return new Function(`return (${spec.value})`)();
        }

        // Case 2: Simple regex to match code
        const re = new RegExp(spec.value);
        return (code, output) => re.test(code);
      } catch (err) {
        console.warn("Invalid regex/function in reaction spec:", spec.value);
        return () => false;
      }
    }
  }

  if (spec.type === "codeAndOutputRegex") {
    try {
      const codeRegex = new RegExp(spec.code, spec.flags || "i");
      const outputRegex = new RegExp(spec.output, spec.flags || "i");

      return (code, output) => codeRegex.test(code) && outputRegex.test((output ?? "").trim());
    } catch (err) {
      console.warn("Invalid code/output regex in reaction spec:", spec);
      return () => false;
    }
  }

  return null;
};
