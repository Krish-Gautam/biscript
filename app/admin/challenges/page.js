import { Suspense } from "react";
import ChallengesForm from "./ChallengeForm";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
      <ChallengesForm />
    </Suspense>
  );
}
