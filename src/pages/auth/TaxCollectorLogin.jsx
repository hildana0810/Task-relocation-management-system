import { useState } from 'react';
import api from '../../utils/api';

function TaxCollectorLogin() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
      const response = await api.post('/tax-collector/login', form);
      setMessage('Login successful');
      
      // Store token and user data
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('tax_collector', JSON.stringify(response.data.tax_collector));
      }
      
      // Redirect to tax collector dashboard
      window.location.href = '/tax-collector-dashboard';
      
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-600 p-8">
      <div className="bg-white max-w-md w-full p-10 rounded-2xl shadow-xl text-center">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">TAX COLLECTOR LOGIN</h2>
        {message && (
          <p className={`mb-4 text-base ${message.includes('successful') ? 'text-teal-700' : 'text-red-600'}`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-full text-base focus:border-green-400 focus:outline-none placeholder-gray-400"
            required
          />
          {errors.email && <div className="text-left text-sm text-red-600">{errors.email[0]}</div>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-full text-base focus:border-green-400 focus:outline-none placeholder-gray-400"
            required
          />
          {errors.password && <div className="text-left text-sm text-red-600">{errors.password[0]}</div>}

          <button 
            type="submit" 
            className="mt-2 py-3 px-4 bg-gradient-to-r from-green-400 to-blue-600 text-white border-none rounded-full text-base font-medium cursor-pointer hover:opacity-90 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'LOGIN AS TAX COLLECTOR'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-700">
          Regular user?{' '}
          <a href="/login" className="text-green-500 hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default TaxCollectorLogin;
