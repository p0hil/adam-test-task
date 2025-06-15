import { Type } from 'class-transformer';

export class PainterDto {
    id: string;
    name: string;
}

export class AddTimeSlotDto {
    startTime: Date;
    endTime: Date;
}


export class PainterSlotDto {
    id: string;
    painterId: string;

    @Type(() => Date)
    startTime: Date;

    @Type(() => Date)

    endTime: Date;
    reserved: boolean;
}

export class AddTimeSlotResponseDto extends PainterSlotDto {

}
