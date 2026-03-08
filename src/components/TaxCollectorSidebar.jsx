import { Link, useLocation } from 'react-router-dom';

function TaxCollectorSidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('tax_collector');
    window.location.href = '/tax-collector-login';
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed left-0 top-0">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-8">Tax Collector Panel</h3>
        
        <nav className="space-y-2">
          <Link
            to="/tax-collector-dashboard"
            className={`block px-4 py-3 rounded-lg transition-colors ${
              isActive('/tax-collector-dashboard')
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Dashboard
          </Link>
          
          <Link
            to="/tax-collector-dashboard/taxpayers"
            className={`block px-4 py-3 rounded-lg transition-colors ${
              isActive('/tax-collector-dashboard/taxpayers')
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            My Taxpayers
          </Link>
          
          <Link
            to="/tax-collector-dashboard/notifications"
            className={`block px-4 py-3 rounded-lg transition-colors ${
              isActive('/tax-collector-dashboard/notifications')
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Notifications
          </Link>
        </nav>
        
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaxCollectorSidebar;
