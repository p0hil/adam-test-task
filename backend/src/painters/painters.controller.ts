import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaintersService } from './painters.service';
import { UserRole } from '../auth/interface/roles';
import { HasRole } from '../auth/guard/has-role.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserPayload } from '../auth/interface/jwt-payload.interface';
import { AddTimeSlotDto, AddTimeSlotResponseDto, PainterSlotDto } from './dto/painter.dto';
import { plainToInstance } from 'class-transformer';

@Controller()
export class PaintersController {
    constructor(private readonly paintersService: PaintersService) {}

    @Post('availability')
    @HasRole(UserRole.Painter)
    async addSlot(@Body() data: AddTimeSlotDto, @CurrentUser() user: UserPayload) {
        data.painter = user.id;
        const slot = await this.paintersService.addSlot(data);
        return plainToInstance(AddTimeSlotResponseDto, slot, { excludeExtraneousValues: true });
    }

    @Get('availability/me')
    @HasRole(UserRole.Painter)
    async mySlots(@CurrentUser() user: UserPayload) {
        const slots = await this.paintersService.getSlots(user.id);
        return slots.map(i => plainToInstance(PainterSlotDto, i, { excludeExtraneousValues: true }));
    }

}
