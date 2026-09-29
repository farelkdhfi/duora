"use client";

import {
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from "react";

interface WrappedCardProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const WrappedCard = forwardRef<
  HTMLDivElement,
  WrappedCardProps
>(({ children, className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={`relative aspect-[9/16] w-[540px] shrink-0 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
});

WrappedCard.displayName = "WrappedCard";