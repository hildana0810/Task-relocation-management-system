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
    // Get tax collector data from localStorage
    const storedData = localStorage.getItem('tax_collector');
    if (storedData) {
      setTaxCollectorData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    // Fetch tax collector stats
    const fetchStats = async () => {
      try {
        console.log('Fetching tax collector stats...');
        const response = await api.get('/tax-collector/stats');
        console.log('Stats response:', response.data);
        setStats(response.data);
      } catch (error) {
        console.log('Error fetching stats:', error);
        console.log('No stats available, showing 0');
        // Keep default 0 values when no data is available
      }
    };
    
    fetchStats();
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div>
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-lg mb-6">
              <h1 className="text-2xl font-bold mb-2">Welcome Tax Collector</h1>
              <p className="text-lg">Region: Arusha</p>
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
