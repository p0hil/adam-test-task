import { ObjectId } from 'mongoose';

export enum BookingStatus {
    Pending = 'pending',
    Confirmed = 'confirmed',
    Rejected = 'rejected',
}

export type MongoDocumentId = {
    _id: ObjectId;
}
