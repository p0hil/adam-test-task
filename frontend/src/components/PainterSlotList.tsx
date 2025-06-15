import React from 'react';
import type { PainterSlotDto } from '../api/dto/painter.dto.ts';
import { PainterSlotItem } from './PainterSlotItem.tsx';

type SlotListProps = {
    slots: PainterSlotDto[];
};

export const SlotList: React.FC<SlotListProps> = ({ slots }) => {
    const grouped = slots.reduce<Record<string, PainterSlotDto[]>>((acc, slot) => {
        const dateKey = new Date(slot.startTime).toISOString().split('T')[0];
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }

        acc[dateKey].push(slot);
        return acc;
    }, {});

    const sortedDates = Object.keys(grouped).sort((a, b) =>
        new Date(a).getTime() - new Date(b).getTime(),
    );

    return (
        <div>
            { sortedDates.map((dateKey) => {
                const dateLabel = new Date(dateKey).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                });

                const daySlots = grouped[dateKey].sort(
                    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
                );

                return (
                    <div key={ dateKey } className="mb-4">
                        <h5 className="mb-3">{ dateLabel }</h5>
                        { daySlots.map((slot) => (
                            <PainterSlotItem key={ slot.id } slot={ slot } />
                        )) }
                    </div>
                );
            }) }
        </div>
    );
};
