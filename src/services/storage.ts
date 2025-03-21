import AsyncStorage from "@react-native-async-storage/async-storage";
import { Flashcard, Group, Progress, AppSettings } from "../types/models";

const STORAGE_KEYS = {
  CARDS: "@oboeru-card/flashcards",
  GROUPS: "@oboeru-card/groups",
  PROGRESS: "@oboeru-card/progress",
  SETTINGS: "@oboeru-card/settings",
} as const;

class StorageService {
  static async saveFlashcards(cards: Flashcard[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
    } catch (error) {
      console.error("Error saving flashcards:", error);
      throw error;
    }
  }

  static async loadFlashcards(): Promise<Flashcard[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CARDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading flashcards:", error);
      return [];
    }
  }

  static async saveGroups(groups: Group[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
    } catch (error) {
      console.error("Error saving groups:", error);
      throw error;
    }
  }

  static async loadGroups(): Promise<Group[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.GROUPS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading groups:", error);
      return [];
    }
  }

  static async saveProgress(progress: Progress): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.PROGRESS,
        JSON.stringify(progress)
      );
    } catch (error) {
      console.error("Error saving progress:", error);
      throw error;
    }
  }

  static async loadProgress(): Promise<Progress | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error loading progress:", error);
      return null;
    }
  }

  static async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error("Error saving settings:", error);
      throw error;
    }
  }

  static async loadSettings(): Promise<AppSettings | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error loading settings:", error);
      return null;
    }
  }

  static async clearAll(): Promise<void> {
    try {
      const keys = [
        STORAGE_KEYS.CARDS,
        STORAGE_KEYS.GROUPS,
        STORAGE_KEYS.PROGRESS,
        STORAGE_KEYS.SETTINGS,
      ];
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error("Error clearing storage:", error);
      throw error;
    }
  }
}

export default StorageService;
