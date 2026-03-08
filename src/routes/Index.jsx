import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from '../pages/auth/Register/Register';
import Login from '../pages/auth/login/Login';
import Payerdashboard from '../pages/dashboard/payer/Payerdashboard';
import TaxCollectorLogin from '../pages/auth/TaxCollectorLogin';
import TaxCollectorDashboard from '../pages/dashboard/taxCollector/TaxCollectorDashboard';
import AdminLogin from '../pages/auth/AdminLogin';
import AdminDashboard from '../pages/dashboard/admin/AdminDashboard';
import RelocationRequests from '../pages/dashboard/admin/RelocationRequests';
import VerifyRequest from '../pages/dashboard/admin/VerifyRequest';
import AssignTaxCollector from '../pages/dashboard/admin/AssignTaxCollector';
import TaxCollectors from '../pages/dashboard/admin/TaxCollectors';
import Users from '../pages/dashboard/admin/Users';

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
        <Route 
        path="/tax_collector_login" 
        element={<TaxCollectorLogin />} />
        <Route 
        path="/tax-collector-dashboard" 
        element={<TaxCollectorDashboard />} />
        <Route 
        path="/admin/login" 
        element={<AdminLogin />} />
        <Route 
        path="/admin/dashboard" 
        element={<AdminDashboard />} />
        <Route 
        path="/admin/relocation-requests" 
        element={<RelocationRequests />} />
        <Route 
        path="/admin/verify-request/:requestId" 
        element={<VerifyRequest />} />
        <Route 
        path="/admin/assign-tax-collector/:requestId" 
        element={<AssignTaxCollector />} />
        <Route 
        path="/admin/tax-collectors" 
        element={<TaxCollectors />} />
        <Route 
        path="/admin/users" 
        element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}
