import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import { updateBookingInputs, setSelectedRoom ,createBooking} from "../../../features/bookingSlice";
import type { Accommodation } from "../../../features/accomodationSlice";
import type { Room } from "../../../features/roomSlice";
import { Text } from "../../../components/Text/text";
import style from "./booking.module.css";

interface BookingPageState {
    accommodation: Accommodation;
    room: Room;
}

export const Booking = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();

    const { inputs, loading, error } = useSelector(
        (state: RootState) => state.booking
    );

    const booking = location.state as BookingPageState | null;
    const accommodation = booking?.accommodation;
    const room = booking?.room;

    useEffect(() => {
        if (room) {
            dispatch(setSelectedRoom(room.id));
            dispatch(
                updateBookingInputs({
                    number_of_guests: String(Math.min(1, room.capacity))
                })
            );
        }
    }, [dispatch, room]);

    if (!accommodation || !room) {
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

    const handleInputChange = (
        field: "check_in" | "check_out" | "number_of_rooms" | "number_of_guests",
        value: string
    ) => {
        dispatch(updateBookingInputs({ [field]: value }));
    };

    const nights =
        inputs.check_in && inputs.check_out
            ? Math.max(
                  0,
                  Math.ceil(
                      (new Date(inputs.check_out).getTime() -
                          new Date(inputs.check_in).getTime()) /
                          (1000 * 60 * 60 * 24)
                  )
              )
            : 0;

    const totalPrice =
        Number(room.price_per_night) *
        Number(inputs.number_of_rooms) *
        nights;

  const handleContinue = async () => {
    if (
        !inputs.check_in ||
        !inputs.check_out ||
        inputs.check_in >= inputs.check_out
    ) {
        return;
    }

    if (
        Number(inputs.number_of_rooms) < 1 ||
        Number(inputs.number_of_rooms) > room.total_rooms ||
        Number(inputs.number_of_guests) < 1 ||
        Number(inputs.number_of_guests) >
            room.capacity * Number(inputs.number_of_rooms)
    ) {
        return;
    }

    const result = await dispatch(
        createBooking({
            check_in: inputs.check_in,
            check_out: inputs.check_out,
            room_id: room.id,
            number_of_rooms: Number(inputs.number_of_rooms),
            number_of_guests: Number(inputs.number_of_guests)
        })
    );

    if (createBooking.fulfilled.match(result)) {
        navigate("/payment", {
            state: {
                accommodation,
                room,
                booking: result.payload
            }
        });
    }
};

    return (
        <div className={style.bookingPage}>
            <button
                type="button"
                className={style.backButton}
                onClick={() =>
                    navigate(`/accommodations/${accommodation.id}`)
                }
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
                                <input
                                    type="date"
                                    value={inputs.check_in}
                                    min={new Date().toISOString().split("T")[0]}
                                    onChange={(event) =>
                                        handleInputChange(
                                            "check_in",
                                            event.target.value
                                        )
                                    }
                                    required
                                />
                            </label>

                            <label>
                                Check-out
                                <input
                                    type="date"
                                    value={inputs.check_out}
                                    min={
                                        inputs.check_in ||
                                        new Date().toISOString().split("T")[0]
                                    }
                                    onChange={(event) =>
                                        handleInputChange(
                                            "check_out",
                                            event.target.value
                                        )
                                    }
                                    required
                                />
                            </label>
                        </div>

                        <div className={style.guestFields}>
                            <label>
                                Rooms
                                <input
                                    type="number"
                                    min="1"
                                    max={room.total_rooms}
                                    value={inputs.number_of_rooms}
                                    onChange={(event) =>
                                        handleInputChange(
                                            "number_of_rooms",
                                            event.target.value
                                        )
                                    }
                                    required
                                />
                            </label>

                            <label>
                                Guests
                                <input
                                    type="number"
                                    min="1"
                                    max={
                                        room.capacity *
                                        Number(inputs.number_of_rooms)
                                    }
                                    value={inputs.number_of_guests}
                                    onChange={(event) =>
                                        handleInputChange(
                                            "number_of_guests",
                                            event.target.value
                                        )
                                    }
                                    required
                                />
                            </label>
                        </div>
                    </section>

                    <section className={style.section}>
                        <Text variant="h2">Guest Information</Text>
                        <Text variant="p">
                            Your contact details will be taken from your
                            account when you continue.
                        </Text>
                    </section>

                    {error && (
                        <Text variant="p">{error}</Text>
                    )}
                </main>

                <aside className={style.bookingSummary}>
                    <Text variant="h2">Booking Summary</Text>

                    <div className={style.hotelInfo}>
                        <div className={style.hotelPlaceholder}></div>
                        <div>
                            <Text variant="h2">{accommodation.name}</Text>
                            <Text variant="p">
                                {accommodation.city}, {accommodation.country}
                            </Text>
                            <Text variant="p">{room.room_type}</Text>
                            <Text variant="p">
                                Up to {room.capacity} guests per room
                            </Text>
                        </div>
                    </div>

                    <div className={style.priceRow}>
                        <span>Price per night</span>
                        <strong>
                            R
                            {Number(room.price_per_night).toLocaleString(
                                "en-ZA"
                            )}
                        </strong>
                    </div>

                    <div className={style.priceRow}>
                        <span>Rooms</span>
                        <strong>{inputs.number_of_rooms}</strong>
                    </div>

                    <div className={style.priceRow}>
                        <span>Nights</span>
                        <strong>{nights}</strong>
                    </div>

                    <div className={style.totalRow}>
                        <span>Estimated total</span>
                        <strong>
                            R{totalPrice.toLocaleString("en-ZA")}
                        </strong>
                    </div>

                    <button
                        type="button"
                        className={style.continueButton}
                        onClick={handleContinue}
                        disabled={loading}
                    >
                        Continue to Payment
                    </button>
                </aside>
            </div>
        </div>
    );
};
