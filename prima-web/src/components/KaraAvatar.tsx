"use client";

import dynamic from "next/dynamic";

const KaraModel = dynamic(() => import("./KaraModel"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-2xl bg-white/5" />,
});

export default function KaraAvatar({ className = "h-44 w-44" }: { className?: string }) {
  return (
    <div className={className}>
      <KaraModel />
    </div>
  );
}
