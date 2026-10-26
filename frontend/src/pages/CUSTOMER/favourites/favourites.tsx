import { useEffect } from "react";
import style from "./favourites.module.css";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { fetchFavourites } from "../../../features/favouriteSlice";
import { Text } from "../../../components/Text/text";
import { CustomerAccommodationCard } from "../../../components/customerAccommodationCard/customerAccommodationCard";

export const Favourites = () => {
    const dispatch = useDispatch<AppDispatch>();

    const favourites = useSelector(
        (state: RootState) => state.favourite.favourites
    );

    useEffect(() => {
        dispatch(fetchFavourites());
    }, [dispatch]);

    return (
        <div className={style.page}>
    <Text variant="h1">My Favourites</Text>

    {favourites.length === 0 ? (
        <Text variant="p">You haven't added any favourite hotels yet.</Text>
    ) : (
        <div className={style.listings}>
            {favourites.map((accommodation) => (
                <CustomerAccommodationCard
                    key={accommodation.id}
                    {...accommodation}
                />
            ))}
        </div>
    )}
</div>
    );
};