import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Text } from "../Text/text";
import { Button } from "../button/button";
import styles from "./accommodationSearch.module.css";
import { useNavigate } from "react-router-dom";

export const accommodationSearch = () => {
    const navigate = useNavigate();
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const destination = formData.get("destination");
    const checkIn = formData.get("checkIn");
    const checkOut = formData.get("checkOut");
    const guests = formData.get("guests");

    const params = new URLSearchParams({
        destination: String(destination),
        checkIn: String(checkIn),
        checkOut: String(checkOut),
        guests: String(guests)
    });

    navigate(`/accomodations?${params.toString()}`);
};
    const accommodations = useSelector(
        (state: RootState) => state.accommodation.accommodations
    );

   return (
    <form className={styles.search} onSubmit={handleSearch}>
        <div className={styles.field}>
            <Text variant="p">Destination</Text>
            <select name="destination">
                <option value="">Select accommodation</option>
                {accommodations.map((accommodation) => (
                    <option key={accommodation.id} value={accommodation.id}>
                        {accommodation.name}
                    </option>
                ))}
            </select>
        </div>

        <div className={styles.field}>
            <Text variant="p">Check-in</Text>
            <input
                type="date"
                name="checkIn"
                min={new Date().toISOString().split("T")[0]}
            />
        </div>

        <div className={styles.field}>
            <Text variant="p">Check-out</Text>
            <input
                type="date"
                name="checkOut"
                min={new Date().toISOString().split("T")[0]}
            />
        </div>

        <div className={styles.field}>
            <Text variant="p">Guests</Text>
            <input
                type="number"
                min="1"
                defaultValue="1"
                placeholder="Number of guests"
                name="guests"
            />
        </div>

        <Button
            label="Search"
            type="submit"
            onClick={() => {}}
        />
    </form>
);
    
};