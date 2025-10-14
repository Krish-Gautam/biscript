"use client";
import { useState, useEffect, useRef, useImperativeHandle, forwardRef, Suspense, lazy } from "react";
import { motion } from "framer-motion";

// Lazy load the CodeMirror components
const CodeMirror = lazy(() => import("@uiw/react-codemirror"));
const javascript = lazy(() => import("@codemirror/lang-javascript").then(mod => ({ default: mod.javascript })));
const python = lazy(() => import("@codemirror/lang-python").then(mod => ({ default: mod.python })));
const cpp = lazy(() => import("@codemirror/lang-cpp").then(mod => ({ default: mod.cpp })));
const java = lazy(() => import("@codemirror/lang-java").then(mod => ({ default: mod.java })));
const EditorView = lazy(() => import("@codemirror/view").then(mod => ({ default: mod.EditorView })));

// Loading skeleton component
const CodeEditorSkeleton = () => (
  <div className="w-full h-full bg-gray-900 rounded-lg p-4">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      <div className="ml-4 text-gray-400 text-sm">Loading editor...</div>
    </div>
    <div className="space-y-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-800 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
      ))}
    </div>
  </div>
);

const LazyCodeEditor = forwardRef(function LazyCodeEditor(props, ref) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [languageExt, setLanguageExt] = useState(null);
  const editorRef = useRef(null);

  const languageOptions = [
    { id: 63, name: "JavaScript", langExt: "javascript" },
    { id: 71, name: "Python", langExt: "python" },
    { id: 54, name: "C++", langExt: "cpp" },
    { id: 62, name: "Java", langExt: "java" },
  ];

  const pistonLangMap = {
    JavaScript: { piston: "javascript", ext: "js" },
    Python: { piston: "python", ext: "py" },
    "C++": { piston: "cpp", ext: "cpp" },
    Java: { piston: "java", ext: "java" },
  };

  useEffect(() => {
    // Load the editor after a short delay to improve perceived performance
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded && props.language) {
      const loadLanguageExtension = async () => {
        try {
          let ext;
          switch (props.language) {
            case "JavaScript":
              ext = await javascript();
              break;
            case "Python":
              ext = await python();
              break;
            case "C++":
              ext = await cpp();
              break;
            case "Java":
              ext = await java();
              break;
            default:
              ext = await javascript();
          }
          setLanguageExt(ext);
        } catch (error) {
          console.error("Error loading language extension:", error);
        }
      };
      loadLanguageExtension();
    }
  }, [isLoaded, props.language]);

  useImperativeHandle(ref, () => ({
    getValue: () => editorRef.current?.getValue() || "",
    setValue: (value) => editorRef.current?.setValue(value),
    focus: () => editorRef.current?.focus(),
  }));

  if (!isLoaded || !languageExt) {
    return <CodeEditorSkeleton />;
  }

  return (
    <Suspense fallback={<CodeEditorSkeleton />}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full"
      >
        <CodeMirror
          ref={editorRef}
          value={props.value || ""}
          onChange={props.onChange}
          extensions={[languageExt]}
          theme="dark"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            highlightSelectionMatches: false,
            searchKeymap: true,
          }}
          className="w-full h-full text-sm"
        />
      </motion.div>
    </Suspense>
  );
});

LazyCodeEditor.displayName = "LazyCodeEditor";

export default LazyCodeEditor;
