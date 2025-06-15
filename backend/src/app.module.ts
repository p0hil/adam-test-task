import { Module } from '@nestjs/common';
import { PaintersModule } from './painters/painters.module';
import { BookingsModule } from './bookings/bookings.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigType } from '@nestjs/config';
import appConfig from './config/app.config';
import { injectModels } from './db/models';
import { SeederModule } from './seeder/seeder.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRootAsync({
            imports: [ConfigModule.forFeature(appConfig)],
            useFactory: (config: ConfigType<typeof appConfig>) => {
                console.log('MongoURI', config.mongoUri);
                return {
                    uri: config.mongoUri,
                }
            },
            inject: [appConfig.KEY],
        }),
        AuthModule,
        PaintersModule,
        BookingsModule,
        SeederModule,
    ],
})
export class AppModule {}
