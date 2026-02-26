"use client";

type ToastTone = "success" | "error";

type AdminToastProps = {
  message: string | null;
  tone?: ToastTone;
};

export default function AdminToast({
  message,
  tone = "success",
}: AdminToastProps) {
  if (!message) return null;

  const toneClass =
    tone === "error"
      ? "bg-red-100 text-red-800 border border-red-300"
      : "bg-lime-100 text-lime-800 border border-lime-300";

  return (
    <div className="fixed top-4 right-1/2 translate-x-1/2 z-50 pointer-events-none">
      <div
        className={`rounded-md px-4 py-5 shadow-lg text-md font-medium ${toneClass}`}
      >
        {message}
      </div>
    </div>
  );
}
