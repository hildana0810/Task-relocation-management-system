import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../../components/AdminSidebar';
import api from '../../../utils/api';

function TaxCollectors() {
  const [taxCollectors, setTaxCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCollector, setEditingCollector] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    region: '',
    status: 'active'
  });
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchTaxCollectors();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');
    
    if (!token || role !== 'admin') {
      navigate('/admin/login');
    }
  };

  const fetchTaxCollectors = async () => {
    try {
      const response = await api.get('/admin/tax-collectors');
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      
      // If API returns empty array, use dummy data for demo
      if (response.data && response.data.length === 0) {
        console.log('API returned empty array, using dummy data');
        setTaxCollectors([
          {
            id: 1,
            name: 'Michael Johnson',
            email: 'michael.j@tax.gov.tz',
            phone: '+255 712 345 678',
            region: 'Dar es Salaam',
            status: 'active',
            assigned_requests: 12,
            created_at: '2024-01-15'
          },
          {
            id: 2,
            name: 'Sarah Williams',
            email: 'sarah.w@tax.gov.tz',
            phone: '+255 713 456 789',
            region: 'Arusha',
            status: 'active',
            assigned_requests: 8,
            created_at: '2024-01-20'
          },
          {
            id: 3,
            name: 'David Brown',
            email: 'david.b@tax.gov.tz',
            phone: '+255 714 567 890',
            region: 'Mwanza',
            status: 'inactive',
            assigned_requests: 15,
            created_at: '2024-02-01'
          },
          {
            id: 4,
            name: 'Emily Davis',
            email: 'emily.d@tax.gov.tz',
            phone: '+255 715 678 901',
            region: 'Dodoma',
            status: 'active',
            assigned_requests: 6,
            created_at: '2024-02-10'
          }
        ]);
      } else {
        setTaxCollectors(response.data);
      }
    } catch (error) {
      console.error('Error fetching tax collectors:', error);
      // Set dummy data for demo
      setTaxCollectors([
        {
          id: 1,
          name: 'Michael Johnson',
          email: 'michael.j@tax.gov.tz',
          phone: '+255 712 345 678',
          region: 'Dar es Salaam',
          status: 'active',
          assigned_requests: 12,
          created_at: '2024-01-15'
        },
        {
          id: 2,
          name: 'Sarah Williams',
          email: 'sarah.w@tax.gov.tz',
          phone: '+255 713 456 789',
          region: 'Arusha',
          status: 'active',
          assigned_requests: 8,
          created_at: '2024-01-20'
        },
        {
          id: 3,
          name: 'David Brown',
          email: 'david.b@tax.gov.tz',
          phone: '+255 714 567 890',
          region: 'Mwanza',
          status: 'inactive',
          assigned_requests: 15,
          created_at: '2024-02-01'
        },
        {
          id: 4,
          name: 'Emily Davis',
          email: 'emily.d@tax.gov.tz',
          phone: '+255 715 678 901',
          region: 'Dodoma',
          status: 'active',
          assigned_requests: 6,
          created_at: '2024-02-10'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCollectors = taxCollectors.filter(collector => {
    const matchesFilter = filter === 'all' || collector.status === filter;
    const matchesSearch = collector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collector.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collector.region.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddCollector = () => {
    setEditingCollector(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      region: '',
      status: 'active'
    });
    setShowAddModal(true);
  };

  const handleEditCollector = (collector) => {
    setEditingCollector(collector);
    setFormData({
      name: collector.name,
      email: collector.email,
      phone: collector.phone,
      region: collector.region,
      status: collector.status
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Submitting form data:', formData);
      console.log('Editing collector:', editingCollector);
      
      if (editingCollector) {
        console.log('Making PUT request to:', `/admin/tax-collectors/${editingCollector.id}`);
        const response = await api.put(`/admin/tax-collectors/${editingCollector.id}`, formData);
        console.log('PUT response:', response);
        setSuccessMessage('Tax collector updated successfully!');
      } else {
        console.log('Making POST request to:', '/admin/tax-collectors');
        const response = await api.post('/admin/tax-collectors', formData);
        console.log('POST response:', response);
        setSuccessMessage('Tax collector added successfully!');
      }
      
      setShowAddModal(false);
      fetchTaxCollectors();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving tax collector:', error);
      console.error('Error details:', error.response?.data);
      alert('Error saving tax collector: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleToggleStatus = async (collectorId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      await api.put(`/admin/tax-collectors/${collectorId}`, { status: newStatus });
      fetchTaxCollectors();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tax collectors...</p>
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
            <h1 className="text-3xl font-bold text-gray-800">Tax Collectors</h1>
            <p className="text-gray-600">Manage tax collection officers</p>
          </div>
          <button
            onClick={handleAddCollector}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Tax Collector
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, email, or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition ${filter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                All ({taxCollectors.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg transition ${filter === 'active' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Active ({taxCollectors.filter(tc => tc.status === 'active').length})
              </button>
              <button
                onClick={() => setFilter('inactive')}
                className={`px-4 py-2 rounded-lg transition ${filter === 'inactive' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Inactive ({taxCollectors.filter(tc => tc.status === 'inactive').length})
              </button>
            </div>
          </div>
        </div>

        {/* Tax Collectors Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Requests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCollectors.map((collector) => (
                  <tr key={collector.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{collector.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{collector.email}</div>
                        <div className="text-sm text-gray-500">{collector.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {collector.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(collector.status)}`}>
                        {collector.status.charAt(0).toUpperCase() + collector.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {collector.assigned_requests}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditCollector(collector)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(collector.id, collector.status)}
                        className={`${collector.status === 'active' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                      >
                        {collector.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredCollectors.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="mt-2">No tax collectors found</p>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
          )}

        <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editingCollector ? 'Edit Tax Collector' : 'Add New Tax Collector'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                  <select
                    required
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select Region</option>
                    <option value="Dar es Salaam">Dar es Salaam</option>
                    <option value="Arusha">Arusha</option>
                    <option value="Mwanza">Mwanza</option>
                    <option value="Dodoma">Dodoma</option>
                    <option value="Tanga">Tanga</option>
                    <option value="Mbeya">Mbeya</option>
                    <option value="Morogoro">Morogoro</option>
                    <option value="Kilimanjaro">Kilimanjaro</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                  >
                    {editingCollector ? 'Update' : 'Add'} Tax Collector
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaxCollectors;
