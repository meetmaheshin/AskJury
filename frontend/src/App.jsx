import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CaseDetail from './pages/CaseDetail';
import SubmitCase from './pages/SubmitCase';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black pb-16 md:pb-0">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/case/:id" element={<CaseDetail />} />
            <Route path="/submit" element={<SubmitCase />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Routes>
          <MobileNav />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
