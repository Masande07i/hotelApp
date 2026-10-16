import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchRoomsByAccommodation } from "../../features/roomSlice";
import { Text } from "../../components/Text/text";

export const AccommodationDetails = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();

    const { rooms, loading, error } = useSelector(
        (state: RootState) => state.room
    );

    useEffect(() => {
        if (id) {
            dispatch(fetchRoomsByAccommodation(Number(id)));
        }
    }, [dispatch, id]);

    if (loading) {
        return <Text>Loading rooms...</Text>;
    }

    if (error) {
        return <Text variant="p">{error}</Text>;
    }

    return (
        <div>
            <Text variant="h1">Available Rooms</Text>

            {rooms.length === 0 ? (
                <Text variant="p">No rooms available for this accommodation.</Text>
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
                        <Text variant="p">
                            Capacity: {room.capacity} guests
                        </Text>
                        <Text variant="p">
                            Price per night: R{room.price_per_night}
                        </Text>
                        <Text variant="p">
                            Total rooms: {room.total_rooms}
                        </Text>
                        <Text variant="p">
                            Amenities: {room.amenities?.join(", ") || "None listed"}
                        </Text>
                    </div>
                ))
            )}
        </div>
    );
};
