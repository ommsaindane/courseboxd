import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Loginsignup from './components/Loginsignup/Loginsignup'
import Homepage from './components/Homepage/Homepage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loginsignup />} />
        <Route path="/home" element={<Homepage />} />
      </Routes>
    </Router>
  )
}

export default App
