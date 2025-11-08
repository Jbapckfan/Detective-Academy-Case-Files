// LocalStorage-based data persistence (replaces Supabase)

export interface StoredData {
  user: any;
  companion: any;
  profiles: any;
  sessions: any[];
  puzzleAttempts: any[];
}

const STORAGE_KEY = 'detective_academy_data';

export const storage = {
  // Get all data
  getData(): StoredData {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return {
        user: null,
        companion: null,
        profiles: null,
        sessions: [],
        puzzleAttempts: []
      };
    }
    return JSON.parse(data);
  },

  // Save all data
  saveData(data: StoredData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  // Clear all data
  clearData(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Generate UUID
  generateId(): string {
    return crypto.randomUUID();
  }
};
