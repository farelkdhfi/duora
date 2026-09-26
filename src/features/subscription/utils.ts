
import type { MySubscription } from "./types";

export function isOnTrial(subscription: MySubscription | null): boolean {
  return subscription?.status === "trialing";
}

export function isPremium(subscription: MySubscription | null): boolean {
  return (
    subscription?.plan_type === "premium" &&
    (subscription.status === "trialing" || subscription.status === "active")
  );
}

export function getTrialDaysLeft(subscription: MySubscription | null): number {
  if (!subscription?.trial_ends_at) return 0;

  const end = new Date(subscription.trial_ends_at).getTime();
  const now = new Date().getTime();
  const diffMs = end - now;

  if (diffMs <= 0) return 0;

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

// Cek apakah suatu limit sudah tercapai
// limit null berarti unlimited, selalu return false (belum tercapai)
export function isLimitReached(currentCount: number, limit: number | null): boolean {
  if (limit === null) return false;
  return currentCount >= limit;
}

export function getDaysUntilExpiry(subscription: MySubscription | null): number | null {
  if (!subscription) return null;

  const expiryDate = subscription.status === "trialing"
    ? subscription.trial_ends_at
    : subscription.current_period_end;

  if (!expiryDate) return null;

  const end = new Date(expiryDate).getTime();
  const now = new Date().getTime();
  const diffMs = end - now;

  if (diffMs <= 0) return 0;

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function isNearingExpiry(subscription: MySubscription | null): boolean {
  const daysLeft = getDaysUntilExpiry(subscription);
  if (daysLeft === null) return false;

  const isRelevantStatus =
    subscription?.status === "trialing" || subscription?.status === "active";

  return isRelevantStatus && daysLeft <= 1;
}

// Cek apakah warning modal perlu ditampilkan:
// - Nearing expiry, DAN
// - Belum pernah ditampilkan UNTUK periode expiry saat ini
export function shouldShowExpiryWarning(subscription: MySubscription | null): boolean {
  if (!subscription) return false;
  if (!isNearingExpiry(subscription)) return false;

  const expiryDate =
    subscription.status === "trialing"
      ? subscription.trial_ends_at
      : subscription.current_period_end;

  if (!expiryDate) return false;

  if (!subscription.expiry_warning_shown_at) return true;

  // Reset otomatis: kalau expiry_warning_shown_at itu dari SEBELUM periode expiry saat ini
  // (misal shown_at bulan lalu, tapi expiry sekarang beda/baru), berarti ini periode baru, tampilkan lagi
  const shownAt = new Date(subscription.expiry_warning_shown_at).getTime();
  const expiry = new Date(expiryDate).getTime();

  // Kalau warning ditampilkan JAUH sebelum expiry saat ini (lebih dari 2 hari sebelumnya),
  // anggap itu warning dari periode lama, tampilkan lagi untuk periode baru ini
  const twoDaysBeforeExpiry = expiry - 2 * 24 * 60 * 60 * 1000;
  return shownAt < twoDaysBeforeExpiry;
}