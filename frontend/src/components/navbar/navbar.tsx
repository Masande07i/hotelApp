
import style from './navbar.module.css';
import { Text } from '../Text/text';
import { Button } from '../button/button';
import { CiHome, CiUser } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

interface NavbarProps {
    className?: string;
}

export const navbar = ({ className }: NavbarProps) => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleStart = () => {
        navigate('/login');
    };

    const handleSign = () => {
        navigate('/signup');
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    return (
        <nav className={`${style.navbar} ${className || ""}`}>
            <div className={style.logo}>
                <CiHome className={style.logoIcon} />
                <Text variant="h2">Havenly</Text>
            </div>

            <div className={style.links}>
                <a href="/">Home</a>
                <a href="/accomodations">Hotels</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
            </div>

            <div className={style.actions}>
                {user ? (
                    <button
                        type="button"
                        className={style.profileButton}
                        onClick={handleProfile}
                        aria-label="My Profile"
                        title="My Profile"
                    >
                        <CiUser />
                    </button>
                ) : (
                    <>
                        <Button label="LOGIN" type="button" onClick={handleStart} />
                        <Button label="SIGN UP" type="button" onClick={handleSign} />
                    </>
                )}
            </div>
        </nav>
    );
};
