import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../interface/roles';
import { HAS_ROLE } from './has-role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext):  Promise<boolean> {
        const role = this.reflector.get<UserRole>(HAS_ROLE, context.getHandler());

        if (!role) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        return user && user.role === role;
    }
}
