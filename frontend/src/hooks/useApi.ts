import { useMemo } from 'react';
import { Api } from '../api/api.ts';
import { useUserStore } from '../stores/userStore.ts';

export const useApi = () => {
    const token = useUserStore((state) => state.accessToken);
    return useMemo(() => (new Api(token!)), [token]);
};
