import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { useApi } from '../hooks/useApi.ts';
import { type BookingDto, RequestBookingResponseDto, SuggestionResponseDto } from '../api/dto/booking.dto.ts';

type RequestBookingProps = {
    onAdd: (slot: BookingDto) => void;
    onCancel: () => void;
};

export const RequestBooking: React.FC<RequestBookingProps> = (props) => {
    const api = useApi();

    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [error, setError] = useState('');

    const handleAdd = async () => {
        if (!startTime || !endTime) {
            setError('Please fill both start and end time');
            return;
        }

        if (startTime >= endTime) {
            setError('End time must be after start time');
            return;
        }

        try {
            const response = await api.requestBooking({
                startTime,
                endTime
            });

            if ((response as SuggestionResponseDto).error) {
                setError((response as SuggestionResponseDto).error);
                return;
            }

            props.onAdd(response as RequestBookingResponseDto);
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'Something went wrong');
        }

        setStartTime(null);
        setEndTime(null);
        setError('');
    };

    const handleCancel = () => {
        props.onCancel();
    };

    return (
        <div className="border p-3 mb-4 rounded bg-light">
            <h5>Request booking</h5>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
                <div className="form-label">Start Time</div>
                <ReactDatePicker
                    showTimeSelect={ true }
                    selected={startTime}
                    dateFormat="dd.MM.yyyy HH:mm"
                    onChange={date => setStartTime(date)}
                    className="form-control"
                />
            </div>

            <div className="mb-3">
                <div className="form-label">End Time</div>
                <ReactDatePicker
                    showTimeSelect={ true }
                    selected={endTime}
                    dateFormat="dd.MM.yyyy HH:mm"
                    onChange={date => setEndTime(date)}
                    className="form-control"
                />
            </div>

            <button type="button" className="btn btn-primary me-2" onClick={handleAdd}>Request</button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
        </div>
    );
};
