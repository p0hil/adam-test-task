import { Body, Controller, Get, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingDto, RequestBookingDto, RequestBookingResponseDto, SuggestionDto } from './dto/request-booking.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserPayload } from '../auth/interface/jwt-payload.interface';
import { HasRole } from '../auth/guard/has-role.decorator';
import { UserRole } from '../auth/interface/roles';
import { plainToInstance } from 'class-transformer';

@Controller()
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}

    @Post('request-booking')
    @HasRole(UserRole.Customer)
    async request(@Body() data: RequestBookingDto, @CurrentUser() user: UserPayload) {
        data.customerId = user.id;
        const booking = await this.bookingsService.request(data);


        // It's better to extract suggestions in separate endpoint, but ok, it is the task expectation
        if (!booking) {
            const suggestions = await this.bookingsService.suggestSlots(data);
            return {
                error: 'No painters are available for the requested time slot.',
                suggestions: suggestions.map(i => plainToInstance(SuggestionDto, i, { excludeExtraneousValues: true })),
            };
        }
        else {
            return plainToInstance(RequestBookingResponseDto, booking, { excludeExtraneousValues: true });
        }
    }

    @Get('bookings')
    @HasRole(UserRole.Customer)
    async upcomingBookings(@CurrentUser() user: UserPayload) {
        const result = await this.bookingsService.upcomingBookings(user.id, 10);

        return result.map(i => plainToInstance(BookingDto, i, { excludeExtraneousValues: true }));
    }

}
