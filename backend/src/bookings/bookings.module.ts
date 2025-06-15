import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { injectModels } from '../db/models';

@Module({
  imports: [injectModels()],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
