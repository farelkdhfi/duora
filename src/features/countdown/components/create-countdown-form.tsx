"use client";

import { useState } from "react";
import { useCreateCountdown } from "../queries";
import type { CountdownMember } from "../types";

interface CreateCountdownFormProps {
  relationshipId: string;
  members: CountdownMember[];
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-subprimary px-4 py-3.5 text-[13px] text-secondary outline-none transition placeholder:text-description focus:border-white/25 focus:ring-4 focus:ring-white/5 disabled:cursor-not-allowed disabled:opacity-50";

const hintClass = "mt-2 text-[10px] text-description";

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[11px] font-medium uppercase tracking-[0.14em] text-description"
    >
      {children}
    </label>
  );
}

export function CreateCountdownForm({
  relationshipId,
  members,
  open,
  onClose,
  onSuccess,
}: CreateCountdownFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [meetupDate, setMeetupDate] = useState("");
  const [meetupTime, setMeetupTime] = useState("12:00");
  const [locA, setLocA] = useState("");
  const [locB, setLocB] = useState("");
  const [distanceKm, setDistanceKm] = useState("");

  const {
    mutate: createCountdown,
    isPending,
    error,
  } = useCreateCountdown();

  const memberA = members[0];
  const memberB = members[1];

  if (!open) {
    return null;
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setLocation("");
    setMeetupDate("");
    setMeetupTime("12:00");
    setLocA("");
    setLocB("");
    setDistanceKm("");
  }

  function handleClose() {
    if (isPending) return;

    resetForm();
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !meetupDate) return;

    const combinedDateTime = new Date(
      `${meetupDate}T${meetupTime}:00`
    ).toISOString();

    createCountdown(
      {
        relationship_id: relationshipId,
        title: title.trim(),
        description: description.trim() || null,
        location: location.trim() || null,
        meetup_date: combinedDateTime,
        location_user_a_id: memberA?.user_id ?? null,
        location_user_a_text: locA.trim() || null,
        location_user_b_id: memberB?.user_id ?? null,
        location_user_b_text: locB.trim() || null,
        distance_km: distanceKm ? parseFloat(distanceKm) : null,
      },
      {
        onSuccess: () => {
          resetForm();
          onSuccess?.();
          onClose();
        },
      }
    );
  }

  return (
    <div
      className="fixed inset-0 z-[53] flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) {
          handleClose();
        }
      }}
    >
      <div className="relative max-h-[90vh] w-full overflow-hidden rounded-t-[2rem] border-x-0 border-b-0 border-t border-white/10 bg-primary">
        {/* Gradient halus di bagian atas */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.06] to-transparent" />

        {/* Handle */}
        <div className="relative flex justify-center pt-3">
          <div className="h-1 w-10 rounded-full bg-white/15" />
        </div>

        {/* Scroll area */}
        <div className="modal-scroll relative max-h-[calc(90vh-1.75rem)] overflow-y-auto">
          <div className="mx-auto w-full max-w-2xl p-5 sm:p-7 md:p-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-description">
                  Couple countdown
                </p>

                <h2 className="mt-4 text-3xl font-semibold leading-none tracking-[-0.055em] text-secondary sm:text-4xl">
                  Count the days.
                </h2>

                <p className="mt-4 max-w-md text-[13px] leading-6 text-description sm:text-sm">
                  Create something worth waiting for and make the distance
                  feel a little closer.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="shrink-0 rounded-full bg-subprimary px-4 py-2 text-[12px] font-medium text-description transition hover:text-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Close
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-9">
              <div className="space-y-7">
                {/* Moment */}
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-description">
                      Moment
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Title */}
                    <div className="sm:col-span-2">
                      <FieldLabel htmlFor="countdown-title">Title</FieldLabel>

                      <input
                        id="countdown-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ketemu di Jakarta"
                        required
                        className={inputClass}
                      />
                    </div>

                    {/* Location */}
                    <div className="sm:col-span-2">
                      <FieldLabel htmlFor="countdown-location">
                        Meeting location
                      </FieldLabel>

                      <input
                        id="countdown-location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Bandung"
                        className={inputClass}
                      />

                      <p className={hintClass}>
                        Optional · Tempat kalian akan bertemu.
                      </p>
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">
                      <FieldLabel htmlFor="countdown-description">
                        Description
                      </FieldLabel>

                      <textarea
                        id="countdown-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ga sabar ketemu kamu..."
                        rows={4}
                        className={`${inputClass} min-h-[100px] resize-none leading-6`}
                      />

                      <p className={hintClass}>
                        Optional · Tambahkan catatan kecil untuk momen ini.
                      </p>
                    </div>
                  </div>
                </div>

                {/* When */}
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-description">
                      When
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Date */}
                    <div>
                      <FieldLabel htmlFor="meetupDate">Meetup date</FieldLabel>

                      <input
                        id="meetupDate"
                        type="date"
                        value={meetupDate}
                        onChange={(e) => setMeetupDate(e.target.value)}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className={`${inputClass} [color-scheme:dark]`}
                      />

                      {!meetupDate && (
                        <p className={hintClass}>
                          Pilih tanggal yang ingin kalian tunggu.
                        </p>
                      )}
                    </div>

                    {/* Time */}
                    <div>
                      <FieldLabel htmlFor="meetupTime">Time</FieldLabel>

                      <input
                        id="meetupTime"
                        type="time"
                        value={meetupTime}
                        onChange={(e) => setMeetupTime(e.target.value)}
                        required
                        className={`${inputClass} [color-scheme:dark]`}
                      />
                    </div>
                  </div>
                </div>

                {/* Distance */}
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-description">
                      Distance
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Location A */}
                    <div>
                      <FieldLabel htmlFor="locA">
                        {memberA?.display_name ?? "Your location"}
                      </FieldLabel>

                      <input
                        id="locA"
                        type="text"
                        value={locA}
                        onChange={(e) => setLocA(e.target.value)}
                        placeholder="Bandung"
                        className={inputClass}
                      />
                    </div>

                    {/* Location B */}
                    <div>
                      <FieldLabel htmlFor="locB">
                        {memberB?.display_name ?? "Partner location"}
                      </FieldLabel>

                      <input
                        id="locB"
                        type="text"
                        value={locB}
                        onChange={(e) => setLocB(e.target.value)}
                        placeholder="Jakarta"
                        className={inputClass}
                      />
                    </div>

                    {/* Distance */}
                    <div className="sm:col-span-2">
                      <FieldLabel htmlFor="distanceKm">
                        Travel distance
                      </FieldLabel>

                      <div className="relative">
                        <input
                          id="distanceKm"
                          type="number"
                          min="0"
                          step="0.1"
                          value={distanceKm}
                          onChange={(e) => setDistanceKm(e.target.value)}
                          placeholder="150"
                          className={`${inputClass} pr-12`}
                        />

                        <span className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-[11px] font-medium text-description">
                          km
                        </span>
                      </div>

                      <p className={hintClass}>
                        Optional · Jarak perjalanan antara kalian.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 px-4 py-3">
                    <p className="text-[11px] font-medium text-rose-400">
                      Gagal menyimpan countdown. Coba lagi.
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[10px] text-description">
                    This moment will be shared between you two.
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isPending}
                      className="h-11 rounded-full bg-subprimary px-6 text-[12px] font-medium text-secondary transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="h-11 rounded-full bg-subprimary px-7 text-[12px] font-medium text-secondary transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isPending ? "Creating..." : "Create countdown"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .modal-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
        }

        .modal-scroll::-webkit-scrollbar {
          width: 5px;
        }

        .modal-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 999px;
        }

        .modal-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </div>
  );
}