import style from './navbar.module.css';
import { Text } from '../Text/text';
import { Button } from '../button/button';
import { CiHome } from "react-icons/ci";

export const navbar = () => {
return (
   <nav className={style.navbar}> 
   <div className={style.logo}>
     <CiHome  className={style.logoIcon} /> 
     <Text variant="h2">Havenly</Text> </div>


  <div className={style.links}>
    <a href="/">Home</a>
    <a href="/hotels">Hotels</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </div>

  <div className={style.actions}>
    <Button label="Login" />
    <Button label="Sign Up" />
  </div>
</nav>


);
};
