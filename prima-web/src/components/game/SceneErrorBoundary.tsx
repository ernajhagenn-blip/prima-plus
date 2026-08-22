"use client";

import { Component, ReactNode } from "react";

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default class SceneErrorBoundary extends Component<
  { children: ReactNode; label?: string; fallback?: ReactNode },
  { error: Error | null; webgl: boolean }
> {
  constructor(props: { children: ReactNode; label?: string; fallback?: ReactNode }) {
    super(props);
    this.state = { error: null, webgl: true };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error("[SceneErrorBoundary]", error);
  }

  componentDidMount() {
    if (!hasWebGL()) this.setState({ webgl: false });
  }

  render() {
    if (!this.state.webgl) {
      return (
        <div className="flex h-full w-full items-center justify-center rounded-2xl border border-rose-400/40 bg-rose-500/10 p-6 text-center">
          <div>
            <p className="text-lg font-black text-rose-200">WebGL tidak tersedia</p>
            <p className="mt-1 text-xs text-white/70">
              Browser ini tidak mendukung WebGL (3D). Coba buka di Chrome/Edge terbaru dengan
              &quot;Hardware Acceleration&quot; aktif, atau pakai mode Desktop.
            </p>
          </div>
        </div>
      );
    }
    if (this.state.error) {
      return (
        <div className="h-full w-full overflow-auto rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4 text-left">
          <p className="text-sm font-black text-amber-200">{this.props.label || "Scene"} gagal dimuat:</p>
          <pre className="mt-2 whitespace-pre-wrap text-[11px] text-white/80">{this.state.error.message}</pre>
          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-[10px] text-white/50">
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
