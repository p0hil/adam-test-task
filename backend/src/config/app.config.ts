import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('appConfig', () => ({
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    accessTokenExpire: process.env.ACESS_TOKEN_EXPIRE || '1d',
}));
