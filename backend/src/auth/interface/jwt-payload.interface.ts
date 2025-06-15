import { UserRole } from './roles';

export interface JwtPayload {
    readonly sub: string;
    readonly role: UserRole;
    readonly iat?: number;
}

export interface UserPayload {
    readonly id: string;
    readonly role: UserRole;
}
