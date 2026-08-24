"use client";

export default function KaraAvatar({ className = "h-44 w-44" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <div className="relative h-32 w-32">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-200 to-amber-400" />
        <div className="absolute inset-0 flex items-center justify-center text-5xl">🧑‍🎓</div>
      </div>
    </div>
  );
}
