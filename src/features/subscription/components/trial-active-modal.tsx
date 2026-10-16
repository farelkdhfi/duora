// subscription/components/trial-active-modal.tsx

"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { useMySubscription, useMarkTrialModalSeen } from "../queries";
import { isOnTrial, getTrialDaysLeft } from "../utils";

export function TrialActiveModal() {
  const { data: subscription } = useMySubscription();
  const { mutate: markSeen } = useMarkTrialModalSeen();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!subscription) return;

    if (isOnTrial(subscription) && !subscription.trial_modal_seen) {
      setIsOpen(true);
    }
  }, [subscription]);

  function handleClose() {
    markSeen();
    setIsOpen(false);
  }

  if (!isOpen || !subscription) return null;

  const daysLeft = getTrialDaysLeft(subscription);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-primary p-6 text-center shadow-xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-description hover:text-secondary"
        >
          <X size={18} />
        </button>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500">
          <Sparkles className="text-secondary" size={24} />
        </div>

        <h2 className="mt-4 text-lg font-bold text-secondary">Trial Premium Aktif! 🎉</h2>
        <p className="mt-2 text-sm text-description">
          Kalian dapat akses penuh ke semua fitur premium Duora selama{" "}
          <span className="font-semibold text-pink-500">{daysLeft} hari</span> ke depan.
        </p>

        <ul className="mt-4 space-y-1.5 text-left text-xs text-description">
          <li>✨ Unlimited AI Debate</li>
          <li>✨ Unlimited Countdown</li>
          <li>✨ Custom template share card</li>
          <li>✨ Unlimited mood check-in</li>
        </ul>

        <button
          onClick={handleClose}
          className="mt-5 w-full rounded-lg bg-subprimary py-2.5 text-sm font-medium text-secondary hover:opacity-90"
        >
          Mulai Eksplor
        </button>
      </div>
    </div>
  );
}