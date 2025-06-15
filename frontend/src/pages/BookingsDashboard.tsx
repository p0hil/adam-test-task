import React, { useEffect, useState } from 'react';
import type { BookingDto } from '../api/dto/booking.dto.ts';
import { useApi } from '../hooks/useApi.ts';
import { ErrorBlock } from '../components/ErrorBlock.tsx';
import { BookingItem } from '../components/BookingItem.tsx';
import { RequestBooking } from '../components/RequestBooking.tsx';

const BookingsDashboard: React.FC = () => {

    const [bookings, setBookings] = useState<BookingDto[]>([]);
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
                const response = await api.getUpcomingBookings();
                if (!subscribed) {
                    return;
                }

                setBookings(response);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Something went wrong');
            } finally {
                setLoading(false);
            }
        })();
        return () => { subscribed = false; };
    }, []);

    const handleAdd = (booking: BookingDto) => {
        setBookings([...bookings, booking]);
    };

    return (
        <div>
            <h2>My bookings</h2>

            <div className="mb-3">
                {
                    isAddVisible
                        ? <RequestBooking onAdd={ handleAdd } onCancel={ () => setIsAddVisible(false) } />
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
                bookings && bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <BookingItem key={ booking.bookingId } data={ booking } />
                        ))
                    )
                    : <div>You have no upcoming bookings</div>
            }
        </div>
    );
};

export default BookingsDashboard;
