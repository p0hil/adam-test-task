import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import { JwtPayload, UserPayload } from '../interface/jwt-payload.interface';
import { Request } from 'express';
import appConfig from '../../config/app.config';


declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface User extends UserPayload {
        }
        interface Request {
            user?: User,
        }
    }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @Inject(appConfig.KEY) config: ConfigType<typeof appConfig>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.jwtSecret!,
        });
    }

    authenticate(req: Request, options?: any) {
        super.authenticate(req, options);
    }

    validate(payload: JwtPayload): UserPayload | false {
        return JwtStrategy.jwtToUserPayload(payload);
    }

    static jwtToUserPayload(jwt: JwtPayload): UserPayload {
        return {
            id: jwt.sub,
            role: jwt.role,
        };
    }
}
