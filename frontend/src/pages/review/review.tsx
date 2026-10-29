import { Text } from "../../components/Text/text";
import style from "./review.module.css"


export const Reviews = () => {
    return (
        <div className={style.reviews}>
            <Text variant="h1">Customer Reviews</Text>
        </div>
    );
};