import { create } from 'zustand';

interface AppStore {
    header: string;
    setHeader: (header: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
    header: 'Schedule demo',
    setHeader: (header) => set({ header }),
}));
