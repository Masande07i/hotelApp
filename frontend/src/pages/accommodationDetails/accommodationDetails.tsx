import { useParams } from "react-router-dom";

export const AccommodationDetails = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div>
            <h1>Accommodation Details</h1>
            <p>Accommodation ID: {id}</p>
        </div>
    );
};
