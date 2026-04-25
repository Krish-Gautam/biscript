import React, { lazy, Suspense, forwardRef } from "react";

const CodeEditorDynamic = lazy(() => import("./CodeEditor"));

const CodeEditorWrapper = forwardRef((props, ref) => {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Loading editor...
        </div>
      }
    >
      <CodeEditorDynamic {...props} ref={ref} />
    </Suspense>
  );
});

export default CodeEditorWrapper;