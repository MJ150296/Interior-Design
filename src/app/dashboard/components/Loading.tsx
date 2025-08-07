// components/LoadingSpinner.tsx
"use client";

import { FaSpinner } from "react-icons/fa";

export default function LoadingSpinner({
  text = "LOADING",
}: {
  text?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <FaSpinner className="text-lime-700 text-5xl animate-spin mb-4" />
      <p className="text-lime-900 font-bold text-xl tracking-widest">{text}</p>
    </div>
  );
}
