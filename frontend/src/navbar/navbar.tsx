import style from './navbar.module.css'
import { Text } from '../components/Text/text'
import { Button } from '../components/button/button'
import { CiHome } from 'react-icons/ci'

export const navbar = () => {
  return (
   <nav>
    <div className= {style.logo}>
    <CiHome />
    <Text variant="h2">Havenly</Text>
    </div>
    <div>
        <Text variant='h3'>Home</Text>
        </div>
        <div className={style.actions}>
        <Button label ="Login"></Button>
        <Button label ="Sign up"></Button>
        </div>
    


   </nav>
  )
}
