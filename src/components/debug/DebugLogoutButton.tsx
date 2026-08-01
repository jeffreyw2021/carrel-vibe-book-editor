"use client";

import { signOut, useSession } from "next-auth/react";

export default function DebugLogoutButton() {
  const { status } = useSession();

  if (status !== "authenticated") {
    return null;
  }

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/auth" })}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        margin: 0,
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: "inherit",
        color: "#f87171",
        letterSpacing: "0.02em",
      }}
    >
      <span style={{ color: "#6b7280" }}>[</span>
      logout
      <span style={{ color: "#6b7280" }}>]</span>
    </button>
  );
}
