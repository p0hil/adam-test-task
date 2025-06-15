import type { UserRole } from '../../types/types.ts';

export class User {
    id: string;
    role: UserRole;
    token?: string;
}
