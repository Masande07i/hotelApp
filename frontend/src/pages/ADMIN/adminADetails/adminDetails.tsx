import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {fetchAccommodations,fetchAccommodationImages} from "../../../features/accomodationSlice";
import {
    type CreateRoomInputs,
    fetchRoomsByAccommodation,
    createRoom,
    deleteRoom,
    updateRoomInputs,
    openRoomForm,
    closeRoomForm
} from "../../../features/roomSlice";
import { Text } from "../../../components/Text/text";
import { Button } from "../../../components/button/button";
import { AddRoomForm } from "../../../components/Popup/roomPopup/roomPopup"

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

    const { rooms, loading, error, inputs, showForm } = useSelector(
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

    const handleAddRoom = async () => {
        if (!id) return;

        const roomData: CreateRoomInputs = {
            accommodation_id: Number(id),
            room_type: inputs.room_type,
            description: inputs.description || null,
            bed_type: inputs.bed_type || null,
            capacity: Number(inputs.capacity),
            price_per_night: Number(inputs.price_per_night),
            total_rooms: Number(inputs.total_rooms),
            amenities: inputs.amenities
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
        };

        const result = await dispatch(createRoom(roomData));

        if (createRoom.fulfilled.match(result)) {
            dispatch(updateRoomInputs({
                room_type: "",
                description: "",
                bed_type: "",
                capacity: "1",
                price_per_night: "",
                total_rooms: "1",
                amenities: ""
            }));

            dispatch(closeRoomForm());
        }
    };
    const handleDeleteRoom = async (roomId: number, roomType: string) => {
    const confirmed = window.confirm(
        `Are you sure you want to delete ${roomType}?`
    );

    if (!confirmed) return;

    await dispatch(deleteRoom(roomId));
};

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

            <Button
                label="Add Room"
                type="button"
                onClick={() => {
                    dispatch(updateRoomInputs({
                        room_type: "",
                        description: "",
                        bed_type: "",
                        capacity: "1",
                        price_per_night: "",
                        total_rooms: "1",
                        amenities: ""
                    }));

                    dispatch(openRoomForm());
                }}
            />


            {showForm && (
                <AddRoomForm
                    onSubmit={handleAddRoom}
                    onClose={() => dispatch(closeRoomForm())}
                />
            )}

            {loading ? (
                <Text variant="p">Loading rooms...</Text>
            ) : error ? (
                <Text variant="p">{error}</Text>
            ) : rooms.length === 0 ? (
                <Text variant="p">
                    No rooms have been added to this accommodation yet.
                </Text>
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

                        <Button
                            label="Delete Room"
                            type="button"
                            onClick={() => handleDeleteRoom(room.id, room.room_type)}
                        />
                    </div>
                ))
            )}
        </div>
    );
};
