import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from '../pages/auth/Register/Register';
import Login from '../pages/auth/login/Login';
import Payerdashboard from '../pages/dashboard/payer/Payerdashboard';

// central routing component for the application
export default function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
        path="/" 
        element={<Register />} />
        <Route 
        path="/login" 
        element={<Login />} />
        <Route 
        path="/payerdashboard" 
        element={<Payerdashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
