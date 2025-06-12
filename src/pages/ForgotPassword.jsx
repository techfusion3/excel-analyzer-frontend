import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/config';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await forgotPassword(email);
      setStatus({
        type: 'success',
        message: 'Password reset instructions have been sent to your email.'
      });
      setEmail('');
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Failed to process request'
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
              Recover your account
            </h1>
            <p className="text-xl text-[#FFFFFF99] font-medium">
              We'll help you reset your password
            </p>
          </div>
        </div>
        
        <div className="p-8 relative z-10">
          <p className="text-[#FFFFFF99] text-sm">© 2024 Excel Analytics Platform. All rights reserved.</p>
        </div>
      </div>

      {/* Right Section - Forgot Password Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-[#1b1b1d]">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-[#FFFFFF]">
              Forgot your password?
            </h2>
            <p className="mt-2 text-sm text-[#FFFFFF99]">
              Enter your email address and we'll send you instructions to reset your password.
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-lg border border-transparent bg-[#f02e65] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#f02e65]/90 focus:outline-none focus:ring-2 focus:ring-[#f02e65] focus:ring-offset-2 focus:ring-offset-[#1b1b1d] disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-[#FFFFFF99]">Remember your password?</span>
              {' '}
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

export default ForgotPassword; 