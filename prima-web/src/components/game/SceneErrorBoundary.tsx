"use client";

import { ReactNode } from "react";

export default function SceneErrorBoundary({
  children,
  label,
}: {
  children: ReactNode;
  label?: string;
}) {
  return <>{children}</>;
}
