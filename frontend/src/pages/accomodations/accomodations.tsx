import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store"
import { fetchAccommodations } from "../../features/accomodationSlice"
import { Text } from "../../components/Text/text";
import { AccommodationCard } from "../../components/accomodationCard/accomodationCard"
import { CustomerAccommodationCard } from"../../components/customerAccommodationCard/customerAccommodationCard";



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
    <CustomerAccommodationCard
        key={accommodation.id}
        {...accommodation}
    />
))}
    </div>
);
  
}
