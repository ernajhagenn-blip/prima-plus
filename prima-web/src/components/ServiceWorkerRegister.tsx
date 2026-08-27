"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register(`${process.env.NEXT_PUBLIC_BASE_PATH}/sw.js`).catch(() => {});
      });
    }
  }, []);
  return null;
}
