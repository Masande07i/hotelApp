import { Text } from "../Text/text";

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
    return (
        <div>
            <Text variant="h2">{name}</Text>
            <Text variant="p">{description}</Text>
            <Text variant="p" >{address}</Text>
            <Text variant="p">{city}, {country}</Text>
            <Text variant="p">Rating: {star_rating ?? "Not rated"}</Text>
        </div>
    );
};
