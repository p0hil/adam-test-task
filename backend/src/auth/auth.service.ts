import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, UserPayload } from './interface/jwt-payload.interface';
import AppConfig from '../config/app.config';
import { User } from '../db/models/user.model';
import { compare } from 'bcrypt';
import { Painter, PainterDocument } from '../db/models/painter.model';
import { Customer, CustomerDocument } from '../db/models/customer.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRole } from './interface/roles';

@Injectable()
export class AuthService {

    constructor(
        @Inject(AppConfig.KEY) private readonly appConfig: ConfigType<typeof AppConfig>,
        private jwtService: JwtService,

        @InjectModel(Painter.name)
        private readonly painters: Model<PainterDocument>,

        @InjectModel(Customer.name)
        private readonly customers: Model<CustomerDocument>,
    ) {
    }


    public getUserPayload(user: User, role: UserRole): UserPayload {
        return {
            id: user._id.toString(),
            role,
        };
    }

    async validateUser(email: string, passwd: string): Promise<UserPayload> {
        let user: User | null;
        let role: UserRole;

        user = await this.customers.findOne({ email: email.toLowerCase() });
        if (!user) {
            //
            user = await this.painters.findOne({ email: email.toLowerCase() });
            role = UserRole.Painter;
        }
        else {
            role = UserRole.Customer;
        }

        if (!user) {
            throw new UnauthorizedException();
        }

        const isValid = await compare(passwd, user.passwd);
        if (!isValid) {
            throw new UnauthorizedException();
        }

        return this.getUserPayload(user, role);
    }

    async generateToken(user: UserPayload): Promise<string> {
        const payload: JwtPayload = {
            sub: user.id,
            role: user.role,
        };

        const token = await this.jwtService.signAsync(payload, {
            expiresIn: this.appConfig.accessTokenExpire,
            secret: this.appConfig.jwtSecret,
            algorithm: 'HS256',
        });

        return token;
    }

    async logIn(user: UserPayload) {
        const token = await this.generateToken(user);

        return {
            ...user,
            token
        };
    }

}
