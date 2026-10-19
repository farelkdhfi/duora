"use client";

import { useState } from "react";
import { Check, ChevronRight, Lock, Palette, Sparkles } from "lucide-react";

import {
  TEMPLATE_PRESETS,
} from "../presets";

import {
  canAccessTemplate,
} from "../types";

import type {
  CountdownPlanAccess,
} from "../types";

import {
  useTemplatePreference,
  useUpsertTemplatePreference,
} from "../queries";
import { useMySubscription } from "@/features/subscription/queries";

interface TemplatePickerProps {
  relationshipId: string;
}

export function TemplatePicker({
  relationshipId,
}: TemplatePickerProps) {
  const { data: subscription } = useMySubscription();
  const { data: preference } =
    useTemplatePreference(relationshipId);

  const {
    mutate: savePreference,
    isPending,
  } = useUpsertTemplatePreference();

  const [customFrom, setCustomFrom] = useState(
    preference?.custom_color_from ?? "#ec4899"
  );

  const [customVia, setCustomVia] = useState(
    preference?.custom_color_via ?? "#fb7185"
  );

  const [customTo, setCustomTo] = useState(
    preference?.custom_color_to ?? "#fdba74"
  );

  const currentPlan: CountdownPlanAccess =
    subscription?.plan_type === "pro"
      ? "pro"
      : subscription?.plan_type === "plus"
        ? "plus"
        : "free";

  const canCustomize =
    currentPlan !== "free";

  const selectedPresetId =
    preference?.preset_id ?? "sunset";

  const isCustomMode =
    preference?.template_mode === "custom";

  function handleSelectPreset(
    presetId: string,
  ) {
    const preset = TEMPLATE_PRESETS.find(
      (item) => item.id === presetId,
    );

    if (!preset) {
      return;
    }

    const hasAccess = canAccessTemplate(
      preset,
      currentPlan,
    );

    if (!hasAccess) {
      return;
    }

    savePreference({
      relationshipId,
      templateMode: "preset",
      presetId,
    });
  }

  function handleApplyCustom() {
    savePreference({
      relationshipId,
      templateMode: "custom",
      presetId: selectedPresetId,
      customColorFrom: customFrom,
      customColorVia: customVia,
      customColorTo: customTo,
    });
  }

  return (
    <section className="overflow-hidden rounded-[24px] border border-white/10 bg-primary shadow-[0_12px_40px_-24px_rgba(0,0,0,0.22)]">
      {/* Header */}
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-subprimary">
              <Palette
                size={14}
                strokeWidth={1.7}
                className="text-description"
              />
            </div>

            <div>
              <h3 className="text-[13px] font-semibold tracking-[-0.02em] text-secondary">
                Card appearance
              </h3>

              <p className="mt-0.5 text-[10px] text-description">
                Choose the look for your countdown
              </p>
            </div>
          </div>

          {isCustomMode && (
            <span className="rounded-full bg-subprimary px-2.5 py-1 text-[9px] font-medium text-description">
              Custom
            </span>
          )}
        </div>
      </div>

      {/* Presets */}
      <div className="px-5 py-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-description">
            Presets
          </span>

          <span className="text-[10px] text-description">
            {TEMPLATE_PRESETS.length} styles
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {TEMPLATE_PRESETS.map((preset) => {
            const isLocked =
              !canAccessTemplate(
                preset,
                currentPlan,
              );

            const isSelected =
              !isCustomMode &&
              selectedPresetId === preset.id;

            return (
              <button
                key={preset.id}
                type="button"
                disabled={isLocked || isPending}
                onClick={() =>
                  handleSelectPreset(preset.id)
                }
                className={`group relative overflow-hidden rounded-[16px] text-left transition-all duration-200 ${isSelected
                  ? "ring-1 ring-secondary ring-offset-2 ring-offset-primary"
                  : ""
                  } ${isLocked
                    ? "cursor-not-allowed"
                    : "hover:-translate-y-0.5"
                  }`}
              >
                {/* Gradient preview */}
                <div
                  className={`relative h-[76px] overflow-hidden bg-gradient-to-br ${preset.gradientClass}`}
                >
                  {/* Soft overlay */}
                  <div className="absolute inset-0 bg-white/[0.04]" />

                  {/* Selection */}
                  {isSelected && (
                    <div className="absolute right-2.5 top-2.5 flex size-6 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_-4px_rgba(0,0,0,0.3)]">
                      <Check
                        size={12}
                        strokeWidth={2.5}
                        className="text-[#171717]"
                      />
                    </div>
                  )}

                  {/* Lock */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/[0.12] backdrop-blur-[1px]">
                      <div className="flex size-7 items-center justify-center rounded-full bg-white/80 shadow-sm">
                        <Lock
                          size={12}
                          strokeWidth={1.8}
                          className="text-black/45"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Label */}
                <div
                  className={`flex items-center justify-between border px-3 py-2.5 ${isSelected
                    ? "border-white/10 bg-subprimary"
                    : "border-white/10 bg-primary"
                    }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-secondary">
                      {preset.name}
                    </p>

                    {preset.minPlan !== "free" && (
                      <p className="mt-0.5 text-[9px] text-description">
                        {preset.minPlan === "plus"
                          ? "Plus"
                          : "Pro"}
                      </p>
                    )}
                  </div>

                  {!isLocked && !isSelected && (
                    <ChevronRight
                      size={12}
                      strokeWidth={1.7}
                      className="shrink-0 text-description transition-transform group-hover:translate-x-0.5"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom */}
      <div className="border-t border-white/10">
        {canCustomize ? (
          <div className="px-5 py-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={13}
                    strokeWidth={1.7}
                    className="text-description"
                  />

                  <p className="text-[11px] font-semibold text-secondary">
                    Your own palette
                  </p>
                </div>

                <p className="mt-1 text-[10px] leading-relaxed text-description">
                  Create a gradient that feels like yours.
                </p>
              </div>

              {isCustomMode && (
                <span className="shrink-0 text-[9px] font-medium text-description">
                  Active
                </span>
              )}
            </div>

            {/* Color controls */}
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  label: "Start",
                  value: customFrom,
                  onChange: setCustomFrom,
                },
                {
                  label: "Middle",
                  value: customVia,
                  onChange: setCustomVia,
                },
                {
                  label: "End",
                  value: customTo,
                  onChange: setCustomTo,
                },
              ].map((color) => (
                <label
                  key={color.label}
                  className="group cursor-pointer"
                >
                  <div className="mb-1.5 flex items-center justify-between px-0.5">
                    <span className="text-[9px] font-medium text-description">
                      {color.label}
                    </span>

                    <span className="font-mono text-[8px] uppercase text-description">
                      {color.value}
                    </span>
                  </div>

                  <div className="relative h-11 overflow-hidden rounded-xl border border-white/10 bg-subprimary transition group-hover:border-white/20">
                    <div
                      className="absolute inset-1 rounded-[9px]"
                      style={{
                        backgroundColor: color.value,
                      }}
                    />

                    <input
                      type="color"
                      value={color.value}
                      onChange={(e) =>
                        color.onChange(e.target.value)
                      }
                      className="absolute inset-0 size-full cursor-pointer opacity-0"
                    />
                  </div>
                </label>
              ))}
            </div>

            {/* Preview */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[9px] font-medium uppercase tracking-[0.1em] text-description">
                  Preview
                </span>

                <span className="text-[9px] text-description">
                  9:16
                </span>
              </div>

              <div className="relative h-24 overflow-hidden rounded-[16px] border border-white/10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, ${customFrom}, ${customVia}, ${customTo})`,
                  }}
                />

                <div className="absolute inset-0 bg-black/[0.04]" />

                <div className="absolute bottom-3 left-3">
                  <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-white/60">
                    Next meetup
                  </p>

                  <p className="mt-0.5 text-sm font-semibold tracking-[-0.03em] text-white">
                    A little closer
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyCustom}
              disabled={isPending}
              className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-subprimary text-[11px] font-medium text-secondary transition hover:bg-subprimary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending
                ? "Saving..."
                : "Apply custom palette"}

              {!isPending && (
                <ChevronRight
                  size={13}
                  strokeWidth={1.8}
                />
              )}
            </button>
          </div>
        ) : (
          <div className="px-5 py-5">
            <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-subprimary p-4">
              <div className="absolute -right-8 -top-8 size-24 rounded-full bg-pink-500/10 blur-2xl" />

              <div className="relative flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary shadow-sm ring-1 ring-white/10">
                  <Lock
                    size={12}
                    strokeWidth={1.7}
                    className="text-description"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-secondary">
                    Make it yours
                  </p>

                  <p className="mt-1 text-[10px] leading-relaxed text-description">
                    Unlock custom colors and premium
                    templates with DUONEAR Premium.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}