import { hero as Hero } from "../../components/hero/hero"
import style from "./landing.module.css"
import { navbar as Navbar } from "../../components/navbar/navbar";
import { popularAccommodations as PopularAccommodations } from "../../components/popularAccommodations/popularAccommodations";

export const landing = () => {
  return (
    <div className={style.body} >
        <Navbar/>
        <Hero/>
        <PopularAccommodations/>
        
    </div>
  )
}
