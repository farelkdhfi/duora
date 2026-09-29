"use client";

import {
  CalendarDays,
  Clock3,
  FileText,
  MapPin,
  Route,
  Tag,
  X,
} from "lucide-react";
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
  "mt-2 w-full rounded-[1rem] border border-black/[0.06] bg-[#f8f8f7] px-4 py-3.5 text-[13px] text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black/[0.12] focus:bg-white focus:ring-4 focus:ring-black/[0.03] disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400";

function FieldLabel({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-7 items-center justify-center rounded-full bg-white shadow-sm">
        {icon}
      </div>

      <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">
        {children}
      </label>
    </div>
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
      className="fixed inset-0 z-53 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) {
          handleClose();
        }
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[2rem] border border-black/[0.06] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.16)]">
        {/* =====================================================
            AMBIENT
        ===================================================== */}

        <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-pink-100/50 blur-[100px]" />

        <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-blue-100/40 blur-[100px]" />

        {/* =====================================================
            SCROLL AREA
        ===================================================== */}

        <div className="modal-scroll relative max-h-[90vh] overflow-y-auto">
          <div className="p-5 sm:p-7 md:p-8">
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="size-1.5 rounded-full bg-pink-500" />

                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                    Couple countdown
                  </p>
                </div>

                <h2 className="mt-5 text-3xl font-semibold leading-none tracking-[-0.055em] text-neutral-900 sm:text-4xl">
                  Count the days.
                </h2>

                <p className="mt-4 max-w-md text-[13px] leading-6 text-neutral-400 sm:text-sm">
                  Create something worth waiting for and make the distance
                  feel a little closer.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f8f8f7] text-neutral-400 transition hover:bg-neutral-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={15} />
              </button>
            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form onSubmit={handleSubmit} className="mt-9">
              <div className="space-y-7">
                {/* =============================================
                    MOMENT
                ============================================= */}

                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-300">
                      Moment
                    </span>

                    <div className="h-px flex-1 bg-black/[0.05]" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Title */}

                    <div>
                      <FieldLabel
                        icon={
                          <Tag
                            size={13}
                            className="text-neutral-500"
                          />
                        }
                      >
                        Title
                      </FieldLabel>

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
                      <FieldLabel
                        icon={
                          <MapPin
                            size={13}
                            className="text-neutral-500"
                          />
                        }
                      >
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

                      <p className="mt-2 text-[10px] text-neutral-400">
                        Optional · Tempat kalian akan bertemu.
                      </p>
                    </div>

                    {/* Description */}

                    <div className="sm:col-span-2">
                      <FieldLabel
                        icon={
                          <FileText
                            size={13}
                            className="text-neutral-500"
                          />
                        }
                      >
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

                      <p className="mt-2 text-[10px] text-neutral-400">
                        Optional · Tambahkan catatan kecil untuk momen ini.
                      </p>
                    </div>
                  </div>
                </div>

                {/* =============================================
                    DATE & TIME
                ============================================= */}

                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-300">
                      When
                    </span>

                    <div className="h-px flex-1 bg-black/[0.05]" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Date */}

                    <div>
                      <FieldLabel
                        icon={
                          <CalendarDays
                            size={13}
                            className="text-blue-400"
                          />
                        }
                      >
                        Meetup date
                      </FieldLabel>

                      <input
                        id="meetupDate"
                        type="date"
                        value={meetupDate}
                        onChange={(e) => setMeetupDate(e.target.value)}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className={inputClass}
                      />

                      {!meetupDate && (
                        <p className="mt-2 text-[10px] text-neutral-400">
                          Pilih tanggal yang ingin kalian tunggu.
                        </p>
                      )}
                    </div>

                    {/* Time */}

                    <div>
                      <FieldLabel
                        icon={
                          <Clock3
                            size={13}
                            className="text-pink-400"
                          />
                        }
                      >
                        Time
                      </FieldLabel>

                      <input
                        id="meetupTime"
                        type="time"
                        value={meetupTime}
                        onChange={(e) => setMeetupTime(e.target.value)}
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* =============================================
                    DISTANCE
                ============================================= */}

                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-300">
                      Distance
                    </span>

                    <div className="h-px flex-1 bg-black/[0.05]" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Location A */}

                    <div>
                      <FieldLabel
                        icon={
                          <MapPin
                            size={13}
                            className="text-pink-400"
                          />
                        }
                      >
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
                      <FieldLabel
                        icon={
                          <MapPin
                            size={13}
                            className="text-blue-400"
                          />
                        }
                      >
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
                      <FieldLabel
                        icon={
                          <Route
                            size={13}
                            className="text-neutral-500"
                          />
                        }
                      >
                        Travel distance
                      </FieldLabel>

                      <div className="relative">
                        <input
                          id="distanceKm"
                          type="number"
                          min="0"
                          step="0.1"
                          value={distanceKm}
                          onChange={(e) =>
                            setDistanceKm(e.target.value)
                          }
                          placeholder="150"
                          className={`${inputClass} pr-12`}
                        />

                        <span className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-[11px] font-medium text-neutral-400">
                          km
                        </span>
                      </div>

                      <p className="mt-2 text-[10px] text-neutral-400">
                        Optional · Jarak perjalanan antara kalian.
                      </p>
                    </div>
                  </div>
                </div>

                {/* =============================================
                    ERROR
                ============================================= */}

                {error && (
                  <div className="rounded-[1.25rem] border border-rose-500/10 bg-rose-500/[0.04] px-4 py-3">
                    <p className="text-[11px] font-medium text-rose-500">
                      Gagal menyimpan countdown. Coba lagi.
                    </p>
                  </div>
                )}

                {/* =============================================
                    FOOTER
                ============================================= */}

                <div className="flex flex-col gap-3 border-t border-black/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-pink-400" />

                    <p className="text-[10px] text-neutral-400">
                      This moment will be shared between you two.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex h-11 items-center justify-center rounded-full bg-black px-7 text-[12px] font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPending ? "Creating..." : "Create countdown"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .modal-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.12) transparent;
        }

        .modal-scroll::-webkit-scrollbar {
          width: 5px;
        }

        .modal-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.12);
          border-radius: 999px;
        }

        .modal-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}