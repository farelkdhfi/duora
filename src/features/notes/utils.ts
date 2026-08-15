const noteColorPalette = [
  {
    bg: 'bg-pink-50',
    border: 'border-pink-100',
    accent: 'bg-pink-400',
    text: 'text-pink-600',
  },
  {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    accent: 'bg-blue-400',
    text: 'text-blue-600',
  },
  {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    accent: 'bg-amber-400',
    text: 'text-amber-600',
  },
  {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    accent: 'bg-emerald-400',
    text: 'text-emerald-600',
  },
  {
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    accent: 'bg-purple-400',
    text: 'text-purple-600',
  },
  {
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    accent: 'bg-orange-400',
    text: 'text-orange-600',
  },
] as const

const neutralNoteColor = {
  bg: 'bg-neutral-50',
  border: 'border-neutral-100',
  accent: 'bg-neutral-400',
  text: 'text-neutral-500',
} as const

export function getNoteColor(
  category: string | null,
) {
  if (!category) {
    return neutralNoteColor
  }

  let hash = 0

  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash)
  }

  const index = Math.abs(hash) % noteColorPalette.length

  return noteColorPalette[index]
}