// subscription/utils.ts

import type { MySubscription, SubscriptionPlanType } from "./types";

// GANTI: isPremium() dulu cuma cek binary, sekarang perlu bedain level
export function getActivePlanType(subscription: MySubscription | null): SubscriptionPlanType {
  if (!subscription) return "free";

  const isActiveOrTrialing =
    subscription.status === "active" || subscription.status === "trialing";

  if (!isActiveOrTrialing) return "free";

  return subscription.plan_type;
}

export function isPlusOrAbove(subscription: MySubscription | null): boolean {
  const plan = getActivePlanType(subscription);
  return plan === "plus" || plan === "pro";
}

export function isPro(subscription: MySubscription | null): boolean {
  return getActivePlanType(subscription) === "pro";
}

export function isOnTrial(subscription: MySubscription | null): boolean {
  return subscription?.status === "trialing";
}

export function getTrialDaysLeft(subscription: MySubscription | null): number {
  if (!subscription?.trial_ends_at) return 0;

  const end = new Date(subscription.trial_ends_at).getTime();
  const now = new Date().getTime();
  const diffMs = end - now;

  if (diffMs <= 0) return 0;

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
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

export function shouldShowExpiryWarning(subscription: MySubscription | null): boolean {
  if (!subscription) return false;
  if (!isNearingExpiry(subscription)) return false;

  const expiryDate =
    subscription.status === "trialing"
      ? subscription.trial_ends_at
      : subscription.current_period_end;

  if (!expiryDate) return false;

  if (!subscription.expiry_warning_shown_at) return true;

  const shownAt = new Date(subscription.expiry_warning_shown_at).getTime();
  const expiry = new Date(expiryDate).getTime();

  const twoDaysBeforeExpiry = expiry - 2 * 24 * 60 * 60 * 1000;
  return shownAt < twoDaysBeforeExpiry;
}

export const planLabels: Record<SubscriptionPlanType, string> = {
  free: "Free",
  plus: "Plus",
  pro: "Pro",
};