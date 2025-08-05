export const waitForConvertor = (spec) =>  {
  if (!spec || !spec.type) return null;
  if (spec.type === "includes") {
    return (code) => code.includes(spec.value);
  }
  if (spec.type === "regex") {
    try {
      const re = new RegExp(spec.value);
      return (code) => re.test(code);
    } catch {
      return () => false; // invalid regex
    }
  }
  // extend later: startsWith, equals, etc.
  return null;
}
