export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  name: string;
  totalCards: number;
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  userId: string;
  cardProgress: {
    cardId: string;
    status: "correct" | "incorrect";
    lastReviewed: string;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  theme: "light" | "dark" | "system";
  cardAnimation: boolean;
  autoProgress: boolean;
}

export type Theme = "light" | "dark" | "system";
