"use client";

import { useState } from "react";
import DebugLogoutButton from "./DebugLogoutButton";

const MONO = "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, monospace";

export default function DebugBar() {
  const [visible, setVisible] = useState(true);
  const minSize = 30;

  if (!visible) return null;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "stretch",
        backgroundColor: "#1a1a1a",
        color: "#d4d4d4",
        fontFamily: MONO,
        fontSize: 12,
        lineHeight: "20px",
        minHeight: minSize,
        borderBottom: "1px solid #555",
        flexShrink: 0,
      }}
    >
      {/* scrollable debug items */}
      <div
        style={{
          flex: 1,
          overflowX: "auto",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 12px",
          whiteSpace: "nowrap",
        }}
      >
        <DebugLogoutButton />
      </div>

      {/* dismiss button */}
      <button
        onClick={() => setVisible(false)}
        title="Close debug bar"
        style={{
          background: "none",
          border: "none",
          borderLeft: "1px solid #555",
          cursor: "pointer",
          fontFamily: MONO,
          fontSize: 16,
          color: "#6b7280",
          padding: "0 10px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: minSize,
        }}
      >
        ✕
      </button>
    </div>
  );
}
