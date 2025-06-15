import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';
import { COLLECTION_BOOKINGS, COLLECTION_PAINTER_SLOTS, COLLECTION_PAINTERS } from '../schema';
import { User } from './user.model';
import { Painter } from './painter.model';
import { Booking } from './booking.model';


@Schema({ collection: COLLECTION_PAINTER_SLOTS })
export class PainterSlot {

    _id?: ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, ref: Painter.name })
    painter: ObjectId | Painter;

    @Prop()
    startTime: Date;

    @Prop()
    endTime: Date;

    @Prop()
    reserved: boolean;

    @Prop({ type: SchemaTypes.ObjectId, ref: Booking.name })
    booking?: ObjectId | Booking;
}

export type PainterSlotDocument = HydratedDocument<PainterSlot>;
export const PainterSlotSchema = SchemaFactory.createForClass(PainterSlot);

PainterSlotSchema.index({ startTime: -1, endTime: 1 })
PainterSlotSchema.index({ painter: 1, startTime: 1 })
