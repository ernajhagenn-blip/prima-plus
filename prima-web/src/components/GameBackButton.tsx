"use client";

import Link from "next/link";

export default function GameBackButton() {
  return (
    <Link
      href="/world"
      style={{
        position: "fixed", top: 14, left: 14, zIndex: 70,
        display: "flex", alignItems: "center", gap: 7,
        padding: "11px 20px", borderRadius: 999,
        background: "white", color: "#253057",
        border: "3px solid #253057", boxShadow: "0 4px 0 #253057",
        fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 15,
        textDecoration: "none",
        transition: "transform 0.12s, box-shadow 0.12s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 0 #253057"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 0 #253057"; }}
    >
      🏠 PRIMA CITY
    </Link>
  );
}
