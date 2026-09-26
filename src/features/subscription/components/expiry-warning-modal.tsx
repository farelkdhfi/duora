"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X, Crown } from "lucide-react";
import { useMySubscription, useMarkExpiryWarningShown } from "../queries";
import { shouldShowExpiryWarning, getDaysUntilExpiry } from "../utils";
import { UpgradeModal } from "./upgrade-modal";

export function ExpiryWarningModal() {
  const { data: subscription } = useMySubscription();
  const { mutate: markShown } = useMarkExpiryWarningShown();

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

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
    setIsUpgradeOpen(true);
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
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-300 hover:text-gray-500"
        >
          <X size={18} />
        </button>

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
          <AlertTriangle className="text-amber-500" size={24} />
        </div>

        <h2 className="mt-4 text-lg font-bold">
          {isTrial ? "Trial Kamu Segera Berakhir" : "Premium Kamu Segera Berakhir"}
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {daysLeft === 0 ? (
            <>
              {isTrial ? "Trial" : "Premium"} kamu berakhir{" "}
              <span className="font-semibold text-amber-600">hari ini</span>.
            </>
          ) : (
            <>
              {isTrial ? "Trial" : "Premium"} kamu berakhir dalam{" "}
              <span className="font-semibold text-amber-600">{daysLeft} hari</span>.
            </>
          )}{" "}
          Setelah itu, fitur premium akan terkunci kembali.
        </p>

        <button
          onClick={handleUpgradeClick}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          <Crown size={14} />
          Upgrade ke Premium
        </button>

        <button
          onClick={handleClose}
          className="mt-2 w-full py-2 text-xs text-gray-400 hover:text-gray-600"
        >
          Nanti saja
        </button>
      </div>

      {isUpgradeOpen && <UpgradeModal onClose={() => setIsUpgradeOpen(false)} />}
    </div>
  );

  return createPortal(modalContent, document.body);
}