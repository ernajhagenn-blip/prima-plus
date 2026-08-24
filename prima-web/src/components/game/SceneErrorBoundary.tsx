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
    console.error("[SceneErrorBoundary]", error);
  }

  componentDidMount() {
    if (!hasWebGL()) this.setState({ webgl: false });
  }

  render() {
    if (!this.state.webgl) {
      return (
        this.props.fallback || (
          <div
            className="flex h-full w-full items-center justify-center p-6 text-center"
            style={{
              background: "linear-gradient(135deg, #87CEEB 0%, #A5D6A7 50%, #81C784 100%)",
              borderRadius: 20,
            }}
          >
            <div>
              <p
                className="text-2xl font-black"
                style={{
                  color: "#FFD54F",
                  textShadow: "0 2px 0 #E65100, 0 3px 0 #BF360C, 0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                🎮 WebGL Diperlukan
              </p>
              <p className="mt-2 text-sm font-semibold text-white/80">
                Buka di Chrome/Edge dengan Hardware Acceleration aktif untuk pengalaman 3D terbaik.
              </p>
            </div>
          </div>
        )
      );
    }
    if (this.state.error) {
      return (
        this.props.fallback || (
          <div
            className="flex h-full w-full items-center justify-center p-6 text-center"
            style={{
              background: "linear-gradient(135deg, #FFD54F 0%, #FFA726 50%, #FF7043 100%)",
              borderRadius: 20,
            }}
          >
            <div>
              <p
                className="text-xl font-black"
                style={{ color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
              >
                🏎️ {this.props.label || "Scene"} sedang dimuat...
              </p>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
