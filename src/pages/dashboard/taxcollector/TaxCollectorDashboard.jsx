import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TaxCollectorSidebar from '../../../components/TaxCollectorSidebar';
import NewClientNotification from '../../../components/NewClientNotification';
import AssignedRelocationRequests from '../../../components/AssignedRelocationRequests';
import api from '../../../utils/api';

function TaxCollectorDashboard() {
  const location = useLocation();
  const [taxCollectorData, setTaxCollectorData] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0
  });

  // Set activeSection based on URL path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/tax-collector-dashboard/taxpayers') {
      setActiveSection('taxpayers');
    } else if (path === '/tax-collector-dashboard/notifications') {
      setActiveSection('notifications');
    } else {
      setActiveSection('dashboard');
    }
  }, [location.pathname]);

  useEffect(() => {
    // Fetch tax collector stats and profile
    const fetchData = async () => {
      try {
        // Fetch tax collector stats
        console.log('Fetching tax collector stats...');
        const statsResponse = await api.get('/tax-collector/stats');
        console.log('Stats response:', statsResponse.data);
        setStats(statsResponse.data);

        // Try to fetch tax collector profile from users table
        try {
          console.log('Fetching tax collector profile...');
          const profileResponse = await api.get('/tax-collector/profile');
          console.log('Profile response:', profileResponse.data);
          setTaxCollectorData(profileResponse.data);
        } catch (profileError) {
          console.log('Profile API failed, trying alternative endpoint...');

          // Try alternative endpoint without ID
          try {
            const userResponse = await api.get('/user');
            console.log('User response:', userResponse.data);
            setTaxCollectorData(userResponse.data);
          } catch (userError) {
            console.log('All profile fetch attempts failed');
          }
        }
      } catch (error) {
        console.log('Error fetching stats:', error);
        console.log('No stats available, showing 0');
        // Keep default 0 values when no data is available
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div>
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 text-white p-8 rounded-xl shadow-lg mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-1">
                      {taxCollectorData ? (
                        `Welcome back, ${taxCollectorData.name || taxCollectorData.firstName || taxCollectorData.username}`
                      ) : (
                        <div className="animate-pulse">
                          <div className="h-8 bg-white/20 rounded w-48"></div>
                        </div>
                      )}
                    </h1>
                    <p className="text-blue-100 text-sm">Tax Collector Dashboard</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-blue-100 text-xs uppercase tracking-wide mb-1">Region</p>
                    <p className="text-lg font-semibold">Arusha</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-blue-100 text-xs uppercase tracking-wide mb-1">Status</p>
                    <p className="text-lg font-semibold">Active</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-blue-100 text-xs uppercase tracking-wide mb-1">Department</p>
                    <p className="text-lg font-semibold">Revenue</p>
                  </div>
                </div>
              </div>
            </div>

            {/* New Client Notification */}
            <NewClientNotification />

            {/* Assigned Relocation Requests */}
            <AssignedRelocationRequests />
          </div>
        );

      case 'taxpayers':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Assigned Relocation Requests</h2>
            <AssignedRelocationRequests />
          </div>
        );

      case 'notifications':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Notifications</h2>
            <div className="space-y-4">
              <NewClientNotification />
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Reminder:</span> Review pending taxpayer requests before end of week
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      <span className="font-medium">Completed:</span> Successfully processed 5 taxpayer requests this month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <TaxCollectorSidebar />
      <div className="flex-1 ml-64 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default TaxCollectorDashboard;
