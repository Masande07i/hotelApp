import './App.css'
import { landing as Landing } from './pages/landing/landing'
import { login as Login } from './pages/login/login'
import { signup as Signup } from './pages/signup/signup'
import { accomodations as Accomodations } from "./pages/customer/accomodations"
import { adminDashboard as AdminDashboard } from "./pages/adminDashboard/adminDashboard"
import { AdminAccommodations } from "./pages/admin/adminAccommodations"
import { ProtectedAdminRoute } from "./components/protectedAdminRoutes/protectedAdminRoute"
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/accomodations" element={<Accomodations />} />

        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/accommodations"element={<AdminAccommodations />}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App
