import { create } from "zustand";
import {
  getTimeline,
  createTimelineItem,
  updateTimelineStatus,
  updateTimelineItem,
  deleteTimelineItem,
  BackendTimelineItem,
  BackendPriority,
} from "../api/timeline.api";

export type Priority = "Low" | "Medium" | "High";

export type ChecklistItem = {
  id: string;
  task: string;
  description?: string;
  priority: Priority;
  dueDate?: string; // "dd-mm-yyyy" for display
  isDone: boolean;
};

type NewChecklistItemInput = {
  task: string;
  description?: string;
  priority?: Priority;
  dueDate?: string; // "dd-mm-yyyy" from the date picker
};

const priorityToBackend = (p: Priority): BackendPriority =>
  p.toUpperCase() as BackendPriority;

const priorityFromBackend = (p: BackendPriority): Priority =>
  (p.charAt(0) + p.slice(1).toLowerCase()) as Priority;

// Convert "dd-mm-yyyy" -> "yyyy-mm-dd" for the API
const toIsoDate = (ddmmyyyy: string): string => {
  const [dd, mm, yyyy] = ddmmyyyy.split("-");
  return `${yyyy}-${mm}-${dd}`;
};

// Convert backend ISO date -> "dd-mm-yyyy" for display
const fromIsoDate = (iso: string): string => {
  const date = new Date(iso);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const mapFromBackend = (item: BackendTimelineItem): ChecklistItem => ({
  id: item.id,
  task: item.title,
  description: item.description ?? undefined,
  priority: priorityFromBackend(item.priority),
  dueDate: fromIsoDate(item.date),
  isDone: item.status === "COMPLETED",
});

interface ChecklistState {
  items: ChecklistItem[];
  isLoading: boolean;

  fetchChecklist: () => Promise<void>;
  addItem: (input: NewChecklistItemInput) => Promise<void>;
  toggleItem: (id: string) => Promise<void>;
  updateItem: (id: string, input: NewChecklistItemInput) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
}

export const useChecklistStore = create<ChecklistState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchChecklist: async () => {
    try {
      set({ isLoading: true });
      const response = await getTimeline();
      set({ items: response.data.map(mapFromBackend), isLoading: false });
    } catch (error) {
      console.log("FETCH TIMELINE ERROR =>", error);
      set({ isLoading: false });
    }
  },

  addItem: async (input) => {
    try {
      const response = await createTimelineItem({
        title: input.task,
        date: input.dueDate ? toIsoDate(input.dueDate) : new Date().toISOString().split("T")[0],
        description: input.description,
        priority: input.priority ? priorityToBackend(input.priority) : undefined,
      });
      set((state) => ({ items: [mapFromBackend(response.data), ...state.items] }));
    } catch (error) {
      console.log("ADD TIMELINE ITEM ERROR =>", error);
    }
  },

  toggleItem: async (id) => {
    const previousItems = get().items;
    const target = previousItems.find((item) => item.id === id);
    if (!target) return;

    const newStatus = target.isDone ? "PENDING" : "COMPLETED";

    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, isDone: !item.isDone } : item
      ),
    }));

    try {
      await updateTimelineStatus(id, newStatus);
    } catch (error) {
      console.log("TOGGLE TIMELINE ITEM ERROR =>", error);
      set({ items: previousItems });
    }
  },

  updateItem: async (id, input) => {
    try {
      const response = await updateTimelineItem(id, {
        title: input.task,
        description: input.description,
        priority: input.priority ? priorityToBackend(input.priority) : undefined,
        date: input.dueDate ? toIsoDate(input.dueDate) : undefined,
      });

      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? mapFromBackend(response.data) : item
        ),
      }));
    } catch (error) {
      console.log("UPDATE TIMELINE ITEM ERROR =>", error);
    }
  },

  removeItem: async (id) => {
    const previousItems = get().items;

    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));

    try {
      await deleteTimelineItem(id);
    } catch (error) {
      console.log("REMOVE TIMELINE ITEM ERROR =>", error);
      set({ items: previousItems });
    }
  },
}));
