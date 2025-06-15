import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, SchemaTypes } from 'mongoose';
import { COLLECTION_BOOKINGS } from '../schema';
import { Customer } from './customer.model';
import { Painter } from './painter.model';
import { BookingStatus } from '../../common/types';

@Schema({ collection: COLLECTION_BOOKINGS })
export class Booking {

    _id: ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, ref: Customer.name })
    customer: ObjectId | Customer;

    @Prop({ type: SchemaTypes.ObjectId, ref: Painter.name })
    painter: ObjectId | Painter;

    @Prop()
    startTime: Date;

    @Prop()
    endTime: Date;

    @Prop()
    status: BookingStatus;
}

export type BookingDocument = HydratedDocument<Booking>;
export const BookingSchema = SchemaFactory.createForClass(Booking);

BookingSchema.index({ customer: 1, startTime: 1 });
