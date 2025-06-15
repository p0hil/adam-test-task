import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { injectModels } from '../db/models';

@Module({
  imports: [injectModels()],
  providers: [SeederService]
})
export class SeederModule {}
