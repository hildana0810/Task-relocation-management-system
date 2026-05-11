import { useState, useEffect } from 'react';
import api from '../../utils/api';

function MyTaxpayersTable() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [taxpayers, setTaxpayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelocationRequests = async () => {
      try {
        setLoading(true);
        console.log('Fetching relocation requests...');
        const response = await api.get('/relocation-requests');
        console.log('Relocation requests response:', response.data);
        setTaxpayers(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching relocation requests:', error);
        setError('Failed to load taxpayer data');
        setTaxpayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelocationRequests();
  }, []);

  const handleViewDetails = (taxpayer) => {
    setSelectedClient(taxpayer);
    setShowDetails(true);
  };

  const closeModal = () => {
    setShowDetails(false);
    setSelectedClient(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">My Taxpayers</h3>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading taxpayer data...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <span className="font-medium">Error:</span> {error}
                </p>
              </div>
            </div>
          </div>
        ) : taxpayers.length === 0 ? (
          <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">No Data:</span> No relocation requests found
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TIN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {taxpayers.map((taxpayer) => (
                  <tr key={taxpayer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {taxpayer.business_name || taxpayer.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {taxpayer.tin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {taxpayer.new_address || taxpayer.newAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {taxpayer.created_at ? new Date(taxpayer.created_at).toLocaleDateString() : taxpayer.requestDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(taxpayer)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Client Details Modal */}
      {showDetails && selectedClient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Details</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedClient.business_name || selectedClient.clientName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">TIN</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedClient.tin}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Old Address</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedClient.old_address || selectedClient.oldAddress}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">New Address</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedClient.new_address || selectedClient.newAddress}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Request Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedClient.created_at ? new Date(selectedClient.created_at).toLocaleDateString() : selectedClient.requestDate}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyTaxpayersTable;
