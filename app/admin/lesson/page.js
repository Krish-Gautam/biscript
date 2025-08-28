import { Suspense } from "react";
import LessonForm from "./LessonForm";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
      <LessonForm />
    </Suspense>
  );
}
