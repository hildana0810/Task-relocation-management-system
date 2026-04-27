import React, { useState, useEffect } from 'react';
import RelocationRequestForm from '../../../components/RelocationRequestForm';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';


function Payerdashboard() {
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [userData, setUserData] = useState({
    businessName: "John Enterprises",
    tinNumber: "TIN-123456789",
    currentAddress: "123 Main Street, Nairobi, 00100",
    accountStatus: "Active",
    complianceStatus: "Compliant",
    phoneNumber: "+254 712 345 678",
    email: "john@enterprises.com"
  });

  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your relocation request has been assigned to Tax Collector.", time: "2 hours ago", read: false },
    { id: 2, message: "Field visit scheduled for 12 March.", time: "1 day ago", read: false },
    { id: 3, message: "Your relocation request has been approved.", time: "3 days ago", read: true }
  ]);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserData({
          businessName: user.name || "John Enterprises",
          tinNumber: user.tinnumber || "TIN-123456789",
          currentAddress: user.location || "123 Main Street, Nairobi, 00100",
          accountStatus: user.accountStatus || "Active",
          complianceStatus: user.complianceStatus || "Compliant",
          phoneNumber: user.phone || "+254 712 345 678",
          email: user.email || "john@enterprises.com"
        });
        // Clear any existing localStorage request data
        localStorage.removeItem('userStats');
        localStorage.removeItem('userRequests');

        // Fetch real data from database
        fetchUserRequests();
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      // If no user data, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  // Fetch user requests from database
  const fetchUserRequests = async () => {
    try {
      const response = await api.get('/relocation-requests');
      const userRequests = response.data;
      setRequests(userRequests);

      // Calculate stats from real data
      const calculatedStats = {
        totalRequests: userRequests.length,
        pendingRequests: userRequests.filter(r => r.status === 'pending').length,
        approvedRequests: userRequests.filter(r => r.status === 'approved').length,
        rejectedRequests: userRequests.filter(r => r.status === 'rejected').length,
        underVerification: userRequests.filter(r => r.status === 'under_review').length
      };
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error fetching user requests:', error);
      setRequests([]);
      setStats({
        totalRequests: 0,
        pendingRequests: 0,
        approvedRequests: 0,
        rejectedRequests: 0,
        underVerification: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Refresh dashboard data
  const refreshDashboard = () => {
    setLastRefresh(new Date());
    // Here you would typically fetch fresh data from your API
    console.log('Dashboard refreshed at:', new Date());
  };

  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    underVerification: 0
  });

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      under_review: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const getComplianceBadge = (status) => {
    const styles = {
      "Compliant": "bg-green-100 text-green-800",
      "Pending Audit": "bg-yellow-100 text-yellow-800",
      "Under Investigation": "bg-red-100 text-red-800"
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const getProgressPercentage = (status) => {
    const stages = {
      "pending": 20,
      "under_review": 40,
      "approved": 80,
      "completed": 100
    };
    return stages[status] || 0;
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleRelocationSubmit = (response) => {
    console.log('Relocation request submitted:', response);

    // Refresh the requests list to get the latest data from database
    fetchUserRequests();

    // Add notification
    const newNotification = {
      id: notifications.length + 1,
      message: `Your relocation request has been submitted successfully.`,
      time: "Just now",
      read: false
    };
    setNotifications([newNotification, ...notifications]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Business Relocation Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
              <button
                onClick={refreshDashboard}
                className="p-2 rounded-lg hover:bg-gray-100"
                title="Refresh Dashboard"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {userData.businessName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <span className="text-sm font-medium text-gray-700">{userData.businessName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Welcome, {userData.businessName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-blue-100 text-sm">Business Name</p>
              <p className="font-semibold">{userData.businessName}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">TIN Number</p>
              <p className="font-semibold">{userData.tinNumber}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Current Address</p>
              <p className="font-semibold">{userData.currentAddress}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Account Status</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {userData.accountStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approvedRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejectedRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Under Verification</p>
                <p className="text-2xl font-bold text-gray-900">{stats.underVerification}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit New Relocation Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowRequestForm(true)}
            className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Submit New Relocation Request</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Relocation Requests Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Relocation Requests</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Postcode</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.length > 0 ? (
                      requests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.new_postcode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(request.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.status}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => setSelectedRequest(request)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      loading ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                              <p className="text-lg font-medium">Loading requests...</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                            <div className="flex flex-col items-center">
                              <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <p className="text-lg font-medium">No relocation requests yet</p>
                              <p className="text-sm mt-1">Submit your first relocation request to get started</p>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Request Tracking Timeline */}
            {selectedRequest && (
              <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Tracking - {selectedRequest.id}</h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{getProgressPercentage(selectedRequest.status)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(selectedRequest.status)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-4">
                  {['Submitted', 'Assigned to Tax Collector', 'Field Verified', 'Admin Approval', 'Completed'].map((stage, index) => (
                    <div key={stage} className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-4 ${getProgressPercentage(selectedRequest.status) >= (index + 1) * 20
                        ? 'bg-blue-600'
                        : 'bg-gray-300'
                        }`}></div>
                      <div className="flex-1">
                        <p className={`text-sm ${getProgressPercentage(selectedRequest.status) >= (index + 1) * 20
                          ? 'text-gray-900 font-medium'
                          : 'text-gray-500'
                          }`}>{stage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Notifications Panel */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="p-6 space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-200'}`}
                  >
                    <p className="text-sm text-gray-700">{notification.message}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">{notification.time}</span>
                      {!notification.read && (
                        <button
                          onClick={() => markNotificationAsRead(notification.id)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Profile Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Business Profile</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Business Name</p>
                  <p className="text-gray-900">{userData.businessName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">TIN</p>
                  <p className="text-gray-900">{userData.tinNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Registered Address</p>
                  <p className="text-gray-900">{userData.currentAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact Info</p>
                  <p className="text-gray-900">{userData.phoneNumber || '+254 712 345 678'}</p>
                  <p className="text-gray-900">{userData.email || 'john@enterprises.com'}</p>
                </div>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                  Update Profile
                </button>
              </div>
            </div>

            {/* Compliance Status Indicator */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Compliance Status</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">Current Status</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getComplianceBadge(userData.complianceStatus)}`}>
                    {userData.complianceStatus}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• All tax returns filed on time</p>
                  <p>• No pending compliance issues</p>
                  <p>• Last audit: March 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Relocation Request Form Modal */}
      <RelocationRequestForm
        isOpen={showRequestForm}
        onClose={() => setShowRequestForm(false)}
        onSubmit={handleRelocationSubmit}
      />
    </div>
  );
}

export default Payerdashboard;
