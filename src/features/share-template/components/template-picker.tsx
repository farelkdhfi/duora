// share-template/components/template-picker.tsx

"use client";

import { useState } from "react";
import { Check, Lock, Palette } from "lucide-react";
import { TEMPLATE_PRESETS } from "../presets";
import { useTemplatePreference, useUpsertTemplatePreference } from "../queries";
import { useMySubscription } from "@/features/subscription/queries";

interface TemplatePickerProps {
  relationshipId: string;
}

export function TemplatePicker({ relationshipId }: TemplatePickerProps) {
  const { data: subscription } = useMySubscription();
  const { data: preference } = useTemplatePreference(relationshipId);
  const { mutate: savePreference, isPending } = useUpsertTemplatePreference();

  const [customFrom, setCustomFrom] = useState(preference?.custom_color_from ?? "#ec4899");
  const [customVia, setCustomVia] = useState(preference?.custom_color_via ?? "#fb7185");
  const [customTo, setCustomTo] = useState(preference?.custom_color_to ?? "#fdba74");

  const canCustomize = subscription
    ? subscription.can_customize_share_template
    : false; // fallback ketat: anggap free (tidak bisa custom)

  const selectedPresetId = preference?.preset_id ?? "sunset";
  const isCustomMode = preference?.template_mode === "custom";

  function handleSelectPreset(presetId: string) {
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
      presetId: selectedPresetId, // tetap simpan preset terakhir sebagai fallback
      customColorFrom: customFrom,
      customColorVia: customVia,
      customColorTo: customTo,
    });
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Palette size={16} className="text-gray-400" />
        <h3 className="text-sm font-semibold">Pilih Tema Share Card</h3>
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {TEMPLATE_PRESETS.map((preset) => {
          const isLocked = preset.isPremium && !canCustomize;
          const isSelected =
            !isCustomMode && selectedPresetId === preset.id;

          return (
            <button
              key={preset.id}
              type="button"
              disabled={isLocked || isPending}
              onClick={() => handleSelectPreset(preset.id)}
              className={`relative overflow-hidden rounded-xl border-2 p-3 text-left transition ${
                isSelected ? "border-pink-500" : "border-transparent"
              } ${isLocked ? "cursor-not-allowed opacity-60" : "hover:border-gray-200"}`}
            >
              <div
                className={`h-14 w-full rounded-lg bg-gradient-to-br ${preset.gradientClass}`}
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-medium">{preset.name}</span>
                {isSelected && <Check size={14} className="text-pink-500" />}
                {isLocked && <Lock size={12} className="text-gray-400" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom color picker - hanya untuk premium */}
      {canCustomize ? (
        <div className="mt-5 border-t border-gray-100 pt-4">
          <p className="mb-3 text-xs font-medium text-gray-500">
            Atau buat warna sendiri
          </p>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-[10px] text-gray-400">Warna 1</label>
              <input
                type="color"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="h-9 w-full cursor-pointer rounded-md border border-gray-200"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-[10px] text-gray-400">Warna 2</label>
              <input
                type="color"
                value={customVia}
                onChange={(e) => setCustomVia(e.target.value)}
                className="h-9 w-full cursor-pointer rounded-md border border-gray-200"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-[10px] text-gray-400">Warna 3</label>
              <input
                type="color"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="h-9 w-full cursor-pointer rounded-md border border-gray-200"
              />
            </div>
          </div>

          <div
            className="mt-3 h-12 w-full rounded-lg"
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${customFrom}, ${customVia}, ${customTo})`,
            }}
          />

          <button
            type="button"
            onClick={handleApplyCustom}
            disabled={isPending}
            className="mt-3 w-full rounded-lg bg-pink-500 py-2 text-xs font-medium text-white hover:bg-pink-600 disabled:opacity-50"
          >
            {isPending ? "Menyimpan..." : "Terapkan Warna Custom"}
          </button>
        </div>
      ) : (
        <div className="mt-4 rounded-lg bg-amber-50 p-3 text-center text-xs text-amber-600">
          🔒 Upgrade ke Premium untuk custom warna sendiri & akses semua tema
        </div>
      )}
    </div>
  );
}