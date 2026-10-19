import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
    fetchAccommodations,
    fetchAccommodationImages
} from "../../../features/accomodationSlice";
import { Text } from "../../../components/Text/text";
import { fetchRoomsByAccommodation } from "../../../features/roomSlice";

export const AdminDetails = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();

    const accommodations = useSelector(
        (state: RootState) => state.accommodation.accommodations
    );

    const images = useSelector(
        (state: RootState) =>
            state.accommodation.imagesByAccommodation[Number(id)]
    );

    const accommodation = accommodations.find(
        (item) => item.id === Number(id)
    );
    const { rooms, loading, error } = useSelector(
    (state: RootState) => state.room
);  

    useEffect(() => {
        if (accommodations.length === 0) {
            dispatch(fetchAccommodations());
        }
    }, [dispatch, accommodations.length]);

   useEffect(() => {
    if (id) {
        dispatch(fetchAccommodationImages(Number(id)));
        dispatch(fetchRoomsByAccommodation(Number(id)));
    }
}, [dispatch, id]);

    if (!accommodation) {
        return <Text variant="p">Loading accommodation details...</Text>;
    }

    return (
        <div>
            <Text variant="h1">{accommodation.name}</Text>

            <Text variant="p">
                {accommodation.address}, {accommodation.city},{" "}
                {accommodation.country}
            </Text>

            <Text variant="p">
                Rating: {accommodation.star_rating ?? "Not rated"}
            </Text>

            <div>
                {images?.map((image) => (
                    <img
                        key={image.id}
                        src={image.image_url}
                        alt={accommodation.name}
                        width="300"
                    />
                ))}
            </div>

            <Text variant="h2">About this accommodation</Text>
            <Text variant="p">{accommodation.description}</Text>

            <hr />

        <Text variant="h1">Manage Rooms</Text>

        {loading ? (
            <Text variant="p">Loading rooms...</Text>
        ) : error ? (
            <Text variant="p">{error}</Text>
        ) : rooms.length === 0 ? (
            <Text variant="p">No rooms have been added to this accommodation yet.</Text>
        ) : (
            rooms.map((room) => (
                <div key={room.id}>
                    <Text variant="h2">{room.room_type}</Text>
                    <Text variant="p">
                        {room.description ?? "No description available"}
                    </Text>
                    <Text variant="p">
                        Bed type: {room.bed_type ?? "Not specified"}
                    </Text>
                    <Text variant="p">Capacity: {room.capacity} guests</Text>
                    <Text variant="p">Price per night: R{room.price_per_night}</Text>
                    <Text variant="p">Total rooms: {room.total_rooms}</Text>
                    <Text variant="p">
                        Amenities: {room.amenities?.join(", ") || "None listed"}
                    </Text>
                </div>
            ))
        )}
        </div>
    );
};
