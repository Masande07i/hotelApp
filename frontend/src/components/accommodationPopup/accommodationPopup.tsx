import { Text } from "../Text/text";
import { Button } from "../button/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import type { RootState, AppDispatch } from "../../store/store";
import {
    updateAccommodationInputs,
    createAccommodation,
    updateAccommodation,
    setSelectedImages,
    uploadAccommodationImage
} from "../../features/accomodationSlice";
import type { Accommodation } from "../../features/accomodationSlice";
import type { FormEvent } from "react";

interface AccommodationPopupProps {
    onClose: () => void;
    accommodation?: Accommodation;
}

export const AccommodationPopup = ({
    onClose,
    accommodation
}: AccommodationPopupProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const inputs = useSelector(
        (state: RootState) => state.accommodation.inputs
    );

    const error = useSelector(
        (state: RootState) => state.accommodation.error
    );

    const selectedImages = useSelector(
        (state: RootState) => state.accommodation.selectedImages
    );

    const isEditing = Boolean(accommodation);

   useEffect(() => {
    if (accommodation) {
        dispatch(updateAccommodationInputs({
            name: accommodation.name,
            description: accommodation.description,
            address: accommodation.address,
            city: accommodation.city,
            country: accommodation.country,
            star_rating: accommodation.star_rating?.toString() ?? ""
        }));

        dispatch(setSelectedImages([]));
    }
}, [accommodation?.id, dispatch]);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        let accommodationId: number;

        if (accommodation) {
            const result = await dispatch(
                updateAccommodation(accommodation.id)
            );

            if (!updateAccommodation.fulfilled.match(result)) {
                return;
            }

            accommodationId = result.payload.id;
        } else {
            const result = await dispatch(createAccommodation());

            if (!createAccommodation.fulfilled.match(result)) {
                return;
            }

            accommodationId = result.payload.accommodation.id;
        }

        for (const image of selectedImages) {
            const uploadResult = await dispatch(
                uploadAccommodationImage({
                    accommodationId,
                    image
                })
            );

            if (uploadAccommodationImage.rejected.match(uploadResult)) {
                return;
            }
        }

        dispatch(setSelectedImages([]));
        onClose();
    };

    return (
        <div>
            <Text variant="h2">
                {isEditing ? "Edit Accommodation" : "New Accommodation"}
            </Text>

            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Accommodation Name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter accommodation name"
                    value={inputs.name}
                    onChange={(event) =>
                        dispatch(updateAccommodationInputs({
                            name: event.target.value
                        }))
                    }
                    required
                />

                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    placeholder="Describe the accommodation"
                    value={inputs.description}
                    onChange={(event) =>
                        dispatch(updateAccommodationInputs({
                            description: event.target.value
                        }))
                    }
                    required
                />

                <label htmlFor="address">Address</label>
                <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Enter street address"
                    value={inputs.address}
                    onChange={(event) =>
                        dispatch(updateAccommodationInputs({
                            address: event.target.value
                        }))
                    }
                    required
                />

                <label htmlFor="city">City</label>
                <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Enter city"
                    value={inputs.city}
                    onChange={(event) =>
                        dispatch(updateAccommodationInputs({
                            city: event.target.value
                        }))
                    }
                    required
                />

                <label htmlFor="country">Country</label>
                <input
                    id="country"
                    name="country"
                    type="text"
                    placeholder="Enter country"
                    value={inputs.country}
                    onChange={(event) =>
                        dispatch(updateAccommodationInputs({
                            country: event.target.value
                        }))
                    }
                    required
                />

                <label htmlFor="accommodationImages">
                    Accommodation Images
                </label>

                <input
                    id="accommodationImages"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(event) => {
                        const files = Array.from(
                            event.target.files ?? []
                        );

                        dispatch(setSelectedImages(files));
                    }}
                />

                {selectedImages.length > 0 && (
                    <p>{selectedImages.length} image(s) selected</p>
                )}

                <label htmlFor="star_rating">Star Rating</label>
                <select
                    id="star_rating"
                    name="star_rating"
                    value={inputs.star_rating}
                    onChange={(event) =>
                        dispatch(updateAccommodationInputs({
                            star_rating: event.target.value
                        }))
                    }
                >
                    <option value="">No rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                </select>

                {error && <p>{error}</p>}

                <Button
                    label={isEditing ? "Update Accommodation" : "Save Accommodation"}
                    type="submit"
                />

                <Button
                    label="Close"
                    onClick={onClose}
                    type="button"
                />
            </form>
        </div>
    );
};
