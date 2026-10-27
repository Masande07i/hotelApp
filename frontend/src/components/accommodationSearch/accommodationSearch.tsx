import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Text } from "../Text/text";
import { Button } from "../button/button";
import styles from "./accommodationSearch.module.css";

export const accommodationSearch = () => {
    const accommodations = useSelector(
        (state: RootState) => state.accommodation.accommodations
    );

   return (
    <div className={styles.search}>
        <div className={styles.field}>
            <Text variant="p">Destination</Text>
            <select>
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
                min={new Date().toISOString().split("T")[0]}
            />
        </div>

        <div className={styles.field}>
            <Text variant="p">Check-out</Text>
            <input
                type="date"
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
            />
        </div>

        <Button
            label="Search"
            type="button"
            onClick={() => {}}
        />
    </div>
);
    
};