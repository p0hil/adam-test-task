import { IsDate, IsDateString, IsOptional } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { BookingStatus } from '../../common/types';

export class RequestBookingDto {
    @IsOptional()
    customerId: string;

    @Type(() => Date)
    @IsDate()
    startTime: Date;

    @Type(() => Date)
    @IsDate()
    endTime: Date;
}

export class PainterDto {
    @Expose()
    @Transform(({ obj }) => obj._id?.toString(), { toClassOnly: true })
    id: string;

    @Expose()
    name: string;
}

export class SuggestionDto {
    @Expose()
    @Transform(({ obj }) => obj._id?.toString(), { toClassOnly: true })
    bookingId: string;

    @Expose()
    @Type(() => PainterDto)
    painter: PainterDto;

    @Expose()
    startTime: Date;

    @Expose()
    endTime: Date;

    @Expose()
    status: BookingStatus;
}

export class BookingDto {
    @Expose()
    @Transform(({ obj }) => obj._id?.toString(), { toClassOnly: true })
    bookingId: string;

    @Expose()
    @Type(() => PainterDto)
    painter: PainterDto;

    @Expose()
    startTime: Date;

    @Expose()
    endTime: Date;

    @Expose()
    status: BookingStatus;
}

export class RequestBookingResponseDto extends BookingDto {

}
