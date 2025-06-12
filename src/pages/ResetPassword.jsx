import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { resetPassword } from '../api/config';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus({
        type: 'error',
        message: 'Invalid reset link. Please request a new password reset.'
      });
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setStatus({
        type: 'error',
        message: 'Passwords do not match'
      });
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setStatus({
        type: 'error',
        message: 'Password must be at least 8 characters long'
      });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await resetPassword(token, formData.password);
      setStatus({
        type: 'success',
        message: 'Password has been reset successfully!'
      });
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Failed to reset password'
      });
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
              Reset your password
            </h1>
            <p className="text-xl text-[#FFFFFF99] font-medium">
              Choose a strong password to protect your account
            </p>
          </div>
        </div>
        
        <div className="p-8 relative z-10">
          <p className="text-[#FFFFFF99] text-sm">© 2024 Excel Analytics Platform. All rights reserved.</p>
        </div>
      </div>

      {/* Right Section - Reset Password Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-[#1b1b1d]">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-[#FFFFFF]">
              Create new password
            </h2>
            <p className="mt-2 text-sm text-[#FFFFFF99]">
              Please enter your new password below
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {status.message && (
                <div 
                  className={`${
                    status.type === 'error' 
                      ? 'bg-red-900/50 border-red-500/50 text-red-200' 
                      : 'bg-green-900/50 border-green-500/50 text-green-200'
                  } border px-4 py-3 rounded relative`} 
                  role="alert"
                >
                  <span className="block sm:inline">{status.message}</span>
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#FFFFFF99]">
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full rounded-lg border bg-[#2c2c2f] border-[#ffffff1a] px-3 py-2 text-[#FFFFFF] placeholder-[#FFFFFF99] shadow-sm focus:border-[#f02e65] focus:outline-none focus:ring-1 focus:ring-[#f02e65] sm:text-sm"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={!token}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#FFFFFF99]">
                  Confirm New Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="block w-full rounded-lg border bg-[#2c2c2f] border-[#ffffff1a] px-3 py-2 text-[#FFFFFF] placeholder-[#FFFFFF99] shadow-sm focus:border-[#f02e65] focus:outline-none focus:ring-1 focus:ring-[#f02e65] sm:text-sm"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={!token}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || !token}
                  className="flex w-full justify-center rounded-lg border border-transparent bg-[#f02e65] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#f02e65]/90 focus:outline-none focus:ring-2 focus:ring-[#f02e65] focus:ring-offset-2 focus:ring-offset-[#1b1b1d] disabled:opacity-50"
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <Link to="/login" className="font-medium text-[#f02e65] hover:text-[#f02e65]/90">
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 