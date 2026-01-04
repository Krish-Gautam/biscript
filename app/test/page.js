"use client";
import { useRef } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";

export default function FakeCopilotMonaco() {
  const monacoRef = useMonaco();
  const editorRef = useRef();

  const getFakeSuggestion = (code) => {
    if (code.trim().endsWith("for")) return "(let i = 0; i < 5; i++) {}";
    if (code.trim().endsWith("if")) return "(x > 0) { console.log(x); }";
    return "console.log('Hello World');";
  };

  const handleMount = (editor, monaco) => {
    editorRef.current = editor;

    // unregister any previous providers to avoid duplicates
    monaco.languages.getLanguages().forEach((lang) => {
      if (lang.id === "javascript") {
        monaco.languages.registerInlineCompletionsProvider("javascript", {
          provideInlineCompletions(model, position) {
            const codeBeforeCursor = model.getValueInRange({
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            });
            const text = getFakeSuggestion(codeBeforeCursor);
            return {
              items: [
                {
                  text,
                  range: new monaco.Range(
                    position.lineNumber,
                    position.column,
                    position.lineNumber,
                    position.column
                  ),
                },
              ],
            };
          },
          freeInlineCompletions() {},
        });
      }
    });
  };

  return (
    <Editor
      height="400px"
      defaultLanguage="javascript"
      defaultValue="// start typing 'if' or 'for'"
      onMount={handleMount}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        inlineSuggest: { enabled: true },
      }}
    />
  );
}
