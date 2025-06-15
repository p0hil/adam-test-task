import { Module } from '@nestjs/common';
import { PaintersService } from './painters.service';
import { PaintersController } from './painters.controller';
import { injectModels } from '../db/models';

@Module({
  imports: [
      injectModels(),
  ],
  controllers: [PaintersController],
  providers: [PaintersService],
})
export class PaintersModule {}
