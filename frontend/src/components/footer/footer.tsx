import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope, FaPhone } from "react-icons/fa";
import { Text } from "../Text/text";
import styles from "./footer.module.css";

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>

                <div className={styles.brand}>
                    <Text variant="h2">Havenly</Text>
                    <Text variant="p">
                        Find your perfect stay and experience comfort,
                        style, and unforgettable hospitality.
                    </Text>

                    <div className={styles.socials}>
                        <a href="#" aria-label="Facebook">
                            <FaFacebookF />
                        </a>

                        <a href="#" aria-label="Instagram">
                            <FaInstagram />
                        </a>

                        <a href="#" aria-label="Twitter">
                            <FaTwitter />
                        </a>
                    </div>
                </div>

                <div className={styles.links}>
                    <Text variant="h2">Quick Links</Text>

                    <a href="/">Home</a>
                    <a href="/accommodations">Accommodations</a>
                    <a href="/bookings">My Bookings</a>
                    <a href="/favourites">Favourites</a>
                </div>

                <div className={styles.links}>
                    <Text variant="h2">Support</Text>

                    <a href="#">About Us</a>
                    <a href="#">Contact Us</a>
                    <a href="#">Help Centre</a>
                    <a href="#">Privacy Policy</a>
                </div>

                <div className={styles.contact}>
                    <Text variant="h2">Contact Us</Text>

                    <div>
                        <FaEnvelope />
                        <span>support@havenly.com</span>
                    </div>

                    <div>
                        <FaPhone />
                        <span>+27 31 123 4567</span>
                    </div>
                </div>

            </div>

            <div className={styles.bottom}>
                <p>© 2026 Havenly. All rights reserved.</p>
                <p>Made for better stays.</p>
            </div>
        </footer>
    );
};