
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import type { AppDispatch, RootState } from "../../../store/store";
import { fetchAccommodations } from "../../../features/accomodationSlice";
import { Text } from "../../../components/Text/text";
import { CustomerAccommodationCard } from "../../../components/customerAccommodationCard/customerAccommodationCard";
import styles from "./accomodations.module.css";
import { fetchFavourites } from "../../../features/favouriteSlice";
import { Navbar } from "../../../components/navbar/navbar";
import { Footer } from "../../../components/footer/footer";

export const accomodations = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams, setSearchParams] = useSearchParams();

    const destination = searchParams.get("destination") || "";
    const search = searchParams.get("search") || "";
    const selectedCity = searchParams.get("city") || "";
    const selectedRating = searchParams.get("rating") || "";
    const sortBy = searchParams.get("sort") || "";

    const { accommodations, loading, error } = useSelector(
        (state: RootState) => state.accommodation
    );

    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        dispatch(fetchAccommodations());

        if (token) {
            dispatch(fetchFavourites());
        }
    }, [dispatch, token]);

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        setSearchParams(params, { replace: true });
    };

    const clearFilters = () => {
        setSearchParams({});
    };

    const cities = [...new Set(
        accommodations.map((accommodation) => accommodation.city)
    )].sort();

    const filteredAccommodations = accommodations.filter(
        (accommodation) => {
            const matchesDestination =
                !destination ||
                accommodation.city.toLowerCase().trim() ===
                    destination.toLowerCase().trim();

            const matchesSearch =
                accommodation.name.toLowerCase().includes(search.toLowerCase()) ||
                accommodation.city.toLowerCase().includes(search.toLowerCase()) ||
                accommodation.country.toLowerCase().includes(search.toLowerCase());

            const matchesCity =
                !selectedCity || accommodation.city === selectedCity;

            const matchesRating =
                !selectedRating ||
                Number(accommodation.star_rating) >= Number(selectedRating);

            return (
                matchesDestination &&
                matchesSearch &&
                matchesCity &&
                matchesRating
            );
        }
    );

    const sortedAccommodations = [...filteredAccommodations].sort(
        (a, b) => {
            if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            }

            if (sortBy === "rating") {
                return Number(b.star_rating ?? 0) -
                    Number(a.star_rating ?? 0);
            }

            return 0;
        }
    );

    if (loading) {
        return <Text variant="p">Loading accommodations...</Text>;
    }

    if (error) {
        return <Text variant="p">{error}</Text>;
    }

    return (
        <div className={styles.page}>
            <Navbar className={styles.detailsNavbar} />

            <div className={styles.heading}>
                <div>
                    <Text variant="h1">Explore Accommodations</Text>

                    <Text variant="p">
                        {destination
                            ? `Available accommodations in ${destination}.`
                            : "Find the perfect place for your next stay."}
                    </Text>
                </div>

                <Text variant="p">
                    {sortedAccommodations.length} accommodations found
                </Text>
            </div>

            <div className={styles.filters}>
                <div className={styles.searchBox}>
                    <label htmlFor="accommodationSearch">
                        Search accommodations
                    </label>

                    <input
                        id="accommodationSearch"
                        type="text"
                        placeholder="Search by hotel, city or country..."
                        value={search}
                        onChange={(event) =>
                            updateFilter("search", event.target.value)
                        }
                    />
                </div>

                <div className={styles.filterGroup}>
                    <div>
                        <label htmlFor="cityFilter">Location</label>

                        <select
                            id="cityFilter"
                            value={selectedCity}
                            onChange={(event) =>
                                updateFilter("city", event.target.value)
                            }
                        >
                            <option value="">All locations</option>

                            {cities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="ratingFilter">Minimum rating</label>

                        <select
                            id="ratingFilter"
                            value={selectedRating}
                            onChange={(event) =>
                                updateFilter("rating", event.target.value)
                            }
                        >
                            <option value="">Any rating</option>
                            <option value="3">3 stars and above</option>
                            <option value="4">4 stars and above</option>
                            <option value="5">5 stars</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="sortFilter">Sort by</label>

                        <select
                            id="sortFilter"
                            value={sortBy}
                            onChange={(event) =>
                                updateFilter("sort", event.target.value)
                            }
                        >
                            <option value="">Recommended</option>
                            <option value="name">Name (A-Z)</option>
                            <option value="rating">Highest rated</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        className={styles.clearButton}
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {sortedAccommodations.length === 0 ? (
                <div className={styles.noResults}>
                    <Text variant="h2">No accommodations found</Text>

                    <Text variant="p">
                        Try changing your search or filters to find
                        available accommodations.
                    </Text>

                    <button
                        type="button"
                        className={styles.clearButton}
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className={styles.listings}>
                    {sortedAccommodations.map((accommodation) => (
                        <CustomerAccommodationCard
                            key={accommodation.id}
                            {...accommodation}
                        />
                    ))}
                </div>
            )}

            <Footer />
        </div>
    );
};
