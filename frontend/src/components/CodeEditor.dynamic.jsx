import React, { lazy, Suspense } from "react";

const CodeEditorDynamic = lazy(() => import("./CodeEditor"));

export default function CodeEditorWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Loading editor...
        </div>
      }
    >
      <CodeEditorDynamic />
    </Suspense>
  );
}