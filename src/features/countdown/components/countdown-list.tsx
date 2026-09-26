// countdown/components/countdown-list.tsx

"use client";

import { useCountdowns } from "../queries";
import { CountdownCard } from "./countdown-card";


import type { CountdownMember } from "../types";

interface CountdownListProps {
  relationshipId: string;
  members: CountdownMember[];
  currentUserId: string;
}

export function CountdownList({
  relationshipId,
  members,
  currentUserId,
}: CountdownListProps) {
  const { data: countdowns, isLoading, error } = useCountdowns(relationshipId);

  if (isLoading) {
    return <p className="text-sm text-gray-400">Memuat countdown...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-400">Gagal memuat data countdown.</p>;
  }

  if (!countdowns || countdowns.length === 0) {
    return (
      <p className="text-sm text-gray-400">
        Belum ada rencana ketemu. Yuk buat satu!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {countdowns.map((countdown) => (
        <CountdownCard
          key={countdown.id}
          countdown={countdown}
          members={members}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}