// qna/category-info.ts

import type { QnaCategory } from "./types";

export interface CategoryInfo {
  id: QnaCategory;
  name: string;
  description: string;
  emoji: string;
  colorClass: string;
  cardColor: string;
}

export const QNA_CATEGORIES: CategoryInfo[] = [
  {
    id: "love_and_us",
    name: "Love & Us",
    description: "Tentang hubungan kalian berdua",
    emoji: "💕",
    colorClass: "from-pink-500 to-rose-400",
    cardColor: "#e8b9c8",
  },
  {
    id: "deep_talk",
    name: "Deep Talk",
    description: "Obrolan yang lebih dalam & reflektif",
    emoji: "🌊",
    colorClass: "from-blue-500 to-indigo-400",
    cardColor: "#b9d2e5",
  },
  {
    id: "future",
    name: "Future",
    description: "Rencana & harapan ke depan",
    emoji: "🔮",
    colorClass: "from-purple-500 to-violet-400",
    cardColor: "#cbbde3",
  },
  {
    id: "memories",
    name: "Memories",
    description: "Kenangan & momen berharga",
    emoji: "📸",
    colorClass: "from-amber-500 to-yellow-400",
    cardColor: "#e5d3a7",
  },
  {
    id: "fun_and_random",
    name: "Fun & Random",
    description: "Ringan, random, dan seru",
    emoji: "🎲",
    colorClass: "from-emerald-500 to-teal-400",
    cardColor: "#b8d6ca",
  },
];

export function getCategoryInfo(id: QnaCategory): CategoryInfo {
  return QNA_CATEGORIES.find((c) => c.id === id) ?? QNA_CATEGORIES[0];
}