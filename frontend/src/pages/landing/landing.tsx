import { hero as Hero } from "../../components/hero/hero"
import style from "./landing.module.css"
import { navbar as Navbar } from "../../components/navbar/navbar";
import { popularAccommodations as PopularAccommodations } from "../../components/popularAccommodations/popularAccommodations";
import { Footer } from "../../components/footer/footer";

export const landing = () => {
  return (
    <div className={style.body} >
        <Navbar/>
        <Hero/>
        <PopularAccommodations/>
          <Footer />
        
    </div>
  )
}
