import './App.css'
import { landing as Landing } from './pages/landing/landing'
import { login as Login } from './pages/login/login'
import { signup as Signup } from './pages/signup/signup'
import { accomodations as Accomodations } from "./pages/CUSTOMER/customerAccommodation/accomodations"
import { adminDashboard as AdminDashboard } from "./pages/ADMIN/adminDashboard/adminDashboard"
import { AdminAccommodations } from "./pages/ADMIN/adminAccommodation/adminAccommodations"
import { ProtectedAdminRoute } from "./components/protectedAdminRoutes/protectedAdminRoute"
import { AccommodationDetails } from "./pages/CUSTOMER/accommodationDetails/accommodationDetails";
import { AdminDetails } from './pages/ADMIN/adminADetails/adminDetails'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/accomodations" element={<Accomodations />} />
        <Route path="/accommodations/:id"element={<AccommodationDetails />}/>

        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/accommodations"element={<AdminAccommodations />}/>
          <Route path="/admin/accommodations/:id"element={<AdminDetails/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App
