"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AlertTriangle, X, Crown } from "lucide-react";
import { useMySubscription, useMarkExpiryWarningShown } from "../queries";
import { shouldShowExpiryWarning, getDaysUntilExpiry } from "../utils";

export function ExpiryWarningModal() {
  const router = useRouter();
  const { data: subscription } = useMySubscription();
  const { mutate: markShown } = useMarkExpiryWarningShown();

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!subscription) return;

    if (shouldShowExpiryWarning(subscription)) {
      setIsOpen(true);
    }
  }, [subscription]);

  function handleClose() {
    markShown();
    setIsOpen(false);
  }

  function handleUpgradeClick() {
    markShown();
    setIsOpen(false);
    router.push("/subscription/plan");
  }

  if (!mounted || !isOpen || !subscription) return null;

  const daysLeft = getDaysUntilExpiry(subscription);
  const isTrial = subscription.status === "trialing";

  const modalContent = (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl bg-primary p-6 text-center shadow-xl"
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-description hover:text-secondary"
        >
          <X size={18} />
        </button>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
          <AlertTriangle className="text-amber-500" size={24} />
        </div>

        <h2 className="mt-4 text-lg font-bold text-secondary">
          {isTrial ? "Trial Kamu Segera Berakhir" : "Premium Kamu Segera Berakhir"}
        </h2>

        <p className="mt-2 text-sm text-description">
          {daysLeft === 0 ? (
            <>
              {isTrial ? "Trial" : "Premium"} kamu berakhir{" "}
              <span className="font-semibold text-amber-400">hari ini</span>.
            </>
          ) : (
            <>
              {isTrial ? "Trial" : "Premium"} kamu berakhir dalam{" "}
              <span className="font-semibold text-amber-400">{daysLeft} hari</span>.
            </>
          )}{" "}
          Setelah itu, fitur premium akan terkunci kembali.
        </p>

        <button
          onClick={handleUpgradeClick}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-subprimary py-2.5 text-sm font-medium text-secondary hover:opacity-90"
        >
          <Crown size={14} />
          Upgrade ke Premium
        </button>

        <button
          onClick={handleClose}
          className="mt-2 w-full py-2 text-xs text-description hover:text-secondary"
        >
          Nanti saja
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}