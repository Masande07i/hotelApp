import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../../store/store"
import { fetchFavourites } from "../../../features/favouriteSlice"
import { Text } from "../../../components/Text/text"
import { CustomerAccommodationCard } from "../../../components/customerAccommodationCard/customerAccommodationCard"
import { Footer } from "../../../components/footer/footer"
import { ProfileSidebar } from "../../../components/ProfileSidebar/ProfileSidebar"
import style from "./favourites.module.css"

export const Favourites = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const user = useSelector((state: RootState) => state.auth.user)

    const favourites = useSelector(
        (state: RootState) => state.favourite.favourites
    )

    useEffect(() => {
        if (!user) {
            navigate("/login")
            return
        }

        dispatch(fetchFavourites())
    }, [user, dispatch, navigate])

    if (!user) {
        return null
    }

    return (
        <div className={style.page}>
            <Text variant="h1">My Favourites</Text>

            <div className={style.favouritesLayout}>
                <ProfileSidebar />

                <main className={style.favouritesContent}>
                    <Text variant="h2">Favourite Hotels</Text>

                    {favourites.length === 0 ? (
                        <div className={style.emptySection}>
                            <Text variant="p">
                                You haven't added any favourite hotels yet.
                            </Text>
                        </div>
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
                </main>
            </div>

            <Footer />
        </div>
    )
}