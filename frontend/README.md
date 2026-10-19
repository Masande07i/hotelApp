# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```



import styles from "./accommodationDetails.module.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchRoomsByAccommodation } from "../../features/roomSlice";
import {
    fetchAccommodations,
    fetchAccommodationImages
} from "../../features/accomodationSlice";
import { Text } from "../../components/Text/text";

export const AccommodationDetails = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();

    const { rooms, loading, error } = useSelector(
        (state: RootState) => state.room
    );

    const accommodations = useSelector(
        (state: RootState) => state.accommodation.accommodations
    );

    const accommodation = accommodations.find(
        (item) => item.id === Number(id)
    );

    const images = useSelector(
        (state: RootState) =>
            state.accommodation.imagesByAccommodation[Number(id)]
    );

    useEffect(() => {
        if (accommodations.length === 0) {
            dispatch(fetchAccommodations());
        }
    }, [dispatch, accommodations.length]);

    useEffect(() => {
        if (id) {
            dispatch(fetchRoomsByAccommodation(Number(id)));
            dispatch(fetchAccommodationImages(Number(id)));
        }
    }, [dispatch, id]);

    if (!accommodation) {
        return <Text variant="p">Loading accommodation details...</Text>;
    }

    return (
        <div className={styles.details}>
            <Text variant="h1">{accommodation.name}</Text>

            <Text variant="p">
                {accommodation.address}, {accommodation.city},{" "}
                {accommodation.country}
            </Text>

            <Text variant="p">
                Rating: {accommodation.star_rating ?? "Not rated"}
            </Text>

            <div className={styles.gallery}>
                {images?.map((image) => (
                    <img
                        key={image.id}
                        src={image.image_url}
                        alt={accommodation.name}
                    />
                ))}
            </div>

            <Text variant="h2">About this accommodation</Text>
            <Text variant="p">{accommodation.description}</Text>

            <hr />

           
<Text variant="h1">Select your room</Text>

{loading ? (
    <Text variant="p">Loading rooms...</Text>
) : error ? (
    <Text variant="p">{error}</Text>
) : rooms.length === 0 ? (
    <Text variant="p">
        No rooms available for this accommodation.
    </Text>
) : (
    <div className={styles.tableContainer}>
        <table className={styles.roomTable}>
            <thead>
                <tr>
                    <th>Room type</th>
                    <th>Sleeps</th>
                    <th>Room amenities</th>
                    <th>Price per night</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                {rooms.map((room) => (
                    <tr key={room.id}>
                        <td>
                            <Text variant="h2">{room.room_type}</Text>
                            <Text variant="p">
                                {room.description ?? "No description available"}
                            </Text>
                            <Text variant="p">
                                Bed: {room.bed_type ?? "Not specified"}
                            </Text>
                        </td>

                        <td>{room.capacity} guests</td>

                        <td>
                            {room.amenities?.join(", ") || "None listed"}
                        </td>

                        <td>
                            <Text variant="h2">
                                R{room.price_per_night}
                            </Text>
                            <Text variant="p">per night</Text>
                        </td>

                        <td>
                            <button
                                type="button"
                                className={styles.bookButton}
                                onClick={() =>
                                    console.log("Selected room:", room.id)
                                }
                            >
                                Book Now
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)} </div>)}


.details {
    padding: 24px;
}

.gallery {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    margin: 20px 0;
}

.gallery img {
    width: 300px;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
}

.room {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding: 20px;
    margin-bottom: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.roomPrice {
    text-align: right;
    min-width: 150px;
}


.tableContainer {
    width: 100%;
    overflow-x: auto;
    margin-top: 20px;
}

.roomTable {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
}

.roomTable th,
.roomTable td {
    padding: 16px;
    border: 1px solid #ddd;
    vertical-align: top;
}

.roomTable th {
    background-color: #f2f5f5;
}

.roomTable td:first-child {
    min-width: 220px;
}

.roomTable td:last-child {
    white-space: nowrap;
}


