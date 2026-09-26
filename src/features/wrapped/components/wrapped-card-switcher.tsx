// wrapped/components/wrapped-card-switcher.tsx

"use client";

import { forwardRef } from "react";
import { WrappedCardSoft } from "./templates/wrapped-card-soft";
import { WrappedCardBold } from "./templates/wrapped-card-bold";
import { WrappedCardMinimal } from "./templates/wrapped-card-minimal";
import type {
  MoodSummaryItem,
  GoalsWrappedSummary,
  MeetupSummary,
  WrappedTemplateId,
  ScreenTimeWrappedSummary,
} from "../types";

interface WrappedCardSwitcherProps {
  templateId: WrappedTemplateId;
  relationshipName: string;
  startedAt: string;
  moodSummary: MoodSummaryItem[];
  goalsSummary: GoalsWrappedSummary;
  meetupSummary: MeetupSummary;
  screenTimeSummary: ScreenTimeWrappedSummary | null;
  milestoneLabel: string;
  showMood: boolean;
  showMeetup: boolean;
  showGoals: boolean;
  showScreenTime: boolean;
  customColorPrimary?: string | null;
  customColorSecondary?: string | null;
}

export const WrappedCardSwitcher = forwardRef<HTMLDivElement, WrappedCardSwitcherProps>(
  ({ templateId, customColorPrimary, customColorSecondary, ...commonProps }, ref) => {
    switch (templateId) {
      case "bold":
        return (
          <WrappedCardBold
            ref={ref}
            {...commonProps}
            customColorPrimary={customColorPrimary}
            customColorSecondary={customColorSecondary}
          />
        );
      case "minimal":
        return <WrappedCardMinimal ref={ref} {...commonProps} />;
      case "soft":
      default:
        return <WrappedCardSoft ref={ref} {...commonProps} />;
    }
  }
);

WrappedCardSwitcher.displayName = "WrappedCardSwitcher";