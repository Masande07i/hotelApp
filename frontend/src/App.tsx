import './App.css'
import { landing as Landing } from './pages/landing/landing'
import { login as Login } from './pages/login/login'
import { signup as Signup } from './pages/signup/signup'
import { Routes, Route } from 'react-router-dom'
function App() {


  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
      </Routes>
    
    </div>
  )
}

export default App
