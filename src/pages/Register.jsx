import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/config';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Remove confirmPassword and combine first and last name
      const { confirmPassword, firstName, lastName, ...rest } = formData;
      const registrationData = {
        ...rest,
        name: `${firstName} ${lastName}`.trim()
      };
      console.log('Sending registration data:', registrationData);
      const response = await register(registrationData);
      navigate('/login');
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || err.response.data || 'Registration failed');
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(err.message || 'Registration failed');
      }
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
            src="https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?q=80&w=2070&auto=format&fit=crop"
            alt="Analytics Background"
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
              Turn complex data into clear insights
            </h1>
            <p className="text-xl text-[#FFFFFF99] font-medium">
              Start your analytics journey today
            </p>
          </div>
        </div>
        
        <div className="p-8 relative z-10">
          <p className="text-[#FFFFFF99] text-sm">© 2024 Excel Analytics Platform. All rights reserved.</p>
        </div>
      </div>

      {/* Right Section - Registration Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-[#1b1b1d]">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-[#FFFFFF]">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-[#FFFFFF99]">
              Join us to start analyzing your Excel data
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-[#FFFFFF99]">
                    First Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="block w-full rounded-lg border bg-[#2c2c2f] border-[#ffffff1a] px-3 py-2 text-[#FFFFFF] placeholder-[#FFFFFF99] shadow-sm focus:border-[#f02e65] focus:outline-none focus:ring-1 focus:ring-[#f02e65] sm:text-sm"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-[#FFFFFF99]">
                    Last Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="block w-full rounded-lg border bg-[#2c2c2f] border-[#ffffff1a] px-3 py-2 text-[#FFFFFF] placeholder-[#FFFFFF99] shadow-sm focus:border-[#f02e65] focus:outline-none focus:ring-1 focus:ring-[#f02e65] sm:text-sm"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#FFFFFF99]">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="block w-full rounded-lg border bg-[#2c2c2f] border-[#ffffff1a] px-3 py-2 text-[#FFFFFF] placeholder-[#FFFFFF99] shadow-sm focus:border-[#f02e65] focus:outline-none focus:ring-1 focus:ring-[#f02e65] sm:text-sm"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-lg border border-transparent bg-[#f02e65] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#f02e65]/90 focus:outline-none focus:ring-2 focus:ring-[#f02e65] focus:ring-offset-2 focus:ring-offset-[#1b1b1d]"
                >
                  Create account
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-[#FFFFFF99]">Already have an account?</span>
              {' '}
              <Link to="/login" className="font-medium text-[#f02e65] hover:text-[#f02e65]/90">
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 