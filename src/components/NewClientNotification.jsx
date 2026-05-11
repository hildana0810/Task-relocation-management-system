import { useState, useEffect } from 'react';
import api from '../utils/api';

function NewClientNotification() {
  const [newRequestsCount, setNewRequestsCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewRequests = async () => {
      try {
        const response = await api.get('/tax-collector/assigned-requests');
        const requests = response.data;

        // Count unassigned pending requests (new requests that need attention)
        const pendingCount = requests.filter(request =>
          request.status === 'pending' && !request.tax_collector_id
        ).length;
        setNewRequestsCount(pendingCount);

        // Show notification only if there are pending requests
        if (pendingCount > 0) {
          setIsVisible(true);

          // Auto-dismiss after 3 seconds
          const timer = setTimeout(() => {
            setIsVisible(false);
          }, 3000);

          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Error fetching new requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewRequests();
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Don't render anything if loading, no new requests, or notification is dismissed
  if (loading || newRequestsCount === 0 || !isVisible) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 relative animate-fade-in">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-2xl">🔔</span>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-yellow-700">
            <span className="font-medium">New Assignment:</span> You have been assigned {newRequestsCount} new taxpayer{newRequestsCount > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 text-yellow-600 hover:text-yellow-800 transition-colors"
          aria-label="Dismiss notification"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default NewClientNotification;
