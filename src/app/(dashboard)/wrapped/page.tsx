"use client";

import { Sparkles } from "lucide-react";

import Header from "@/components/layout/header";
import { useMyRelationshipDetails } from "@/features/relationship/queries";
import { WrappedGenerator } from "@/features/wrapped/components/wrapped-generator";

export default function WrappedPage() {
  const { data: relationshipDetails, isLoading } =
    useMyRelationshipDetails();

  if (isLoading) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full bg-pink-200/20 blur-[120px]" />

        <div className="pointer-events-none absolute -right-32 bottom-20 size-80 rounded-full bg-blue-200/20 blur-[120px]" />

        <div className="relative text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-50 to-blue-50">
            <Sparkles
              size={17}
              strokeWidth={1.8}
              className="animate-pulse text-pink-400"
            />
          </div>

          <p className="mt-3 text-[12px] text-neutral-400">
            Preparing your wrapped...
          </p>
        </div>
      </div>
    );
  }

  if (!relationshipDetails) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full bg-blue-200/20 blur-[120px]" />

        <div className="pointer-events-none absolute -right-32 bottom-20 size-80 rounded-full bg-pink-200/20 blur-[120px]" />

        <div className="relative text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-50 to-blue-50">
            <Sparkles
              size={17}
              strokeWidth={1.8}
              className="text-pink-400"
            />
          </div>

          <h2 className="mt-4 text-base font-semibold tracking-[-0.03em] text-neutral-800">
            Connect with your partner
          </h2>

          <p className="mx-auto mt-1.5 max-w-sm text-[12px] leading-5 text-neutral-400">
            Connect your relationship first to create your shared wrapped.
          </p>
        </div>
      </div>
    );
  }

  const { relationship } = relationshipDetails;

  if (!relationship.started_at) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full bg-pink-200/20 blur-[120px]" />

        <div className="pointer-events-none absolute -right-32 bottom-20 size-80 rounded-full bg-blue-200/20 blur-[120px]" />

        <div className="relative text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-50 to-blue-50">
            <Sparkles
              size={17}
              strokeWidth={1.8}
              className="text-pink-400"
            />
          </div>

          <h2 className="mt-4 text-base font-semibold tracking-[-0.03em] text-neutral-800">
            Start your story
          </h2>

          <p className="mx-auto mt-1.5 max-w-sm text-[12px] leading-5 text-neutral-400">
            Set your relationship start date first to create your wrapped.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-hidden">
      <div className="pointer-events-none absolute -left-40 top-20 size-96 rounded-full bg-pink-200/15 blur-[140px]" />

      <div className="pointer-events-none absolute -right-40 bottom-20 size-96 rounded-full bg-blue-200/15 blur-[140px]" />

      <Header
        title="wrapped"
        description="Turn your shared moments into something worth keeping."
        icon={Sparkles}
      />

      <div className="relative mt-6 sm:mt-8">
        <WrappedGenerator
          relationshipId={relationship.id}
          relationshipName={relationship.name}
          startedAt={relationship.started_at}
        />
      </div>
    </div>
  );
}