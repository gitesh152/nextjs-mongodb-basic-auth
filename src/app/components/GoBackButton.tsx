"use client";

import { useRouter } from "next/navigation";

export function GoBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="w-full rounded-lg border border-gray-300 py-2 text-gray-700 transition hover:bg-gray-100"
    >
      ← Go Back
    </button>
  );
}
