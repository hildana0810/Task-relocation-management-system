import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../../components/AdminSidebar';
import api from '../../../utils/api';

function AssignTaxCollector() {
  const { requestId } = useParams();
  const [requests, setRequests] = useState([]);
  const [taxCollectors, setTaxCollectors] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedTaxCollector, setSelectedTaxCollector] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchPendingRequests();
    fetchTaxCollectors();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');
    
    if (!token || role !== 'admin') {
      navigate('/admin/login');
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await api.get('/admin/relocation-requests');
      const pendingRequests = response.data.filter(req => req.status === 'pending');
      setRequests(pendingRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      // Set dummy data for demo
      setRequests([
        {
          id: 1,
          user_name: 'John Doe',
          business_name: 'John Electronics',
          new_address: '456 New Road, Arusha',
          status: 'pending'
        },
        {
          id: 3,
          user_name: 'Robert Brown',
          business_name: 'Brown Restaurant',
          new_address: '999 Maple Dr, Mbeya',
          status: 'pending'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaxCollectors = async () => {
    try {
      const response = await api.get('/admin/tax-collectors');
      setTaxCollectors(response.data);
    } catch (error) {
      console.error('Error fetching tax collectors:', error);
      // Set dummy data for demo
      setTaxCollectors([
        { id: 1, name: 'Michael Johnson', region: 'Dar es Salaam' },
        { id: 2, name: 'Sarah Williams', region: 'Arusha' },
        { id: 3, name: 'David Brown', region: 'Mwanza' },
        { id: 4, name: 'Emily Davis', region: 'Dodoma' }
      ]);
    }
  };

  const handleAssignTaxCollector = async () => {
    if (!selectedRequest || !selectedTaxCollector) {
      setMessage('Please select both a request and tax collector');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      await api.post(`/admin/relocation-requests/${selectedRequest.id}/approve`, {
        tax_collector_id: selectedTaxCollector
      });
      
      setMessage('Tax collector assigned successfully!');
      setTimeout(() => {
        navigate('/admin/relocation-requests');
      }, 1500);
    } catch (error) {
      console.error('Error assigning tax collector:', error);
      setMessage('Error assigning tax collector. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assignment data...</p>
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
            <h1 className="text-3xl font-bold text-gray-800">Assign Tax Collector</h1>
            <p className="text-gray-600">Assign tax collectors to pending relocation requests</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Requests */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Pending Requests</h2>
            <div className="space-y-3">
              {requests.map((request) => (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedRequest?.id === request.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{request.user_name}</p>
                      <p className="text-sm text-gray-600">{request.business_name}</p>
                      <p className="text-sm text-gray-500">{request.new_address}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      selectedRequest?.id === request.id ? 'bg-red-500' : 'bg-gray-300'
                    }`}></div>
                  </div>
                </div>
              ))}
              
              {requests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No pending requests to assign
                </div>
              )}
            </div>
          </div>

          {/* Tax Collector Selection */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Tax Collector</h2>
            
            {selectedRequest ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Selected Request</h3>
                  <p className="text-sm text-gray-600"><strong>User:</strong> {selectedRequest.user_name}</p>
                  <p className="text-sm text-gray-600"><strong>Business:</strong> {selectedRequest.business_name}</p>
                  <p className="text-sm text-gray-600"><strong>New Address:</strong> {selectedRequest.new_address}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign Tax Collector
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

                <button
                  onClick={handleAssignTaxCollector}
                  disabled={submitting}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Assigning...' : 'Assign Tax Collector'}
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2zm-2 8a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="mt-2">Select a request from the left to assign a tax collector</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignTaxCollector;
