import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

function AdminLogin() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    setLoading(true);

    try {
      const response = await api.post('/admin/login', form);
      setMessage('Login successful');
      
      // Store token and admin data
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
        localStorage.setItem('user_role', 'admin');
      }
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
      
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          setErrors(err.response.data.errors);
        } else if (err.response.data.message) {
          setMessage(err.response.data.message);
        }
      } else {
        setMessage('An error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-gray-900 p-8">
      <div className="bg-white max-w-md w-full p-10 rounded-2xl shadow-xl text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">ADMIN LOGIN</h2>
          <p className="text-gray-600 mt-2">System Administration Portal</p>
        </div>
        
        {message && (
          <p className={`mb-4 text-base ${message.includes('successful') ? 'text-green-700' : 'text-red-600'}`}>
            {message}
          </p>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:border-red-500 focus:outline-none placeholder-gray-400"
            required
          />
          {errors.email && <div className="text-left text-sm text-red-600">{errors.email[0]}</div>}

          <input
            type="password"
            name="password"
            placeholder="Admin Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:border-red-500 focus:outline-none placeholder-gray-400"
            required
          />
          {errors.password && <div className="text-left text-sm text-red-600">{errors.password[0]}</div>}

          <button 
            type="submit" 
            className="mt-2 py-3 px-4 bg-red-600 text-white border-none rounded-lg text-base font-medium cursor-pointer hover:bg-red-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'LOGIN AS ADMIN'}
          </button>
        </form>
        
        <div className="mt-6 text-sm text-gray-600">
          <a href="/login" className="text-red-600 hover:underline">← Back to User Login</a>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
