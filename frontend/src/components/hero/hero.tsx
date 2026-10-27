import styles from "./hero.module.css"
import { navbar as Navbar } from "../navbar/navbar"


export const hero = () => {
  return (
    <>
        <div className={styles.hero}>
            <Navbar/>
            <div className={styles.heroContent}>
              <h3>YOUR NEXT GATEAWAY AWAITS</h3>
              <h1>Find Your Perfect Place To Stay</h1>
              <p>Discover amazing hotels from luxury resorts to cosy getaways</p>
          </div>
        </div>
   
    </>
  )
}
