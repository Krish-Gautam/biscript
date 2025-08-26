"use client";
import dynamic from "next/dynamic";

const CodeEditorDynamic = dynamic(() => import("./CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
      Loading editor...
    </div>
  ),
});

export default CodeEditorDynamic;


