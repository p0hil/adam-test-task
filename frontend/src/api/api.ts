import config from '../config.ts';
import { type RequestBookingDto, SuggestionResponseDto } from './dto/booking.dto.ts';
import { plainToInstance } from 'class-transformer';
import { BookingDto, RequestBookingResponseDto } from './dto/booking.dto.ts';
import { type AddTimeSlotDto, AddTimeSlotResponseDto, PainterSlotDto } from './dto/painter.dto.ts';
import type { User } from './dto/user.ts';


// Super simple client, we can use axios or something else instead, if needed
class ApiClient {
    constructor(
        private baseUrl: string,
        private token: string,
    ) {}

    async get<T>(url: string): Promise<T> {
        const res = await fetch(this.baseUrl + url, {
            headers: { Authorization: `Bearer ${ this.token }` },
        });
        return res.json();
    }

    async post<T>(url: string, data: Record<string, any>): Promise<T> {
        const res = await fetch(this.baseUrl + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ this.token }`,
            },
            body: JSON.stringify(data),
        });
        return res.json();
    }
}

type RequestMethod = 'GET' | 'POST'; // ...

export class Api {
    private client: ApiClient;

    constructor(private token: string) {
        this.client = new ApiClient(config.api, this.token);
    }

    private async request<T>(method: RequestMethod, url: string, data?: Record<string, any>): Promise<T> {
        try {
            switch (method) {
                case 'GET':
                    return this.client.get<T>(url);
                case 'POST':
                    return this.client.post<T>(url, data!);
            }
        } catch (e) {
            // Extract & analyze error, redirect to auth if needed and so on...
            // But I have no time to implement, so throw it up
            throw e;
        }
    }

    async logIn(email: string, password: string) {
        const response = await this.request<User>('POST', '/auth/login', { email, password });

        if (!response.token) {
            throw new Error('Invalid credentials');
        }
        return response;
    }

    async requestBooking(dto: RequestBookingDto): Promise<RequestBookingResponseDto | SuggestionResponseDto> {
        const response = await this.request('POST', '/request-booking', dto);

        // Bad practice, but it is the task expectations
        if ((response as SuggestionResponseDto).error) {
            return plainToInstance(SuggestionResponseDto, response);
        }
        else {
            return plainToInstance(RequestBookingResponseDto, response);
        }

    }

    async getUpcomingBookings() {
        const response = await this.request<BookingDto[]>('GET', '/bookings');
        return response.map(booking => plainToInstance(BookingDto, booking));
    }

    async addPainterTimeSlot(dto: AddTimeSlotDto) {
        const response = await this.request<AddTimeSlotResponseDto>('POST', '/availability', dto);
        return plainToInstance(AddTimeSlotResponseDto, response);
    }

    async getPainterSlots() {
        const response = await this.request<PainterSlotDto[]>('GET', '/availability/me');
        return response.map(booking => plainToInstance(PainterSlotDto, booking));
    }
}
