
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import styles from "./map.module.css";

interface MapProps {
    latitude: number;
    longitude: number;
    name: string;
}

export const AccommodationMap = ({ latitude, longitude, name }: MapProps) => {
    return (
        <MapContainer
            center={[latitude, longitude]}
            zoom={13}
            scrollWheelZoom={false}
            className={styles.map}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[latitude, longitude]}>
                <Popup>{name}</Popup>
            </Marker>
        </MapContainer>
    );
};
