import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store"
import { fetchAccommodations } from "../../features/accomodationSlice"
import { Text } from "../../components/Text/text";




export const accomodations = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { accommodations, loading, error } = useSelector((state: RootState) => state.accommodation);
  
    useEffect(() => {
    dispatch(fetchAccommodations());
   }, [dispatch]);

   if (loading) {
    return <Text>Loading accommodations...</Text>;
}

if (error) {
    return <Text variant="p">{error}</Text>;
}

    return (
    
    <div>
        <Text variant="h1" >Explore Accommodations</Text>

        {accommodations.map((accommodation) => (
            <div key={accommodation.id}>
                <Text variant="h2">{accommodation.name}</Text>
                <Text variant="p">{accommodation.description}</Text>
                <Text variant="p">{accommodation.address}</Text>
                <Text variant="p">
                    {accommodation.city}, {accommodation.country}
                </Text>
                <Text variant="p">Rating: {accommodation.star_rating ?? "Not rated"}</Text>
            </div>
        ))}
    </div>
);
  
}
