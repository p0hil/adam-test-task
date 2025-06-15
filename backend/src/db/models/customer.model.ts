import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import { COLLECTION_CUSTOMERS } from '../schema';
import { User } from './user.model';


@Schema({ collection: COLLECTION_CUSTOMERS })
export class Customer extends User {

}

export type CustomerDocument = HydratedDocument<Customer>;
export const CustomerSchema = SchemaFactory.createForClass(Customer);
