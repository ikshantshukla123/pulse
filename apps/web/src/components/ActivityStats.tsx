"use client";

import { useLiveActivity } from "../hooks/useLiveActivity";

export function ActivityStats() {
  const { items, byRealm, tpm } = useLiveActivity();

  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-3xl mx-auto my-6">
      <StatCard label="Total Activity" value={items.length} />
      <StatCard label="TPM (Last 60s)" value={tpm} />
      <StatCard label="Active Realms" value={Object.keys(byRealm).length} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-lg text-center">
      <div className="text-white/70 text-xs uppercase tracking-widest mb-1">{label}</div>
      <div className="text-white text-2xl font-semibold">{value}</div>
    </div>
  );
}
