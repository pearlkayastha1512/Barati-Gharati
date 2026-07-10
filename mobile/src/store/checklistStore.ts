import { create } from "zustand";

export type Priority = "Low" | "Medium" | "High";

export type ChecklistItem = {
  id: string;
  task: string;
  description?: string;
  priority: Priority;
  dueDate?: string; // ISO date string, e.g. "2026-12-25"
  isDone: boolean;
};

type NewChecklistItemInput = {
  task: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
};

interface ChecklistState {
  items: ChecklistItem[];
  addItem: (input: NewChecklistItemInput) => void;
  toggleItem: (id: string) => void;
  removeItem: (id: string) => void;
}

// TODO: once backend is connected, replace local array with API-backed state:
// - on mount (e.g. in App.tsx or a loader), fetch via getChecklist() and setItems
// - addItem should call createChecklistItem(input), then append the returned item
// - toggleItem should call toggleChecklistItem(id, !isDone) — optimistic update with rollback on failure
// - removeItem should call deleteChecklistItem(id) — optimistic update with rollback on failure
export const useChecklistStore = create<ChecklistState>((set) => ({
  items: [], // starts empty — no seed/sample tasks until the user adds their own or the API returns real ones

  addItem: (input) => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      task: input.task,
      description: input.description,
      priority: input.priority ?? "Medium",
      dueDate: input.dueDate,
      isDone: false,
    };
    set((state) => ({ items: [newItem, ...state.items] }));
  },

  toggleItem: (id) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, isDone: !item.isDone } : item
      ),
    }));
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },
}));