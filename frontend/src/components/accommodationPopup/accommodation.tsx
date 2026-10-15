import { Text } from "../Text/text";
import { Button } from "../button/button";

interface AccommodationPopupProps {
    onClose: () => void;
}

export const AccommodationPopup = ({
    onClose
}: AccommodationPopupProps) => {

return (
    <div>
        <Text variant="h2">New Accommodation</Text>

        <form>
            <label htmlFor="name">Accommodation Name</label>
            <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter accommodation name"
                required
            />

            <label htmlFor="description">Description</label>
            <textarea
                id="description"
                name="description"
                placeholder="Describe the accommodation"
                required
            />

            <label htmlFor="address">Address</label>
            <input
                id="address"
                name="address"
                type="text"
                placeholder="Enter street address"
                required
            />

            <label htmlFor="city">City</label>
            <input
                id="city"
                name="city"
                type="text"
                placeholder="Enter city"
                required
            />

            <label htmlFor="country">Country</label>
            <input
                id="country"
                name="country"
                type="text"
                placeholder="Enter country"
                required
            />

            <label htmlFor="star_rating">Star Rating</label>
            <select id="star_rating" name="star_rating" defaultValue="">
                <option value="">No rating</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
            </select>

            <Button label="Save Accommodation" type="submit" />

            <Button
                label="Close"
                onClick={onClose}
                type="button"
            />
        </form>
    </div>
);

}