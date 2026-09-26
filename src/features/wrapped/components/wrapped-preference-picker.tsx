"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ChevronRight,
  Lock,
  Palette,
} from "lucide-react";

import { WRAPPED_TEMPLATES } from "../template-registry";

import {
  useWrappedPreference,
  useUpsertWrappedPreference,
} from "../queries";

import { useMySubscription } from "@/features/subscription/queries";

import type { WrappedTemplateId } from "../types";

interface WrappedPreferencePickerProps {
  relationshipId: string;
}

export function WrappedPreferencePicker({
  relationshipId,
}: WrappedPreferencePickerProps) {
  const { data: subscription } =
    useMySubscription();

  const { data: preference } =
    useWrappedPreference(relationshipId);

  const {
    mutate: savePreference,
    isPending,
  } = useUpsertWrappedPreference();

  const isPremium = subscription
    ? subscription.plan_type === "premium" &&
      (subscription.status === "trialing" ||
        subscription.status === "active")
    : false;

  const [templateId, setTemplateId] =
    useState<WrappedTemplateId>(
      preference?.template_id ?? "soft",
    );

  const [showMood, setShowMood] =
    useState(
      preference?.show_mood ?? true,
    );

  const [showMeetup, setShowMeetup] =
    useState(
      preference?.show_meetup ?? true,
    );

  const [showGoals, setShowGoals] =
    useState(
      preference?.show_goals ?? true,
    );

  const [showScreenTime, setShowScreenTime] =
    useState(
      preference?.show_screen_time ?? true,
    );

  const [customPrimary, setCustomPrimary] =
    useState(
      preference?.custom_color_primary ??
        "#171717",
    );

  const [customSecondary, setCustomSecondary] =
    useState(
      preference?.custom_color_secondary ??
        "#ec4899",
    );

  /* ======================================================= */
  /* SYNC SERVER STATE */
  /* ======================================================= */

  useEffect(() => {
    if (!preference) return;

    setTemplateId(
      preference.template_id,
    );

    setShowMood(
      preference.show_mood,
    );

    setShowMeetup(
      preference.show_meetup,
    );

    setShowGoals(
      preference.show_goals,
    );

    // FIX:
    // sebelumnya salah:
    // setShowGoals(preference.show_screen_time)
    setShowScreenTime(
      preference.show_screen_time,
    );

    if (
      preference.custom_color_primary
    ) {
      setCustomPrimary(
        preference.custom_color_primary,
      );
    }

    if (
      preference.custom_color_secondary
    ) {
      setCustomSecondary(
        preference.custom_color_secondary,
      );
    }
  }, [preference]);

  /* ======================================================= */
  /* PERSIST */
  /* ======================================================= */

  function persist(
    overrides?: Partial<{
      templateId: WrappedTemplateId;
      showMood: boolean;
      showMeetup: boolean;
      showGoals: boolean;
      showScreenTime: boolean;
      customPrimary: string;
      customSecondary: string;
    }>,
  ) {
    const next = {
      templateId:
        overrides?.templateId ??
        templateId,

      showMood:
        overrides?.showMood ??
        showMood,

      showMeetup:
        overrides?.showMeetup ??
        showMeetup,

      showGoals:
        overrides?.showGoals ??
        showGoals,

      showScreenTime:
        overrides?.showScreenTime ??
        showScreenTime,

      customPrimary:
        overrides?.customPrimary ??
        customPrimary,

      customSecondary:
        overrides?.customSecondary ??
        customSecondary,
    };

    savePreference({
      relationshipId,

      templateId:
        next.templateId,

      showMood:
        next.showMood,

      showMeetup:
        next.showMeetup,

      showGoals:
        next.showGoals,

      showScreenTime:
        next.showScreenTime,

      customColorPrimary:
        next.templateId === "bold" &&
        isPremium
          ? next.customPrimary
          : null,

      customColorSecondary:
        next.templateId === "bold" &&
        isPremium
          ? next.customSecondary
          : null,
    });
  }

  /* ======================================================= */
  /* TEMPLATE */
  /* ======================================================= */

  function handleSelectTemplate(
    id: WrappedTemplateId,
  ) {
    const template = WRAPPED_TEMPLATES.find(
      (item) => item.id === id,
    );

    if (
      template?.isPremium &&
      !isPremium
    ) {
      return;
    }

    setTemplateId(id);

    persist({
      templateId: id,
    });
  }

  /* ======================================================= */
  /* TOGGLE */
  /* ======================================================= */

  function handleToggleSection(
    section:
      | "mood"
      | "meetup"
      | "goals"
      | "screenTime",
    value: boolean,
  ) {
    if (section === "mood") {
      setShowMood(value);

      persist({
        showMood: value,
      });

      return;
    }

    if (section === "meetup") {
      setShowMeetup(value);

      persist({
        showMeetup: value,
      });

      return;
    }

    if (section === "goals") {
      setShowGoals(value);

      persist({
        showGoals: value,
      });

      return;
    }

    setShowScreenTime(value);

    persist({
      showScreenTime: value,
    });
  }

  /* ======================================================= */
  /* COLORS */
  /* ======================================================= */

  function handleApplyCustomColor() {
    persist({
      customPrimary,
      customSecondary,
    });
  }

  const selectedTemplateInfo =
    WRAPPED_TEMPLATES.find(
      (template) =>
        template.id === templateId,
    );

  const sections = [
    {
      key: "mood" as const,
      label: "Mood check-in",
      description:
        "Your emotional rhythm",
      value: showMood,
    },
    {
      key: "meetup" as const,
      label: "Meetups & distance",
      description:
        "Visits and distance traveled",
      value: showMeetup,
    },
    {
      key: "goals" as const,
      label: "Goals & savings",
      description:
        "Things you're building together",
      value: showGoals,
    },
    {
      key: "screenTime" as const,
      label: "Screen time & streak",
      description:
        "Your digital time together",
      value: showScreenTime,
    },
  ];

  return (
    <div className="space-y-7">
      {/* ================================================= */}
      {/* TEMPLATE */}
      {/* ================================================= */}

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-neutral-300
              "
            >
              Appearance
            </p>

            <h3
              className="
                mt-1
                text-sm
                font-semibold
                tracking-[-0.025em]
                text-neutral-900
              "
            >
              Choose your style
            </h3>
          </div>

          {isPending && (
            <span
              className="
                text-[10px]
                font-medium
                text-neutral-400
              "
            >
              Saving...
            </span>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {WRAPPED_TEMPLATES.map(
            (template) => {
              const isLocked =
                template.isPremium &&
                !isPremium;

              const isSelected =
                templateId === template.id;

              return (
                <button
                  key={template.id}
                  type="button"
                  disabled={
                    isLocked ||
                    isPending
                  }
                  onClick={() =>
                    handleSelectTemplate(
                      template.id,
                    )
                  }
                  className={`
                    group
                    relative
                    flex
                    w-full
                    items-center
                    gap-3.5
                    rounded-2xl
                    border
                    px-3.5
                    py-3
                    text-left
                    transition-all
                    duration-200
                    ${
                      isSelected
                        ? "border-black/[0.10] bg-neutral-50"
                        : "border-black/[0.05] bg-white hover:border-black/[0.09] hover:bg-neutral-50/70"
                    }
                    ${
                      isLocked
                        ? "cursor-not-allowed opacity-55"
                        : ""
                    }
                  `}
                >
                  {/* mini preview */}

                  <TemplatePreview
                    templateId={
                      template.id
                    }
                    selected={
                      isSelected
                    }
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="
                          text-xs
                          font-semibold
                          text-neutral-800
                        "
                      >
                        {template.name}
                      </span>

                      {template.isPremium && (
                        <span
                          className="
                            rounded-full
                            border
                            border-pink-100
                            bg-pink-50
                            px-1.5
                            py-0.5
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-[0.08em]
                            text-pink-500
                          "
                        >
                          Pro
                        </span>
                      )}
                    </div>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-[10px]
                        leading-4
                        text-neutral-400
                      "
                    >
                      {template.description}
                    </p>
                  </div>

                  <div
                    className={`
                      flex
                      size-6
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      transition
                      ${
                        isSelected
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-black/[0.07] bg-white text-transparent"
                      }
                    `}
                  >
                    {isLocked ? (
                      <Lock
                        size={10}
                        className="text-neutral-400"
                      />
                    ) : (
                      <Check
                        size={11}
                        strokeWidth={2.5}
                      />
                    )}
                  </div>
                </button>
              );
            },
          )}
        </div>

        {selectedTemplateInfo && (
          <div
            className="
              mt-3
              flex
              items-center
              gap-2
              text-[10px]
              text-neutral-400
            "
          >
            <span className="size-1 rounded-full bg-pink-400" />

            <span>
              {selectedTemplateInfo.name} selected
            </span>
          </div>
        )}
      </section>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <section
        className="
          border-t
          border-black/[0.05]
          pt-6
        "
      >
        <div>
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.15em]
              text-neutral-300
            "
          >
            Your story
          </p>

          <h3
            className="
              mt-1
              text-sm
              font-semibold
              tracking-[-0.025em]
              text-neutral-900
            "
          >
            Choose what stays in it
          </h3>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-black/[0.05]">
          {sections.map(
            (item, index) => (
              <PreferenceRow
                key={item.key}
                label={item.label}
                description={
                  item.description
                }
                checked={item.value}
                disabled={isPending}
                first={index === 0}
                onChange={(value) =>
                  handleToggleSection(
                    item.key,
                    value,
                  )
                }
              />
            ),
          )}
        </div>

        <p
          className="
            mt-2.5
            text-[10px]
            leading-4
            text-neutral-400
          "
        >
          Your total LDR days always remain
          visible as the main story.
        </p>
      </section>

      {/* ================================================= */}
      {/* CUSTOM COLOR */}
      {/* ================================================= */}

      {templateId === "bold" && (
        <section
          className="
            border-t
            border-black/[0.05]
            pt-6
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                size-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-black/[0.05]
                bg-neutral-50
                text-neutral-500
              "
            >
              <Palette size={15} />
            </div>

            <div>
              <p
                className="
                  text-sm
                  font-semibold
                  tracking-[-0.025em]
                  text-neutral-900
                "
              >
                Custom colors
              </p>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  leading-4
                  text-neutral-400
                "
              >
                Personalize the gradient of
                your Bold wrapped.
              </p>
            </div>
          </div>

          {isPremium ? (
            <div className="mt-5">
              <div className="grid grid-cols-2 gap-3">
                <ColorInput
                  label="Primary"
                  value={customPrimary}
                  onChange={
                    setCustomPrimary
                  }
                />

                <ColorInput
                  label="Secondary"
                  value={customSecondary}
                  onChange={
                    setCustomSecondary
                  }
                />
              </div>

              <button
                type="button"
                onClick={
                  handleApplyCustomColor
                }
                disabled={isPending}
                className="
                  mt-3
                  flex
                  h-10
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-neutral-900
                  text-xs
                  font-medium
                  text-white
                  transition
                  hover:bg-neutral-800
                  disabled:opacity-40
                "
              >
                <span>
                  {isPending
                    ? "Saving..."
                    : "Apply colors"}
                </span>

                {!isPending && (
                  <ChevronRight
                    size={13}
                  />
                )}
              </button>
            </div>
          ) : (
            <div
              className="
                mt-4
                rounded-2xl
                border
                border-black/[0.05]
                bg-[#fafaf9]
                p-4
              "
            >
              <div className="flex items-start gap-3">
                <div
                  className="
                    flex
                    size-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-neutral-900
                    text-white
                  "
                >
                  <Lock size={12} />
                </div>

                <div>
                  <p
                    className="
                      text-xs
                      font-semibold
                      text-neutral-800
                    "
                  >
                    Premium customization
                  </p>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      leading-4
                      text-neutral-400
                    "
                  >
                    Custom colors and premium
                    wrapped styles are available
                    with Duora Premium.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

/* ========================================================= */
/* TEMPLATE PREVIEW */
/* ========================================================= */

function TemplatePreview({
  templateId,
  selected,
}: {
  templateId: WrappedTemplateId;
  selected: boolean;
}) {
  if (templateId === "bold") {
    return (
      <div
        className="
          relative
          flex
          h-14
          w-10
          shrink-0
          overflow-hidden
          rounded-lg
          border
          border-black/[0.06]
          bg-neutral-900
        "
      >
        <div
          className="
            absolute
            -right-4
            -top-4
            size-10
            rounded-full
            bg-pink-500/30
            blur-md
          "
        />

        <div
          className="
            absolute
            -bottom-4
            -left-3
            size-9
            rounded-full
            bg-blue-500/20
            blur-md
          "
        />

        <div className="relative m-auto h-7 w-7">
          <div className="h-1 w-4 rounded-full bg-white/80" />
          <div className="mt-1 h-2.5 w-6 rounded bg-white/20" />
          <div className="mt-1 h-1 w-5 rounded bg-white/10" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        relative
        flex
        h-14
        w-10
        shrink-0
        overflow-hidden
        rounded-lg
        border
        ${
          selected
            ? "border-black/[0.10]"
            : "border-black/[0.06]"
        }
        bg-[#f3f1ee]
      `}
    >
      <div
        className="
          absolute
          -right-3
          -top-3
          size-8
          rounded-full
          bg-pink-200/60
          blur-md
        "
      />

      <div className="relative m-auto h-7 w-7">
        <div className="h-1 w-4 rounded-full bg-neutral-800/80" />
        <div className="mt-1 h-2.5 w-6 rounded bg-neutral-800/10" />
        <div className="mt-1 h-1 w-5 rounded bg-neutral-800/10" />
      </div>
    </div>
  );
}

/* ========================================================= */
/* PREFERENCE ROW */
/* ========================================================= */

function PreferenceRow({
  label,
  description,
  checked,
  disabled,
  first,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  first: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 bg-white px-3.5 py-3 transition hover:bg-neutral-50 ${!first ? "border-t border-black/[0.045]" : ""}`}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-neutral-700">
          {label}
        </p>

        <p className="mt-0.5 truncate text-[9px] text-neutral-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ${checked ? "bg-neutral-900" : "bg-neutral-200"} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      >
        <span
          className={`block size-4 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.2)] transition-transform duration-200 ease-out ${checked ? "translate-x-4" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}

/* ========================================================= */
/* COLOR INPUT */
/* ========================================================= */

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span
        className="
          mb-1.5
          block
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.12em]
          text-neutral-400
        "
      >
        {label}
      </span>

      <div
        className="
          flex
          h-10
          items-center
          gap-2
          rounded-xl
          border
          border-black/[0.06]
          bg-neutral-50
          px-2
        "
      >
        <input
          type="color"
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          className="
            size-6
            cursor-pointer
            overflow-hidden
            rounded-lg
            border-0
            bg-transparent
            p-0
          "
        />

        <span
          className="
            font-mono
            text-[10px]
            uppercase
            text-neutral-500
          "
        >
          {value}
        </span>
      </div>
    </label>
  );
}