import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import { COLLECTION_PAINTERS } from '../schema';
import { User } from './user.model';


@Schema({ collection: COLLECTION_PAINTERS })
export class Painter extends User {
    @Prop()
    rank: number;
}

export type PainterDocument = HydratedDocument<Painter>;
export const PainterSchema = SchemaFactory.createForClass(Painter);
