import { ReactNode } from "react";

interface RowProps {
  label: string;
  children: ReactNode;
  mb?: number;
}

// ── Two-column label | content row ────────────────────────────────────────────
export default function Row({ label, children, mb = 16 }: RowProps) {
  return (
    <div style={{ display: "flex", marginBottom: mb }}>
      <div style={{ width: 180, flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
