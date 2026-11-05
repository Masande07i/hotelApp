import styles from "./hero.module.css"
import { Text } from "../Text/text";
import { accommodationSearch as AccommodationSearch } from "../accommodationSearch/accommodationSearch";

export const hero = () => {
    return (
        <div className={styles.hero}>
            <div className={styles.heroContent}>
                <Text variant="h3">ESCAPE TO SOMETHING BEAUTIFUL</Text>
                <Text variant="h1">Experience Luxury, Comfort & Relaxation</Text>
                <Text variant="p">Discover exceptional stays and unforgettable destinations with Havenly.</Text>
            </div>

            <AccommodationSearch />
        </div>
    );
};