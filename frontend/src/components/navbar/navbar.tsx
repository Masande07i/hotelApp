import style from './navbar.module.css';
import { Text } from '../Text/text';
import { Button } from '../button/button';
import { CiHome } from "react-icons/ci";
import { useNavigate } from 'react-router-dom'

export const navbar = () => {
    const navigate = useNavigate()

    const handleStart = () => {
        navigate('/login')
    }

    const handleSign = () => {
        navigate('/signup')
    }
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
      <Button label="LOGIN" type="button"onClick={handleStart}/>
      <Button label="SIGN UP" type="button"onClick={handleSign}/>
  </div>
</nav>


);
};
