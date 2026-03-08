import React, { useState, useEffect } from 'react';

function SimpleTaxpayerDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formData, setFormData] = useState({
    businessName: '',
    tinNumber: '',
    newAddress: '',
    reason: ''
  });

  useEffect(() => {
    // Load user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData(prev => ({
        ...prev,
        businessName: user.business_name || user.name || '',
        tinNumber: user.tinnumber || ''
      }));
    }

    // Mock requests data
    setRequests([
      { id: '001', newAddress: 'Arusha – Njiro', status: 'Pending', stage: 'Tax Collector Verification' },
      { id: '002', newAddress: 'Arusha – Sakina', status: 'Approved', stage: 'Completed' }
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    const newRequest = {
      id: `00${requests.length + 1}`,
      newAddress: formData.newAddress,
      status: 'Pending',
      stage: 'Submitted'
    };
    setRequests([newRequest, ...requests]);
    setShowForm(false);
    setFormData(prev => ({ ...prev, newAddress: '', reason: '' }));
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return styles[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getProgressStage = (stage) => {
    const stages = {
      'Submitted': 1,
      'Tax Collector Verification': 2,
      'Admin Approval': 3,
      'Completed': 4
    };
    return stages[stage] || 1;
  };

  const renderContent = () => {
    if (activeSection === 'dashboard') {
      return (
        <div className="bg-white border rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Welcome to Taxpayer Dashboard</h2>
          <button 
            onClick={() => setShowForm(true)}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 mb-4"
          >
            ➕ Submit Relocation Request
          </button>
          <button 
            onClick={() => setActiveSection('requests')}
            className="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700"
          >
            📋 View My Requests
          </button>
        </div>
      );
    }

    if (activeSection === 'submit') {
      return (
        <div className="bg-white border rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Submit Relocation Request</h2>
          <button 
            onClick={() => setShowForm(true)}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
          >
            ➕ Submit New Relocation Request
          </button>
        </div>
      );
    }

    if (activeSection === 'requests') {
      return (
        <div className="bg-white border rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">My Requests</h2>
          
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Request ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">New Address</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="border border-gray-300 px-4 py-2">{request.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{request.newAddress}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button 
                      onClick={() => setSelectedRequest(request)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedRequest && (
            <div className="mt-6 border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Request Status - {selectedRequest.id}</h3>
              <div className="space-y-2">
                {['Submitted', 'Tax Collector Verification', 'Admin Approval', 'Completed'].map((stage, index) => (
                  <div key={stage} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      getProgressStage(selectedRequest.stage) >= index + 1 
                        ? 'bg-blue-600' 
                        : 'bg-gray-300'
                    }`}></div>
                    <span className={getProgressStage(selectedRequest.stage) >= index + 1 ? 'font-medium' : 'text-gray-500'}>
                      {stage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Simple Sidebar */}
      <div className="w-56 bg-gray-800">
        <div className="p-4">
          <h1 className="text-lg font-bold text-white">👤 Taxpayer</h1>
        </div>
        <nav className="mt-4">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`w-full text-left px-4 py-3 ${
              activeSection === 'dashboard' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveSection('submit')}
            className={`w-full text-left px-4 py-3 ${
              activeSection === 'submit' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Submit Request
          </button>
          <button
            onClick={() => setActiveSection('requests')}
            className={`w-full text-left px-4 py-3 ${
              activeSection === 'requests' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            My Requests
          </button>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-red-400 hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </div>

      {/* Simple Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Submit Relocation Request</h3>
            <form onSubmit={handleSubmitRequest}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Business Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">TIN Number</label>
                <input
                  type="text"
                  value={formData.tinNumber}
                  onChange={(e) => setFormData({...formData, tinNumber: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">New Address / Postcode</label>
                <input
                  type="text"
                  value={formData.newAddress}
                  onChange={(e) => setFormData({...formData, newAddress: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Reason for relocation</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SimpleTaxpayerDashboard;
