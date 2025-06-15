import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi.ts';
import type { PainterSlotDto } from '../api/dto/painter.dto.ts';
import { ErrorBlock } from '../components/ErrorBlock.tsx';
import { SlotList } from '../components/PainterSlotList.tsx';
import { AddPainterSlot } from '../components/AddPainterSlot.tsx';

import 'react-datepicker/dist/react-datepicker.css';

const PainterDashboard: React.FC = () => {

    const [slots, setSlots] = useState<PainterSlotDto[]>([]);
    const [isAddVisible, setIsAddVisible] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>();

    const api = useApi();

    // Here is better to use something like TanStack useQuery instead
    useEffect(() => {
        let subscribed = true;
        (async () => {
            try {
                setLoading(true);
                const response = await api.getPainterSlots();
                if (!subscribed) {
                    return;
                }

                setSlots(response);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Something went wrong');
            } finally {
                setLoading(false);
            }
        })();
        return () => { subscribed = false; };
    }, []);

    const handleAdd = (slot: PainterSlotDto) => {
        setSlots([...slots, slot]);
    };


    return (
        <div>
            <h2 className="mb-3">My timeslots</h2>

            <div className="mb-3">
                {
                    isAddVisible
                        ? <AddPainterSlot onAdd={ handleAdd } onCancel={ () => setIsAddVisible(false) } />
                        : <button className="btn btn-primary" onClick={ () => setIsAddVisible(true) }>Add time slot</button>
                }
            </div>

            {
                loading && (
                    <div>Loading...</div>
                )
            }

            <ErrorBlock error={ error } />

            {
                slots && slots.length > 0 && (
                    <SlotList slots={ slots } />
                )
            }
        </div>
    );
};

export default PainterDashboard;
