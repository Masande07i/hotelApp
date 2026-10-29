
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
    fetchAccommodations,
    openAccommodationForm,
    closeAccommodationForm,
    updateAccommodationInputs
} from "../../../features/accomodationSlice";
import { Button } from "../../../components/button/button";
import styles from "./adminAccommodations.module.css"
import { AccommodationCard } from "../../../components/accomodationCard/accomodationCard";
import { AccommodationPopup } from "../../../components/Popup/accommodationPopup";
import { AdminSidebar } from "../../../components/adminSidebar/adminSidebar";

export const AdminAccommodations = () => {
    const dispatch = useDispatch<AppDispatch>();

    const {
        accommodations,
        loading,
        error,
        showForm
    } = useSelector((state: RootState) => state.accommodation);

    useEffect(() => {
        dispatch(fetchAccommodations());
    }, [dispatch]);

    const handleAddAccommodation = () => {
        dispatch(updateAccommodationInputs({
            name: "",
            description: "",
            address: "",
            city: "",
            country: "",
            star_rating: ""
        }));

        dispatch(openAccommodationForm());
    };

    if (loading) return <p>Loading accommodations...</p>;
    if (error) return <p>{error}</p>;

    return (
    <div className={styles.adminLayout}>
        <AdminSidebar />

        <div className={styles.mainArea}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Accommodations</h1>

                    <Button
                        label="+ Add Accommodation"
                        onClick={handleAddAccommodation}
                        type="button"
                        className={styles.addButton}
                    />
                </div>

                {showForm && (
                    <AccommodationPopup
                        onClose={() => dispatch(closeAccommodationForm())}
                    />
                )}

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Accommodation Name</th>
                                <th>Location</th>
                                <th>Rating</th>
                                <th>Rooms</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {accommodations.map((accommodation) => (
                                <AccommodationCard
                                    key={accommodation.id}
                                    {...accommodation}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);
};
