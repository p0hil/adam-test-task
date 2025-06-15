import { Request } from 'express';
import { UserPayload } from './jwt-payload.interface';

export interface AuthenticatedRequest extends Request {
    readonly user: UserPayload;
}

