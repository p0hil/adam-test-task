import { IsDateString, IsOptional } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';

export class AddTimeSlotDto {
    @IsOptional()
    painter: string;

    @IsDateString()
    startTime: Date;

    @IsDateString()
    endTime: Date;
}

export class PainterSlotDto {
    @Expose()
    @Transform(({ obj }) => obj._id?.toString(), { toClassOnly: true })
    id: string;

    @Expose()
    painterId: string;

    @Expose()
    startTime: Date;

    @Expose()
    endTime: Date;

    @Expose()
    reserved: boolean;
}

export class AddTimeSlotResponseDto extends PainterSlotDto {

}
