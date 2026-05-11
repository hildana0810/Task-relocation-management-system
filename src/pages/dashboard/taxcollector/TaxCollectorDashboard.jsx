import { useState, useEffect } from 'react';
import TaxCollectorSidebar from '../../../components/TaxCollectorSidebar';
import NewClientNotification from '../../../components/NewClientNotification';
import MyTaxpayersTable from '../../../components/MyTaxpayersTable';
import api from '../../../utils/api';

function TaxCollectorDashboard() {
  const [taxCollectorData, setTaxCollectorData] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({
    totalTaxpayers: 0,
    newAssignments: 0,
    pendingReviews: 0
  });

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
          console.log('Profile API failed, trying to fetch by user ID...');

          // Get user data from localStorage to get the ID
          const userData = localStorage.getItem('user');
          const taxCollectorData = localStorage.getItem('tax_collector');

          let userId = null;
          let fallbackData = null;

          if (userData) {
            const parsedUser = JSON.parse(userData);
            userId = parsedUser.id;
            fallbackData = parsedUser;
            console.log('Found user ID from localStorage:', userId);
          } else if (taxCollectorData) {
            const parsedTaxCollector = JSON.parse(taxCollectorData);
            userId = parsedTaxCollector.id;
            fallbackData = parsedTaxCollector;
            console.log('Found tax collector ID from localStorage:', userId);
          }

          if (userId) {
            try {
              // Fetch user details by ID
              console.log('Fetching user by ID:', userId);
              const userResponse = await api.get(`/users/${userId}`);
              console.log('User by ID response:', userResponse.data);
              setTaxCollectorData(userResponse.data);
            } catch (userByIdError) {
              console.log('Failed to fetch user by ID, using fallback data');
              setTaxCollectorData(fallbackData);
            }
          } else {
            // Try alternative endpoint without ID
            try {
              const userResponse = await api.get('/user');
              console.log('User response:', userResponse.data);
              setTaxCollectorData(userResponse.data);
            } catch (userError) {
              console.log('All profile fetch attempts failed');
              if (fallbackData) {
                setTaxCollectorData(fallbackData);
              }
            }
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

            {/* My Taxpayers Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Taxpayers</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalTaxpayers}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">New Assignments</h3>
                <p className="text-3xl font-bold text-green-600">{stats.newAssignments}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Reviews</h3>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingReviews}</p>
              </div>
            </div>

            {/* Recent Taxpayers Table */}
            <MyTaxpayersTable />
          </div>
        );

      case 'taxpayers':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Taxpayers</h2>
            <MyTaxpayersTable />
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
