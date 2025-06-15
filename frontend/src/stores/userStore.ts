import { create } from 'zustand';
import secureLocalStorage from 'react-secure-storage';

import type { User } from '../api/dto/user.ts';

interface UserStore {
    user: User | null;
    accessToken: string | null;
    setUser: (token: string, user: User) => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    accessToken: secureLocalStorage.getItem('access_token') as string | null,

    setUser: (token, user) => {
        secureLocalStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ accessToken: token, user });
    },

    logout: () => {
        secureLocalStorage.removeItem('access_token');
        localStorage.removeItem('user');
        set({ accessToken: null, user: null });
    },
}));
