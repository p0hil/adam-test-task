import { Prop } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export class User {

    _id: ObjectId;

    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    passwd: string;
}
