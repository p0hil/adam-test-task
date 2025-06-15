// src/seeder/seeder.service.ts
import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Painter } from '../db/models/painter.model';
import { PainterSlot } from '../db/models/painter-slot.model';
import { Customer } from '../db/models/customer.model';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
    private readonly logger = new Logger(SeederService.name);

    constructor(
        @InjectModel(Painter.name) private painters: Model<Painter>,
        @InjectModel(Customer.name) private customers: Model<Customer>,
        @InjectModel(PainterSlot.name) private slots: Model<PainterSlot>,
    ) {}

    async onApplicationBootstrap() {
        const paintersCount = await this.painters.countDocuments();
        if (paintersCount > 0) {
            this.logger.log('Seed data already exists. Skipping seeding...');
            return;
        }

        const passwd = await bcrypt.hash('password', 10);
        const painters = await this.painters.insertMany([
            { name: 'Alice', email: 'alice@example.com', passwd, rank: 1, },
            { name: 'Bob', email: 'bob@example.com', passwd, rank: 2, },
            { name: 'Charlie', email: 'charlie@example.com', passwd, rank: 3, },
        ]);

        const customers = await this.customers.insertMany([
            { name: 'John', email: 'john@example.com', passwd },
        ]);

        const now = new Date();
        const oneDayMs = 24 * 60 * 60 * 1000;
        const slots: Partial<PainterSlot>[] = [];

        for (const painter of painters) {
            for (let i = 0; i < 5; i++) {
                const startTime = new Date(now.getTime() + i * oneDayMs);
                startTime.setUTCHours(9 + i, 0, 0, 0);
                const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
                slots.push({
                    painter: painter._id,
                    startTime,
                    endTime,
                    reserved: false,
                });
            }
        }

        await this.slots.insertMany(slots);

        this.logger.log('Seed data inserted.');
    }
}
