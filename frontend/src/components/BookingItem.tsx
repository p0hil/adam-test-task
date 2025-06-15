import React from 'react';
import type { BookingDto } from '../api/dto/booking.dto.ts';

type BookingItemProps = {
    data: BookingDto;
};

export const BookingItem: React.FC<BookingItemProps> = ({ data }) => {
    const date = new Date(data.startTime).toLocaleTimeString([], {
        day: 'numeric',
        month: 'short',
    });

    const start = new Date(data.startTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    const end = new Date(data.endTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="border rounded p-2 mb-2 bg-light">
            <div>{date}</div>
            <div>
                <strong>{start}</strong> – <strong>{end}</strong>
            </div>
            <div>
                <span>Painter: </span>
                <span>{ data.painter.name }</span>
            </div>
        </div>
    );
};
