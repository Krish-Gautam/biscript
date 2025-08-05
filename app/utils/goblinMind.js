const goblinTriggers = [
  {
    id: "syntax_brace_error",
    type: "syntax",
    level: "error",
    category: "bracing",
    match: (code, output, lesson) => code.includes("{") && lesson.language === "Python",
    response: "Python doesn't use curly braces, but sure. Just freestyle it."
  },
  {
    id: "loop_missing",
    type: "lesson",
    level: "feedback",
    match: (code, output, lesson) =>
      lesson.title.includes("loop") &&
      !code.includes("for") &&
      !code.includes("while"),
    response: "We're doing loops and you're out here writing if-statements. Bold."
  },
  {
    id: "success_basic",
    type: "success",
    level: "info",
    match: (code, output) => output.includes("success"),
    response: "Hey. It worked. You might be... improving? Ew."
  }
];

export const goblinResponse = (code, output, lesson, profile) => {
  const matching = goblinTriggers.find(trigger => trigger.match(code, output, lesson))

  if (matching) {
    return {
      id: matching.id,
      text: matching.response,
      level: matching.level,
      type: matching.type,
    }
  }

  return {
    id: "default",
    text: "I have no idea what you just wrote. Neither do you.",
    level: "info",
    type: "confusion"
  };

}