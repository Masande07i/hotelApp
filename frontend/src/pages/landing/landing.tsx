import { hero as Hero } from "../../components/hero/hero"
import { navbar as Navbar } from "../../components/navbar/navbar";
import { popularAccommodations as PopularAccommodations } from "../../components/popularAccommodations/popularAccommodations";

export const landing = () => {
  return (
    <div >
        <Navbar/>
        <Hero/>
        <PopularAccommodations/>
        
    </div>
  )
}
