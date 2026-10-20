// qna/category-info.ts
// Nama dan deskripsi kategori ada di messages: qna.categories.<id>.name|description

import type { QnaCategory } from "./types";

export interface CategoryInfo {
  id: QnaCategory;
  emoji: string;
  colorClass: string;
  cardColor: string;
}

export const QNA_CATEGORIES: CategoryInfo[] = [
  {
    id: "love_and_us",
    emoji: "💕",
    colorClass: "from-pink-500 to-rose-400",
    cardColor: "#e8b9c8",
  },
  {
    id: "deep_talk",
    emoji: "🌊",
    colorClass: "from-blue-500 to-indigo-400",
    cardColor: "#b9d2e5",
  },
  {
    id: "future",
    emoji: "🔮",
    colorClass: "from-purple-500 to-violet-400",
    cardColor: "#cbbde3",
  },
  {
    id: "memories",
    emoji: "📸",
    colorClass: "from-amber-500 to-yellow-400",
    cardColor: "#e5d3a7",
  },
  {
    id: "fun_and_random",
    emoji: "🎲",
    colorClass: "from-emerald-500 to-teal-400",
    cardColor: "#b8d6ca",
  },
];

export function getCategoryInfo(id: QnaCategory): CategoryInfo {
  return QNA_CATEGORIES.find((c) => c.id === id) ?? QNA_CATEGORIES[0];
}