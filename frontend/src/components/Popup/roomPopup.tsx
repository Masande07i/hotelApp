import { Text } from "../Text/text";
import { Button } from "../button/button";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { updateRoomInputs } from "../../features/roomSlice";
import type { FormEvent } from "react";
import styles from "./formPopup.module.css"

interface AddRoomFormProps {
    onClose: () => void;
    onSubmit: () => void;
}

export const AddRoomForm = ({ onClose, onSubmit }: AddRoomFormProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const inputs = useSelector((state: RootState) => state.room.inputs);
    const error = useSelector((state: RootState) => state.room.error);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.formCard}>
                <Text variant="h2">Add Room</Text>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <label htmlFor="room_type">Room Type *</label>
                    <input
                        id="room_type"
                        value={inputs.room_type}
                        onChange={(event) =>
                            dispatch(updateRoomInputs({
                                room_type: event.target.value
                            }))
                        }
                        placeholder="e.g. Deluxe Double Room"
                        required
                    />

                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={inputs.description}
                        onChange={(event) =>
                            dispatch(updateRoomInputs({
                                description: event.target.value
                            }))
                        }
                        placeholder="Describe the room..."
                    />

                    <label htmlFor="bed_type">Bed Type</label>
                    <input
                        id="bed_type"
                        value={inputs.bed_type}
                        onChange={(event) =>
                            dispatch(updateRoomInputs({
                                bed_type: event.target.value
                            }))
                        }
                        placeholder="e.g. Queen bed"
                    />

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="capacity">Capacity *</label>
                            <input
                                id="capacity"
                                type="number"
                                min="1"
                                value={inputs.capacity}
                                onChange={(event) =>
                                    dispatch(updateRoomInputs({
                                        capacity: event.target.value
                                    }))
                                }
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="total_rooms">Total Rooms *</label>
                            <input
                                id="total_rooms"
                                type="number"
                                min="1"
                                value={inputs.total_rooms}
                                onChange={(event) =>
                                    dispatch(updateRoomInputs({
                                        total_rooms: event.target.value
                                    }))
                                }
                                required
                            />
                        </div>
                    </div>

                    <label htmlFor="price_per_night">Price Per Night (R) *</label>
                    <input
                        id="price_per_night"
                        type="number"
                        min="0"
                        step="10"
                        value={inputs.price_per_night}
                        onChange={(event) =>
                            dispatch(updateRoomInputs({
                                price_per_night: event.target.value
                            }))
                        }
                        required
                    />

                    <label htmlFor="amenities">Amenities</label>
                    <input
                        id="amenities"
                        value={inputs.amenities}
                        onChange={(event) =>
                            dispatch(updateRoomInputs({
                                amenities: event.target.value
                            }))
                        }
                        placeholder="Wi-Fi, TV, Air conditioning"
                    />

                    {error && (
                        <p className={styles.error}>{error}</p>
                    )}

                    <div className={styles.actions}>
                        <Button
                            label="Cancel"
                            type="button"
                            onClick={onClose}
                            className={styles.cancelButton}
                        />

                        <Button
                            label={inputs.id ? "Update Room" : "Add Room"}
                            type="submit"
                            className={styles.submitButton}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};
