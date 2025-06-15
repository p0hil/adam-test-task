import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../interface/roles';

export const HAS_ROLE = 'has-roles';

export const HasRole = (role: UserRole) => {
    return applyDecorators(
        SetMetadata(HAS_ROLE, role),
        UseGuards(JwtAuthGuard),
        UseGuards(RolesGuard),
    );
}
