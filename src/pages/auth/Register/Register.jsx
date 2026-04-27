import { useState, useEffect } from 'react';
import api from '../../../utils/api';


function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    tinnumber: '',
    location: '',
    phone: '',
    region: '',
    role: 'user', // Default to user role
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

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
      // Handle validation errors (like duplicate email/tin) properly
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          setErrors(err.response.data.errors);
        } else if (err.response.data.message) {
          // Handle SQL constraint violations for TIN number
          if (err.response.data.message.includes('users_tinnumber_unique')) {
            setErrors({ tinnumber: ['The TIN number has already been taken.'] });
          } else {
            setMessage(err.response.data.message);
          }
        }
      } else {
        setMessage('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 via-pink-200 to-indigo-300 relative overflow-hidden">
      {/* Grainy texture overlay */}
      <div className="absolute inset-0 opacity-30 mix-blend-multiply"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className={`relative z-10 bg-white/20 backdrop-blur-md max-w-sm w-full p-6 rounded-2xl shadow-2xl border border-white/30 max-h-[90vh] overflow-y-auto transform transition-all duration-700 ease-out ${isAnimating ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
        <h2 className="mb-4 text-2xl font-semibold text-gray-800 text-center">Create Account</h2>

        {message && <p className="mb-4 text-teal-700 text-base">{message}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm transition-all"
            />
            {errors.name && <div className="text-left text-sm text-red-600 mt-1">{errors.name[0]}</div>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm transition-all"
            />
            {errors.email && <div className="text-left text-sm text-red-600 mt-1">{errors.email[0]}</div>}
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 bg-white/10 border border-white/20 rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600/60 hover:text-gray-600/80 focus:outline-none transition-all bg-transparent border-0 p-0"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <div className="text-left text-sm text-red-600 mt-1">{errors.password[0]}</div>}
          </div>

          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password_confirmation"
                placeholder="Confirm Password"
                value={form.password_confirmation}
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 bg-white/10 border border-white/20 rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600/60 hover:text-gray-600/80 focus:outline-none transition-all bg-transparent border-0 p-0"
              >
                {showConfirmPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password_confirmation && <div className="text-left text-sm text-red-600 mt-1">{errors.password_confirmation[0]}</div>}
          </div>

          <div>
            <input
              type="text"
              name="tinnumber"
              placeholder="TIN Number"
              value={form.tinnumber}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm transition-all"
            />
            {errors.tinnumber && <div className="text-left text-sm text-red-600 mt-1">{errors.tinnumber[0]}</div>}
          </div>

          <div>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-gray-800 placeholder-gray-500 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm transition-all"
            />
            {errors.location && <div className="text-left text-sm text-red-600 mt-1">{errors.location[0]}</div>}
          </div>

          <button
            type="submit"
            className="mt-1 py-2 px-4 bg-white/20 backdrop-blur-sm border border-white/30 text-gray-800 rounded-full text-sm font-medium cursor-pointer hover:bg-white/30 transition-all transform hover:scale-[1.02] shadow-lg"
          >
            Sign Up
          </button>
        </form>


        <p className="mt-3 text-xs text-gray-600 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-gray-800 hover:text-gray-600 font-medium transition-all duration-300 transform hover:scale-105 hover:underline underline-offset-2">Sign in</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
