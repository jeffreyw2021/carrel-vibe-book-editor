"use client";

import dynamic from "next/dynamic";

// ssr:false keeps gluon-ai/react out of Node.js (avoids CJS/ESM React instance mismatch).
const GluonAgentPanel = dynamic(
  () =>
    import("@/components/ai-chat/GluonAgentPanel").then((m) => ({
      default: m.GluonAgentPanel,
    })),
  { ssr: false },
);

export default function WorkspacePage() {
  return (
    <div className="flex flex-1 min-h-0 overflow-hidden bg-neutral-50">
      {/* ── Main workspace area ── */}
      <div className="flex-1 min-w-0 overflow-y-auto" />

      {/* ── AI agent panel ── */}
      <div className="w-[380px] shrink-0 h-full">
        <GluonAgentPanel />
      </div>
    </div>
  );
}
