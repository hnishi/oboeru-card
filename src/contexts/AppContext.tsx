import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  AppSettings,
  Theme,
  Flashcard,
  Group,
  Progress,
} from "../types/models";
import StorageService from "../services/storage";
import {
  sampleFlashcards,
  sampleGroups,
  sampleProgress,
} from "../constants/sampleData";

interface GlobalState {
  theme: Theme;
  settings: AppSettings;
  flashcards: Flashcard[];
  groups: Group[];
  progress: Progress | null;
  isLoading: boolean;
}

type AppAction =
  | { type: "SET_THEME"; payload: Theme }
  | { type: "UPDATE_SETTINGS"; payload: Partial<AppSettings> }
  | { type: "SET_FLASHCARDS"; payload: Flashcard[] }
  | { type: "SET_GROUPS"; payload: Group[] }
  | { type: "SET_PROGRESS"; payload: Progress }
  | {
      type: "UPDATE_CARD_PROGRESS";
      payload: { cardId: string; isCorrect: boolean };
    }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: GlobalState = {
  theme: "system",
  settings: {
    theme: "system",
    cardAnimation: true,
    autoProgress: false,
  },
  flashcards: [],
  groups: [],
  progress: null,
  isLoading: true,
};

const AppContext = createContext<{
  state: GlobalState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

function appReducer(state: GlobalState, action: AppAction): GlobalState {
  switch (action.type) {
    case "SET_THEME":
      return {
        ...state,
        theme: action.payload,
        settings: {
          ...state.settings,
          theme: action.payload,
        },
      };

    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case "SET_FLASHCARDS":
      return {
        ...state,
        flashcards: action.payload,
      };

    case "SET_GROUPS":
      return {
        ...state,
        groups: action.payload,
      };

    case "SET_PROGRESS":
      return {
        ...state,
        progress: action.payload,
      };

    case "UPDATE_CARD_PROGRESS":
      if (!state.progress) return state;

      const now = new Date().toISOString();
      const existingProgress = state.progress.cardProgress.find(
        (p) => p.cardId === action.payload.cardId
      );

      const updatedProgress: Progress = {
        ...state.progress,
        cardProgress: existingProgress
          ? state.progress.cardProgress.map((p) =>
              p.cardId === action.payload.cardId
                ? {
                    ...p,
                    status: action.payload.isCorrect ? "correct" : "incorrect",
                    reviewCount: p.reviewCount + 1,
                    lastReviewed: now,
                    updatedAt: now,
                  }
                : p
            )
          : [
              ...state.progress.cardProgress,
              {
                cardId: action.payload.cardId,
                status: action.payload.isCorrect ? "correct" : "incorrect",
                reviewCount: 1,
                lastReviewed: now,
                createdAt: now,
                updatedAt: now,
              },
            ],
        updatedAt: now,
      };

      // 非同期でストレージに保存
      StorageService.saveProgress(updatedProgress).catch(console.error);

      return {
        ...state,
        progress: updatedProgress,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    async function loadInitialData() {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        // 設定を読み込む
        const savedSettings = await StorageService.loadSettings();
        if (savedSettings) {
          dispatch({ type: "UPDATE_SETTINGS", payload: savedSettings });
          dispatch({ type: "SET_THEME", payload: savedSettings.theme });
        }

        // フラッシュカードを読み込む
        let cards = await StorageService.loadFlashcards();
        if (cards.length === 0) {
          cards = sampleFlashcards;
          await StorageService.saveFlashcards(cards);
        }
        dispatch({ type: "SET_FLASHCARDS", payload: cards });

        // グループを読み込む
        let groups = await StorageService.loadGroups();
        if (groups.length === 0) {
          groups = sampleGroups;
          await StorageService.saveGroups(groups);
        }
        dispatch({ type: "SET_GROUPS", payload: groups });

        // 進捗を読み込む
        let progress = await StorageService.loadProgress();
        if (!progress) {
          progress = sampleProgress;
          await StorageService.saveProgress(progress);
        }
        dispatch({ type: "SET_PROGRESS", payload: progress });
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }

    loadInitialData();
  }, []);

  // 設定が変更されたら保存
  useEffect(() => {
    StorageService.saveSettings(state.settings).catch(console.error);
  }, [state.settings]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export default AppContext;
