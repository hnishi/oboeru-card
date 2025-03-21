import React, { createContext, useContext, useReducer, Dispatch } from "react";
import { AppSettings, Theme } from "../types/models";

interface GlobalState {
  theme: Theme;
  settings: AppSettings;
  studyProgress: {
    totalCards: number;
    completedCards: number;
    correctAnswers: number;
  };
}

type AppAction =
  | { type: "SET_THEME"; payload: Theme }
  | { type: "UPDATE_SETTINGS"; payload: Partial<AppSettings> }
  | {
      type: "UPDATE_PROGRESS";
      payload: { completed: number; correct: number };
    };

const initialState: GlobalState = {
  theme: "system",
  settings: {
    theme: "system",
    cardAnimation: true,
    autoProgress: false,
  },
  studyProgress: {
    totalCards: 0,
    completedCards: 0,
    correctAnswers: 0,
  },
};

const AppContext = createContext<{
  state: GlobalState;
  dispatch: Dispatch<AppAction>;
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
    case "UPDATE_PROGRESS":
      return {
        ...state,
        studyProgress: {
          ...state.studyProgress,
          completedCards: action.payload.completed,
          correctAnswers: action.payload.correct,
        },
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

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
