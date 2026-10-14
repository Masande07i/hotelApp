import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store"
import { fetchAccommodations } from "../../features/accomodationSlice"
import { Text } from "../../components/Text/text";
import style from "./accomodations.module.css"



export const accomodations = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { accommodations, loading, error } = useSelector((state: RootState) => state.accommodation);
  
    useEffect(() => {
    dispatch(fetchAccommodations());
   }, [dispatch]);

   if (loading) {
    return <p>Loading accommodations...</p>;
}

if (error) {
    return <p>{error}</p>;
}

    return (
    
    <div>
        <Text variant="h1" >Explore Accommodations</Text>

        {accommodations.map((accommodation) => (
            <div key={accommodation.id}>
                <h2>{accommodation.name}</h2>
                <p>{accommodation.description}</p>
                <p>{accommodation.address}</p>
                <p>
                    {accommodation.city}, {accommodation.country}
                </p>
                <p>Rating: {accommodation.star_rating ?? "Not rated"}</p>
            </div>
        ))}
    </div>
);
  
}
