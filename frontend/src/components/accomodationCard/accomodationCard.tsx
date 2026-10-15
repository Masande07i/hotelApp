import { Text } from "../Text/text";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store"
import { fetchAccommodationImages } from "../../features/accomodationSlice"
import { Button } from "../button/button";
import { deleteAccommodation } from "../../features/accomodationSlice";


interface AccommodationCardProps {
    id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    country: string;
    star_rating: number | null;
}

export const AccommodationCard = ({id,name,description,address,city,country,star_rating
}: AccommodationCardProps) => {

    const dispatch = useDispatch<AppDispatch>();
    const images = useSelector(
        (state: RootState) => state.accommodation.imagesByAccommodation[id]
    );
    const accommodationImages = images ?? [];
console.log("Rendering accommodation card:", id);

useEffect(() => {
    if (images === undefined) {
        dispatch(fetchAccommodationImages(id));
    }
}, [dispatch, id, images]);

const handleDelete = async () => {
    const confirmed = window.confirm(
        `Are you sure you want to delete ${name}?`
    );

    if (!confirmed) return;

    await dispatch(deleteAccommodation(id));
};

    return (
        <div>
          
        <div className="accommodation-gallery">
            {accommodationImages.map((image) => (
                <img
                    key={image.id}
                    src={image.image_url}
                    alt={name}
                    width="300"
                />
            ))}
        </div>


            <Text variant="h2">{name}</Text>
            <Text variant="p">{description}</Text>
            <Text variant="p" >{address}</Text>
            <Text variant="p">{city}, {country}</Text>
            <Text variant="p">Rating: {star_rating ?? "Not rated"}</Text>

            <Button
            label="Delete Accommodation"
            onClick={handleDelete}
            type="button"
        />
        </div>

        
    );
};
