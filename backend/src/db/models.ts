import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './models/customer.model';
import { Painter, PainterSchema } from './models/painter.model';
import { Booking, BookingSchema } from './models/booking.model';
import { PainterSlot, PainterSlotSchema } from './models/painter-slot.model';

const models: ModelDefinition[] = [
    { name: Customer.name, schema: CustomerSchema },
    { name: Painter.name, schema: PainterSchema },
    { name: Booking.name, schema: BookingSchema },
    { name: PainterSlot.name, schema: PainterSlotSchema },
];

export function injectModels() {
    return MongooseModule.forFeature(models);
}
