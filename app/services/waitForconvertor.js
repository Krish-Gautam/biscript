export const waitForConvertor = (spec) => {
  if (!spec || !spec.type) return null;

  if (spec.type === "includes") {
    return (code) => code.includes(spec.value);
  }

  if (spec.type === "regex") {
    if (typeof spec.value === "string") {
      try {
        if (spec.value.includes("=>")) {
          const wrapped = spec.value.trim().startsWith("(")
            ? spec.value
            : `(${spec.value})`; // <- this line fixes the issue

          // eslint-disable-next-line no-new-func
          return new Function(`return ${wrapped}`)();
        }

        // If it's not a function string, assume it's just a regex
        const re = new RegExp(spec.value);
        return (code) => re.test(code);
      } catch (err) {
        console.warn("Invalid regex/function in spec:", spec.value);
        return () => false;
      }
    }
  }

  return null;
};
