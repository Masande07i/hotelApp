import { useLocation, useNavigate } from "react-router-dom";
import { Text } from "../../../components/Text/text";
import style from "./booking.module.css";

interface BookingAccommodation {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
    star_rating?: number | null;
}

interface BookingRoom {
    id: number;
    room_type: string;
    description: string | null;
    bed_type: string | null;
    capacity: number;
    price_per_night: number;
    amenities?: string[];
}

interface BookingPageState {
    accommodation: BookingAccommodation;
    room: BookingRoom;
}

export const Booking = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const booking = location.state as BookingPageState | null;

    if (!booking?.accommodation || !booking?.room) {
        return (
            <div className={style.bookingPage}>
                <Text variant="h2">No room selected</Text>
                <Text variant="p">
                    Please select a room before continuing with your booking.
                </Text>
                <button
                    type="button"
                    className={style.backButton}
                    onClick={() => navigate("/accomodations")}
                >
                    Browse Hotels
                </button>
            </div>
        );
    }

    const { accommodation, room } = booking;

    return (
        <div className={style.bookingPage}>
            <button
                type="button"
                className={style.backButton}
                onClick={() => navigate(`/accommodations/${accommodation.id}`)}
            >
                ← Back to hotel
            </button>

            <Text variant="h1">Complete Your Booking</Text>
            <Text variant="p">
                Review your room and booking details below.
            </Text>

            <div className={style.bookingLayout}>
                <main className={style.bookingForm}>
                    <section className={style.section}>
                        <Text variant="h2">Your Stay</Text>

                        <div className={style.dateFields}>
                            <label>
                                Check-in
                                <input type="date" />
                            </label>

                            <label>
                                Check-out
                                <input type="date" />
                            </label>
                        </div>

                        <div className={style.guestFields}>
                            <label>
                                Rooms
                                <input type="number" min="1" defaultValue="1" />
                            </label>

                            <label>
                                Guests
                                <input
                                    type="number"
                                    min="1"
                                    max={room.capacity}
                                    defaultValue={Math.min(2, room.capacity)}
                                />
                            </label>
                        </div>
                    </section>

                    <section className={style.section}>
                        <Text variant="h2">Guest Information</Text>

                        <label>
                            Full name
                            <input
                                type="text"
                                defaultValue=""
                                placeholder="Enter your full name"
                            />
                        </label>

                        <label>
                            Email address
                            <input
                                type="email"
                                placeholder="Enter your email"
                            />
                        </label>
                    </section>
                </main>

                <aside className={style.bookingSummary}>
                    <Text variant="h2">Booking Summary</Text>

                    <div className={style.hotelInfo}>
                        <div className={style.hotelPlaceholder}>
                            
                        </div>

                        <div>
                            <Text variant="h2">{accommodation.name}</Text>
                            <Text variant="p">
                                {accommodation.city}, {accommodation.country}
                            </Text>
                            <Text variant="p">{room.room_type}</Text>
                            <Text variant="p">
                                {room.capacity} guests maximum
                            </Text>
                        </div>
                    </div>

                    <div className={style.priceRow}>
                        <span>Price per night</span>
                        <strong>
                            R{Number(room.price_per_night).toLocaleString("en-ZA")}
                        </strong>
                    </div>

                    <div className={style.priceRow}>
                           
                    </div>

                    <div className={style.totalRow}>
                        <span>Estimated total</span>
                        <strong>
                            R{Number(room.price_per_night).toLocaleString("en-ZA")} / night
                        </strong>
                    </div>

                    <button
                        type="button"
                        className={style.continueButton}
                        onClick={() => {}}
                    >
                        Continue to Payment
                    </button>

                    
                </aside>
            </div>
        </div>
    );
};
