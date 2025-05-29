import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../api/config';
import { loginSuccess } from '../redux/userSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login(formData);
      // Store the token in localStorage
      localStorage.setItem('token', response.token);
      // Update Redux state
      dispatch(loginSuccess(response));
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#1b1b1d]">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1b1b1d] flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1584949091598-c31daaaa4aa9?q=80&w=2070&auto=format&fit=crop"
            alt="Analytics Dashboard"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b1b1d] via-transparent to-[#1b1b1d]"></div>
        </div>
        
        <div className="p-8 relative z-10">
          <div className="text-[#FFFFFF] text-2xl font-bold">Excel Analytics</div>
        </div>
        
        <div className="p-8 flex flex-col items-center justify-center flex-grow relative z-10">
          <div className="text-[#FFFFFF] text-center max-w-lg">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Transform your Excel data into actionable insights
            </h1>
            <p className="text-xl text-[#FFFFFF99] font-medium">
              Unlock the power of data analysis
            </p>
          </div>
        </div>
        
        <div className="p-8 relative z-10">
          <p className="text-[#FFFFFF99] text-sm">© 2024 Excel Analytics Platform. All rights reserved.</p>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-[#1b1b1d]">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-[#FFFFFF]">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-[#FFFFFF99]">
              Sign in to your account to continue
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#FFFFFF99]">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full rounded-lg border bg-[#2c2c2f] border-[#ffffff1a] px-3 py-2 text-[#FFFFFF] placeholder-[#FFFFFF99] shadow-sm focus:border-[#f02e65] focus:outline-none focus:ring-1 focus:ring-[#f02e65] sm:text-sm"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#FFFFFF99]">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full rounded-lg border bg-[#2c2c2f] border-[#ffffff1a] px-3 py-2 text-[#FFFFFF] placeholder-[#FFFFFF99] shadow-sm focus:border-[#f02e65] focus:outline-none focus:ring-1 focus:ring-[#f02e65] sm:text-sm"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#ffffff1a] bg-[#2c2c2f] text-[#f02e65] focus:ring-[#f02e65] focus:ring-offset-0"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-[#FFFFFF99]">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-[#f02e65] hover:text-[#f02e65]/90">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-lg border border-transparent bg-[#f02e65] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#f02e65]/90 focus:outline-none focus:ring-2 focus:ring-[#f02e65] focus:ring-offset-2 focus:ring-offset-[#1b1b1d]"
                >
                  Sign in
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-[#FFFFFF99]">Don't have an account?</span>
              {' '}
              <Link to="/register" className="font-medium text-[#f02e65] hover:text-[#f02e65]/90">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;