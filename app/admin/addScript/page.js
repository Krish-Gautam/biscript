import { Suspense } from "react";
import ScriptForm from "./ScriptForm";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
      <ScriptForm />
    </Suspense>
  );
}
