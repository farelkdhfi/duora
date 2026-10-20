export default function ChemistryIcon({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="chemHeart" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f472b6" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <path
        d="M32 54S8 40 8 23C8 15 14 9 22 9c5 0 8 3 10 7 2-4 5-7 10-7 8 0 14 6 14 14 0 17-24 31-24 31Z"
        fill="url(#chemHeart)"
      />
      {/* kilau */}
      <path d="M50 6l1.6 4.4L56 12l-4.4 1.6L50 18l-1.6-4.4L44 12l4.4-1.6Z" fill="#fde68a" />
      <path d="M12 40l1 2.6L15.6 44 13 45l-1 2.6L11 45l-2.6-1L11 42.6Z" fill="#fde68a" />
    </svg>
  )
}