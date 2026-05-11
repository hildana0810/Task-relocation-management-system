import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from '../pages/auth/Register/Register';
import Login from '../pages/auth/login/Login';
import Payerdashboard from '../pages/dashboard/payer/Payerdashboard';
import TaxCollectorDashboard from '../pages/dashboard/taxcollector/TaxCollectorDashboard';
import AdminDashboard from '../pages/dashboard/admin/AdminDashboard';
import RelocationRequests from '../pages/dashboard/admin/components/RelocationRequests';
import VerifyRequest from '../pages/dashboard/admin/components/VerifyRequest';
import AssignTaxCollector from '../pages/dashboard/admin/components/AssignTaxCollector';
import TaxCollectors from '../pages/dashboard/admin/components/TaxCollectors';
import Users from '../pages/dashboard/admin/components/Users';
import AllUsers from '../pages/dashboard/admin/components/AllUsers';

// central routing component for the application
export default function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />} />
        <Route
          path="/login"
          element={<Login />} />
        <Route
          path="/register"
          element={<Register />} />
        <Route
          path="/payerdashboard"
          element={<Payerdashboard />} />
        <Route
          path="/tax-collector-dashboard"
          element={<TaxCollectorDashboard />} />
        <Route
          path="/tax-collector-dashboard/taxpayers"
          element={<TaxCollectorDashboard />} />
        <Route
          path="/tax-collector-dashboard/notifications"
          element={<TaxCollectorDashboard />} />
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
          path="/admin/assign-tax-collector"
          element={<AssignTaxCollector />} />
        <Route
          path="/admin/assign-tax-collector/:requestId"
          element={<AssignTaxCollector />} />
        <Route
          path="/admin/tax-collectors"
          element={<TaxCollectors />} />
        <Route
          path="/admin/users"
          element={<Users />} />
        <Route
          path="/admin/all-users"
          element={<AllUsers />} />
      </Routes>
    </BrowserRouter>
  );
}
