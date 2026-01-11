import { Suspense } from "react";
import TestCasesForm from "./TestCasesForm";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
      <TestCasesForm />
    </Suspense>
  );
}
