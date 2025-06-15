import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Booking, BookingDocument } from '../db/models/booking.model';
import { Connection, Model } from 'mongoose';
import { PainterSlot, PainterSlotDocument } from '../db/models/painter-slot.model';
import { AddTimeSlotDto } from './dto/painter.dto';

@Injectable()
export class PaintersService {
    constructor(
        @InjectModel(Booking.name)
        private readonly bookings: Model<BookingDocument>,
        @InjectModel(PainterSlot.name)
        private readonly slots: Model<PainterSlotDocument>,
    ) {}

    getSlots(painterId: string): Promise<PainterSlot[]> {
        return this.slots.find({ painter: painterId }).sort({ startTime: 1 });
    }

    addSlot(dto: AddTimeSlotDto) {
        return this.slots.create({
            ...dto,
            reserved: false,
        });
    }
}
