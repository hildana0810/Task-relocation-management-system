import { useState } from 'react';
import api from '../../../utils/api';

function Login() {
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
      const response = await api.post('/login', form);
      setMessage('Login successful');
      
      // Store token and user data
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      // Redirect to dashboard or home
      window.location.href = '/payerdashboard';
      
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-600 p-8">
      <div className="bg-white max-w-md w-full p-10 rounded-2xl shadow-xl text-center">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">LOGIN</h2>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-full text-base focus:border-indigo-400 focus:outline-none placeholder-gray-400"
            required
          />
          {errors.email && <div className="text-left text-sm text-red-600">{errors.email[0]}</div>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-full text-base focus:border-indigo-400 focus:outline-none placeholder-gray-400"
            required
          />
          {errors.password && <div className="text-left text-sm text-red-600">{errors.password[0]}</div>}

          <button 
            type="submit" 
            className="mt-2 py-3 px-4 bg-gradient-to-r from-indigo-400 to-purple-600 text-white border-none rounded-full text-base font-medium cursor-pointer hover:opacity-90 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-700">
          Don't have an account?{' '}
          <a href="/" className="text-indigo-500 hover:underline">Register here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
