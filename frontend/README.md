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

//details
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


//bookings

.bookingPage {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px;
    color: #1e3838;
}

.bookingPage > h1 {
    margin: 20px 0 8px;
}

.backButton {
    border: none;
    background: transparent;
    color: #176b66;
    cursor: pointer;
    font-size: 15px;
    margin-bottom: 10px;
}

.bookingLayout {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(300px, 1fr);
    gap: 28px;
    margin-top: 28px;
    align-items: start;
}

.bookingForm,
.bookingSummary {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.section,
.bookingSummary {
    background: #fff;
    border: 1px solid #e2eaea;
    border-radius: 12px;
    padding: 24px;
}

.section h2,
.bookingSummary h2 {
    margin: 0 0 20px;
    font-size: 21px;
}

.section label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #405858;
    font-size: 14px;
    margin-bottom: 18px;
}

.dateFields,
.guestFields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
}

.dateFields label,
.guestFields label {
    min-width: 0;
}

.section input {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    padding: 12px;
    border: 1px solid #d7e2e2;
    border-radius: 7px;
    outline: none;
    font: inherit;
    color: #243b3b;
}

.section input:focus {
    border-color: #087f76;
}

.hotelInfo {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    padding-bottom: 20px;
    border-bottom: 1px solid #e5eeee;
}

.hotelPlaceholder {
    width: 105px;
    min-width: 105px;
    height: 100px;
    border-radius: 9px;
    background: #eaf2f1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 35px;
}

.hotelInfo h2 {
    margin-bottom: 8px;
    font-size: 17px;
}

.hotelInfo p {
    color: #718181;
    font-size: 13px;
    margin: 5px 0;
}

.priceRow,
.totalRow {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    font-size: 14px;
}

.priceRow {
    margin-top: 4px;
}

.totalRow {
    border-top: 1px solid #e2eaea;
    padding-top: 18px;
    font-size: 16px;
}

.continueButton {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 8px;
    background: #075b56;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
}

.continueButton:hover {
    background: #08756d;
}

.bookingSummary > p {
    color: #758585;
    font-size: 12px;
    text-align: center;
}

@media (max-width: 750px) {
    .bookingPage {
        padding: 20px 14px;
    }

    .bookingLayout {
        grid-template-columns: 1fr;
    }

    .dateFields,
    .guestFields {
        gap: 10px;
    }

    .section,
    .bookingSummary {
        padding: 18px;
    }
}

//used this to store thr token to the local storage
const savedAuth = localStorage.getItem("auth")

const preloadedAuth = savedAuth
  ? {
      auth: {
        ...authReducer(undefined, { type: "INIT" }),
        ...JSON.parse(savedAuth)
      }
    }
  : undefined
  