import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Loginsignup from './components/Loginsignup/Loginsignup'
import Homepage from './components/Homepage/Homepage';
import Profile from './Pages/profile';
import SearchPage from './Pages/SearchPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loginsignup />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  )
}

export default App
