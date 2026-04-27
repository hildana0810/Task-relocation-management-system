import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../../components/AdminSidebar';
import api from '../../../utils/api';

function VerifyRequest() {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [user, setUser] = useState(null);
  const [taxCollectors, setTaxCollectors] = useState([]);
  const [selectedTaxCollector, setSelectedTaxCollector] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    if (requestId) {
      fetchRequest();
      fetchTaxCollectors();
    }
  }, [requestId]);

  useEffect(() => {
    if (request?.user_id) {
      fetchUser(request.user_id);
    }
  }, [request?.user_id]);

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');

    if (!token || role !== 'admin') {
      navigate('/admin/login');
    }
  };

  const fetchRequest = async () => {
    try {
      const response = await api.get(`/admin/relocation-requests/${requestId}`);
      console.log('Request data:', response.data);
      console.log('User ID in request:', response.data?.user_id);
      setRequest(response.data);
    } catch (error) {
      console.error('Error fetching request:', error);
      setRequest(null);
    }
  };

  const fetchUser = async (userId) => {
    // Skip API call and use user data directly from request
    console.log('Using user data from request instead of API call');
    setUser({
      id: userId,
      name: request?.contact_person || 'Unknown User',
      email: request?.contact_email || 'No email',
      phone: request?.contact_phone || 'No phone'
    });
  };

  const fetchTaxCollectors = async () => {
    try {
      const response = await api.get('/admin/tax-collectors');
      setTaxCollectors(response.data.filter(tc => tc.status === 'active'));
    } catch (error) {
      console.error('Error fetching tax collectors:', error);
      // Set dummy data for demo
      setTaxCollectors([
        { id: 1, name: 'Michael Johnson', region: 'Dar es Salaam', status: 'active' },
        { id: 2, name: 'Sarah Williams', region: 'Arusha', status: 'active' },
        { id: 3, name: 'David Brown', region: 'Mwanza', status: 'active' },
        { id: 4, name: 'Emily Davis', region: 'Dodoma', status: 'active' }
      ]);
    }
  };

  useEffect(() => {
    if (request && (user || !request.user_id)) {
      setLoading(false);
    }
  }, [request, user]);

  const handleApproveRequest = async () => {
    if (!selectedTaxCollector) {
      setMessage('Please select a tax collector');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      await api.post(`/admin/relocation-requests/${requestId}/approve`, {
        tax_collector_id: selectedTaxCollector
      });

      setMessage('Request approved successfully!');
      setTimeout(() => {
        navigate('/admin/relocation-requests');
      }, 2000);
    } catch (error) {
      console.error('Error approving request:', error);
      setMessage('Error approving request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!window.confirm('Are you sure you want to reject this request?')) {
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      await api.post(`/admin/relocation-requests/${requestId}/reject`);
      setMessage('Request rejected successfully!');
      setTimeout(() => {
        navigate('/admin/relocation-requests');
      }, 2000);
    } catch (error) {
      console.error('Error rejecting request:', error);
      setMessage('Error rejecting request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Request not found</p>
          <button
            onClick={() => navigate('/admin/relocation-requests')}
            className="mt-4 text-red-600 hover:underline"
          >
            Back to Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Verify Request</h1>
            <p className="text-gray-600">Review and approve relocation request</p>
          </div>
          <button
            onClick={() => navigate('/admin/relocation-requests')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Requests
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              User Details
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="font-medium text-gray-800">{user?.name || request.contact_person}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium text-gray-800">{user?.email || request.contact_email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p className="font-medium text-gray-800">{user?.phone || request.contact_phone}</p>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Business Details
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Business Name</label>
                <p className="font-medium text-gray-800">{request.business_name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Business Type</label>
                <p className="font-medium text-gray-800">{request.business_type}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">License Number</label>
                <p className="font-medium text-gray-800">{request.business_license}</p>
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Address Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Current Address</label>
                <p className="font-medium text-gray-800">{request.old_address}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">New Address</label>
                <p className="font-medium text-gray-800">{request.new_address}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Relocation Reason</label>
                <p className="font-medium text-gray-800">{request.relocation_reason}</p>
              </div>
            </div>
          </div>

          {/* Tax Collector Assignment */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Assign Tax Collector
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Tax Collector
                </label>
                <select
                  value={selectedTaxCollector}
                  onChange={(e) => setSelectedTaxCollector(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Choose a tax collector...</option>
                  {taxCollectors.map((tc) => (
                    <option key={tc.id} value={tc.id}>
                      {tc.name} - {tc.region}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleApproveRequest}
                  disabled={submitting || !selectedTaxCollector}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Processing...' : 'Approve Request'}
                </button>
                <button
                  onClick={handleRejectRequest}
                  disabled={submitting}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Processing...' : 'Reject Request'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Supporting Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {request.documents?.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{doc.name}</p>
                    <p className="text-sm text-gray-500">PDF Document</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View
                </button>
              </div>
            )) || (
                <div className="col-span-2 text-center text-gray-500 py-4">
                  No documents uploaded
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyRequest;
