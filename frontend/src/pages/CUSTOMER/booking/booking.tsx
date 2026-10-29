
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import { updateBookingInputs, setSelectedRoom, createBooking } from "../../../features/bookingSlice";
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

    const numberOfRooms = Number(inputs.number_of_rooms) || 1;
    const totalPrice =
        Number(room.price_per_night) * numberOfRooms * nights;

    const serviceFee = 0;
    const grandTotal = totalPrice + serviceFee;

    const handleContinue = async () => {
        if (
            !inputs.check_in ||
            !inputs.check_out ||
            inputs.check_in >= inputs.check_out
        ) {
            return;
        }

        if (
            numberOfRooms < 1 ||
            numberOfRooms > room.total_rooms ||
            Number(inputs.number_of_guests) < 1 ||
            Number(inputs.number_of_guests) >
                room.capacity * numberOfRooms
        ) {
            return;
        }

        const result = await dispatch(
            createBooking({
                check_in: inputs.check_in,
                check_out: inputs.check_out,
                room_id: room.id,
                number_of_rooms: numberOfRooms,
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
            <div className={style.bookingCard}>
                <button
                    type="button"
                    className={style.backButton}
                    onClick={() =>
                        navigate(`/accommodations/${accommodation.id}`)
                    }
                >
                    ← Back to accommodation
                </button>

                <Text variant="h1">Complete Your Booking</Text>

                <div className={style.hotelInfo}>
                    <div className={style.hotelPlaceholder}>
                        <span>Havenly</span>
                    </div>

                    <div className={style.hotelDetails}>
                        <Text variant="h2">{accommodation.name}</Text>
                        <Text variant="p">{room.room_type}</Text>
                        <Text variant="p">
                            {accommodation.city}, {accommodation.country}
                        </Text>
                    </div>
                </div>

                <div className={style.fields}>
                    <label>
                        Check-in
                        <input
                            type="date"
                            value={inputs.check_in}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(event) =>
                                handleInputChange("check_in", event.target.value)
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
                                handleInputChange("check_out", event.target.value)
                            }
                            required
                        />
                    </label>
                </div>

                <div className={style.fields}>
                    <label>
                        Rooms
                        <div className={style.counter}>
                            <button
                                type="button"
                                onClick={() =>
                                    handleInputChange(
                                        "number_of_rooms",
                                        String(Math.max(1, numberOfRooms - 1))
                                    )
                                }
                            >
                                −
                            </button>

                            <span>{inputs.number_of_rooms}</span>

                            <button
                                type="button"
                                onClick={() =>
                                    handleInputChange(
                                        "number_of_rooms",
                                        String(Math.min(room.total_rooms, numberOfRooms + 1))
                                    )
                                }
                            >
                                +
                            </button>
                        </div>
                    </label>

                    <label>
                        Guests
                        <div className={style.counter}>
                            <button
                                type="button"
                                onClick={() =>
                                    handleInputChange(
                                        "number_of_guests",
                                        String(
                                            Math.max(1, Number(inputs.number_of_guests) - 1)
                                        )
                                    )
                                }
                            >
                                
                            </button>

                            <span>{inputs.number_of_guests}</span>

                            <button
                                type="button"
                                onClick={() =>
                                    handleInputChange(
                                        "number_of_guests",
                                        String(
                                            Math.min(
                                                room.capacity * numberOfRooms,
                                                Number(inputs.number_of_guests) + 1
                                            )
                                        )
                                    )
                                }
                            >
                                +
                            </button>
                        </div>
                    </label>
                </div>

                <div className={style.priceDetails}>
                    <div className={style.priceRow}>
                        <span>
                            {nights} nights × R
                            {Number(room.price_per_night).toLocaleString("en-ZA")}
                        </span>
                        <strong>R{totalPrice.toLocaleString("en-ZA")}</strong>
                    </div>

                    <div className={style.priceRow}>
                        <span>Service fee</span>
                        <strong>R{serviceFee.toLocaleString("en-ZA")}</strong>
                    </div>

                    <div className={style.totalRow}>
                        <span>Total</span>
                        <strong>R{grandTotal.toLocaleString("en-ZA")}</strong>
                    </div>
                </div>

                {error && (
                    <Text variant="p">{error}</Text>
                )}

                <button
                    type="button"
                    className={style.continueButton}
                    onClick={handleContinue}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Continue to Payment"}
                </button>
            </div>
        </div>
    );
};
