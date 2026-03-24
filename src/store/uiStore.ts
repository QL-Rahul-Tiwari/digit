import { create } from 'zustand';

interface UIState {
  activeModal: string | null;
  storyViewerIndex: number;
  setActiveModal: (modal: string | null) => void;
  setStoryViewerIndex: (index: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeModal: null,
  storyViewerIndex: 0,

  setActiveModal: (modal) => set({ activeModal: modal }),
  setStoryViewerIndex: (index) => set({ storyViewerIndex: index }),
}));
