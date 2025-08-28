import { Suspense } from "react";
import QuestionForm from "./QuestionForm";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
      <QuestionForm />
    </Suspense>
  );
}
