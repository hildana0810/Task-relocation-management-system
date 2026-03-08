import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../../components/AdminSidebar';
import api from '../../../utils/api';

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [taxCollectors, setTaxCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchUsers();
    fetchTaxCollectors();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');
    
    if (!token || role !== 'admin') {
      navigate('/admin/login');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', tinnumber: '123456789', location: 'Dar es Salaam', created_at: '2024-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', tinnumber: '987654321', location: 'Arusha', created_at: '2024-01-20' }
      ]);
    }
  };

  const fetchTaxCollectors = async () => {
    try {
      const response = await api.get('/admin/tax-collectors');
      setTaxCollectors(response.data);
    } catch (error) {
      console.error('Error fetching tax collectors:', error);
      setTaxCollectors([
        { id: 1, name: 'Michael Johnson', email: 'michael@tax.gov.tz', phone: '+255 712 345 678', region: 'Dar es Salaam', status: 'active' },
        { id: 2, name: 'Sarah Williams', email: 'sarah@tax.gov.tz', phone: '+255 713 456 789', region: 'Arusha', status: 'active' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">All Registered Users</h1>
          <p className="text-gray-600">View and manage all users and tax collectors</p>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-3 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Regular Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('tax_collectors')}
                className={`py-3 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'tax_collectors'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Tax Collectors ({taxCollectors.length})
              </button>
            </nav>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'users' ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TIN Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.tinnumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {taxCollectors.map((tc) => (
                    <tr key={tc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tc.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tc.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tc.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tc.region}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          tc.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {tc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllUsers;
