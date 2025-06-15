import React, { type PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore.ts';
import type { UserRole } from '../types/types.ts';

interface Props extends PropsWithChildren {
    role: UserRole,
}

const ProtectedRoute: React.FC<Props> = (props: Props) => {

    const user = useUserStore(state => state.user);

    if (user?.role !== props.role) {
        // Just redirect & process that case in the auth page
        return <Navigate to="/?forbidden" />
    }

    return (
        <>{props.children}</>
    );
};

export default ProtectedRoute;
