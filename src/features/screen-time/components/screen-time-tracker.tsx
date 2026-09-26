// screen-time/components/screen-time-tracker.tsx

"use client";

import { useEffect, useRef } from "react";
import { useAddScreenTime } from "../queries";

const HEARTBEAT_INTERVAL_MS = 30_000; // kirim tiap 30 detik

export function ScreenTimeTracker() {
  const { mutate: addTime } = useAddScreenTime();
  const isVisibleRef = useRef(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    function handleVisibilityChange() {
      isVisibleRef.current = document.visibilityState === "visible";
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    isVisibleRef.current = document.visibilityState === "visible";

    intervalRef.current = setInterval(() => {
      if (isVisibleRef.current) {
        addTime(HEARTBEAT_INTERVAL_MS / 1000);
      }
    }, HEARTBEAT_INTERVAL_MS);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [addTime]);

  return null; // komponen invisible, cuma jalanin logic di background
}