import './App.css'
import { landing as Landing } from './pages/landing/landing'
import { login as Login } from './pages/login/login'
import { signup as Signup } from './pages/signup/signup'
import { accomodations as Accomodations} from "./pages/accomodations/accomodations"
import { adminDashboard as AdminDashboard } from "./pages/adminDashboard/adminDashboard";
import { Routes, Route } from 'react-router-dom'
function App() {


  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/accomodations" element= {<Accomodations/>}/>
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    
    </div>
  )
}

export default App
