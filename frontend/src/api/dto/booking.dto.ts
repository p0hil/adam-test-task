import type { PainterDto } from './painter.dto.ts';
import type { BookingStatus } from '../../types/types.ts';

export class RequestBookingDto {
    startTime: Date;
    endTime: Date;
}

export class SuggestionDto {
    painter: PainterDto;
    startTime: Date;
    endTime: Date;
}

export class BookingDto {
    bookingId: string;
    painter: PainterDto;
    startTime: Date;
    endTime: Date;
    status: BookingStatus;
}

export class SuggestionResponseDto extends SuggestionDto {
    error: string;
    suggestions: SuggestionDto[];
}

export class RequestBookingResponseDto extends BookingDto {

}

