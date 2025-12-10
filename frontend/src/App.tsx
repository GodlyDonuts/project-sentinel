import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { CRTOverlay } from './components/layout/CRTOverlay';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <CRTOverlay />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
