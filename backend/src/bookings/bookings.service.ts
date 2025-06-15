import { Injectable } from '@nestjs/common';
import { Connection, Model, Types } from 'mongoose';
import { Booking, BookingDocument } from '../db/models/booking.model';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { RequestBookingDto } from './dto/request-booking.dto';
import { Painter } from '../db/models/painter.model';
import { PainterSlot, PainterSlotDocument } from '../db/models/painter-slot.model';
import { COLLECTION_PAINTERS } from '../db/schema';
import { BookingStatus } from '../common/types';

@Injectable()
export class BookingsService {

    minSlotTime = 1800 * 1000;

    constructor(
        @InjectModel(Booking.name)
        private readonly bookings: Model<BookingDocument>,
        @InjectModel(PainterSlot.name)
        private readonly slots: Model<PainterSlotDocument>,
        @InjectConnection()
        private readonly connection: Connection,
    ) {}

    async request(dto: RequestBookingDto): Promise<Booking | null> {
        // Find the best slot
        const [slot] = await this.slots.aggregate<PainterSlot>()
            .match({
                startTime: { $lte: dto.startTime },
                endTime: { $gte: dto.endTime },
                reserved: false,
            })
            .lookup({
                from: COLLECTION_PAINTERS,
                localField: 'painter',
                foreignField: '_id',
                as: 'painter',
            })
            .unwind({
                path: '$painter',
            })
            .sort({
                'painter.rank': -1,
            })
            .limit(1)
        ;

        if (!slot) {
            return null;
        }

        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const pool: PromiseLike<any>[] = [];

            // Split if needed
            if (slot.startTime < dto.startTime && dto.startTime.getTime() - slot.startTime.getTime() > this.minSlotTime) {
                pool.push(
                    this.slots.insertOne({
                        startTime: slot.startTime,
                        endTime: dto.startTime,
                        painter: (slot.painter as Painter)._id,
                        reserved: false,
                    }, { session }),
                );
            }

            if (slot.endTime > dto.endTime && slot.endTime.getTime() - dto.endTime.getTime() > this.minSlotTime) {
                pool.push(
                    this.slots.insertOne({
                        startTime: dto.endTime,
                        endTime: slot.endTime,
                        painter: (slot.painter as Painter)._id,
                        reserved: false,
                    }, { session }),
                );
            }

            await Promise.all(pool);

            // Create booking
            const [booking] = await this.bookings.create([{
                startTime: dto.startTime,
                endTime: dto.endTime,
                painter: (slot.painter as Painter)._id,
                customer: dto.customerId,
                status: BookingStatus.Pending,
            }], { session });

            // Change the original slot
            await this.slots.updateOne({ _id: slot._id }, {
                startTime: dto.startTime,
                endTime: dto.endTime,
                booking: booking._id,
                reserved: true,
            }, { session });

            await session.commitTransaction();
            await booking.populate('painter');

            return booking;

        } catch (e) {
            console.error(e);
            await session.abortTransaction();
            throw new Error('Something went wrong');
        } finally {
            await session.endSession();
        }
    }

    async suggestSlots(dto: RequestBookingDto) {
        const durationMs = dto.endTime.getTime() - dto.startTime.getTime();

        const timeWindowStart = new Date(Math.max(dto.startTime.getTime() - 1000 * 60 * 60 * 24), new Date().getTime());
        const timeWindowEnd = new Date(dto.endTime.getTime() + 1000 * 60 * 60 * 24);

        // Find the best slot
        return this.slots.aggregate<PainterSlot>()
            .match({
                startTime: { $gte: timeWindowStart },
                endTime: { $lte: timeWindowEnd },
                $expr: {
                    $gte: [
                        { $subtract: ['$endTime', '$startTime'] },
                        durationMs,
                    ],
                },
            })
            .lookup({
                from: COLLECTION_PAINTERS,
                localField: 'painter',
                foreignField: '_id',
                as: 'painter',
            })
            .unwind({
                path: '$painter',
            })
            .sort({
                'startTime': 1,
            })
            .limit(10);
    }

    upcomingBookings(customerId: string, limit = 10) {
        return this.bookings.aggregate<Booking>()
            .match({
                customer: new Types.ObjectId(customerId),
                startTime: { $gte: new Date() },
            })
            .lookup({
                from: COLLECTION_PAINTERS,
                localField: 'painter',
                foreignField: '_id',
                as: 'painter',
            })
            .unwind({
                path: '$painter',
            })
            .sort({ startTime: 1 })
            .limit(limit);
    }

}
