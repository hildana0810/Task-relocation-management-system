import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../../../components/AdminSidebar';
import api from '../../../../utils/api';

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

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');

    if (!token || role !== 'admin') {
      navigate('/admin/login');
    }
  }, [navigate]);

  const fetchRequest = useCallback(async () => {
    try {
      const response = await api.get(`/admin/relocation-requests/${requestId}`);
      console.log('Request data:', response.data);
      setRequest(response.data);
      
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        // Fallback to contact info if user relation is missing
        setUser({
          id: response.data.user_id,
          name: response.data.contact_person || 'Unknown User',
          email: response.data.contact_email || 'No email',
          phone: response.data.contact_phone || 'No phone'
        });
      }
    } catch (error) {
      console.error('Error fetching request:', error);
      setRequest(null);
    }
  }, [requestId]);

  const fetchTaxCollectors = useCallback(async () => {
    try {
      const response = await api.get('/admin/tax-collectors');
      setTaxCollectors(response.data);
    } catch (error) {
      console.error('Error fetching tax collectors:', error);
      setTaxCollectors([
        { id: 1, name: 'Michael Johnson', region: 'Dar es Salaam' },
        { id: 2, name: 'Sarah Williams', region: 'Arusha' },
        { id: 3, name: 'David Brown', region: 'Mwanza' },
        { id: 4, name: 'Emily Davis', region: 'Dodoma' }
      ]);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    if (requestId) {
      fetchRequest();
      fetchTaxCollectors();
    }
  }, [requestId, checkAuth, fetchRequest, fetchTaxCollectors]);

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

      setMessage('success: Request approved successfully!');
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
      setMessage('success: Request rejected successfully!');
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
            {message.replace('success: ', '')}
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
                <label className="text-sm text-gray-500">TIN Number</label>
                <p className="font-medium text-gray-800">{request.tin_number}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Relocation Date</label>
                <p className="font-medium text-gray-800">{request.relocation_date}</p>
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
                <p className="font-medium text-gray-800">{request.current_address}</p>
                <p className="text-xs text-gray-500">Postcode: {request.current_postcode}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">New Address</label>
                <p className="font-medium text-gray-800">{request.new_address}</p>
                <p className="text-xs text-gray-500">Postcode: {request.new_postcode}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Reason for Relocation</label>
                <p className="font-medium text-gray-800">{request.reason_for_relocation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md border-t-4 border-red-600">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Review Action
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign Tax Collector
              </label>
              <select
                value={selectedTaxCollector}
                onChange={(e) => setSelectedTaxCollector(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                disabled={submitting || request.status !== 'pending'}
              >
                <option value="">Select a tax collector</option>
                {taxCollectors.map((tc) => (
                  <option key={tc.id} value={tc.id}>
                    {tc.name} ({tc.region})
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-500">
                A tax collector must be assigned to verify the new business location.
              </p>
            </div>

            <div className="flex items-end space-x-4">
              <button
                onClick={handleApproveRequest}
                disabled={submitting || !selectedTaxCollector || request.status !== 'pending'}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400 transition duration-200"
              >
                {submitting ? 'Processing...' : 'Approve & Assign'}
              </button>
              <button
                onClick={handleRejectRequest}
                disabled={submitting || request.status !== 'pending'}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-700 disabled:bg-gray-400 transition duration-200"
              >
                {submitting ? 'Processing...' : 'Reject Request'}
              </button>
            </div>
          </div>
          
          {request.status !== 'pending' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700">
                This request has already been <span className={`uppercase font-bold ${request.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>{request.status}</span>.
              </p>
              {request.status === 'approved' && request.tax_collector && (
                <p className="text-xs text-gray-500 mt-1">
                  Assigned to: {request.tax_collector.name}
                </p>
              )}
            </div>
          )}
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
