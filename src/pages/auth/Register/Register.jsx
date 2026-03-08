import { useState } from 'react';
import api from '../../../utils/api';


function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    tinnumber: '',
    location: '',
    role: 'user',
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    try {
      const response = await api.post('/register', form);
      setMessage('Registration successful! Redirecting to login...');
      
      // Store token if returned
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
      console.log(response.data);
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          setErrors(err.response.data.errors);
        } else if (err.response.data.message) {
          setMessage(err.response.data.message);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-600 p-8">
      <div className="bg-white max-w-md w-full p-10 rounded-2xl shadow-xl text-center">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">CREATE ACCOUNT</h2>
        {message && <p className="mb-4 text-teal-700 text-base">{message}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-full text-base focus:border-indigo-400 focus:outline-none placeholder-gray-400"
          />
          {errors.name && <div className="text-left text-sm text-red-600">{errors.name[0]}</div>}

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-full text-base focus:border-indigo-400 focus:outline-none placeholder-gray-400"
          />
          {errors.email && <div className="text-left text-sm text-red-600">{errors.email[0]}</div>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-full text-base focus:border-indigo-400 focus:outline-none placeholder-gray-400"
          />
          {errors.password && <div className="text-left text-sm text-red-600">{errors.password[0]}</div>}

          <input
            type="text"
            name="tinnumber"
            placeholder="TIN Number"
            value={form.tinnumber}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-full text-base focus:border-indigo-400 focus:outline-none placeholder-gray-400"
          />
          {errors.tinnumber && <div className="text-left text-sm text-red-600">{errors.tinnumber[0]}</div>}

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-full text-base focus:border-indigo-400 focus:outline-none placeholder-gray-400"
          />
          {errors.location && <div className="text-left text-sm text-red-600">{errors.location[0]}</div>}

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-full text-base focus:border-indigo-400 focus:outline-none"
          >
            <option value="user">Regular User</option>
            <option value="tax_collector">Tax Collector</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <div className="text-left text-sm text-red-600">{errors.role[0]}</div>}

          <input
            type="password"
            name="password_confirmation"
            placeholder="Repeat your password"
            value={form.password_confirmation}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-full text-base focus:border-indigo-400 focus:outline-none placeholder-gray-400"
          />
          {errors.password_confirmation && <div className="text-left text-sm text-red-600">{errors.password_confirmation[0]}</div>}

          <button type="submit" className="mt-2 py-3 px-4 bg-gradient-to-r from-indigo-400 to-purple-600 text-white border-none rounded-full text-base font-medium cursor-pointer hover:opacity-90 transition">SIGN UP</button>
        </form>
        <p className="mt-4 text-sm text-gray-700">
          Have already an account?{' '}
          <a href="/login" className="text-indigo-500 hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
