import React from 'react';
import type { PainterSlotDto } from '../api/dto/painter.dto.ts';

type SlotItemProps = {
    slot: PainterSlotDto;
};

export const PainterSlotItem: React.FC<SlotItemProps> = ({ slot }) => {
    const start = new Date(slot.startTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    const end = new Date(slot.endTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="border rounded p-2 mb-2 bg-light">
            <div>
                <strong>{start}</strong> – <strong>{end}</strong>
            </div>
            <div>{slot.reserved ? 'Reserved' : 'Available'}</div>
        </div>
    );
};
