import { Suspense } from "react";
import ScriptForm from "./SriptForm";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
      <ScriptForm />
    </Suspense>
  );
}
