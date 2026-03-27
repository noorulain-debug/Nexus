import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, CircleDollarSign, Building2, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  //  OTP STATES
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  //  LOGIN STEP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await login(email, password, role);

      setStep(2); // go to OTP

      setIsLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  // 🔹 OTP VERIFY
  const handleVerifyOTP = () => {
    if (otp === "1234") {
      navigate(role === 'entrepreneur'
        ? '/dashboard/entrepreneur'
        : '/dashboard/investor'
      );
    } else {
      alert("Invalid OTP");
    }
  };

  // For demo purposes, pre-filled credentials
  const fillDemoCredentials = (userRole: UserRole) => {
    if (userRole === 'entrepreneur') {
      setEmail('sarah@techwave.io');
      setPassword('password123');
    } else {
      setEmail('michael@vcinnovate.com');
      setPassword('password123');
    }
    setRole(userRole);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-md flex items-center justify-center">
            {/* logo */}
          </div>
        </div>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === 1 ? "Sign in to Business Nexus" : "Verify OTP"}
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 1 
            ? "Connect with investors and entrepreneurs"
            : "Enter the OTP sent to your account (Demo: 1234)"
          }
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

          {error && (
            <div className="mb-4 bg-error-50 border border-error-500 text-error-700 px-4 py-3 rounded-md flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/*  STEP SWITCH */}
          {step === 1 ? (
            <form className="space-y-6" onSubmit={handleSubmit}>

              {/* ROLE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  I am a
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button type="button"
                    className={`py-3 px-4 border rounded-md flex items-center justify-center ${
                      role === 'entrepreneur'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300'
                    }`}
                    onClick={() => setRole('entrepreneur')}
                  >
                    <Building2 size={18} className="mr-2" />
                    Entrepreneur
                  </button>

                  <button type="button"
                    className={`py-3 px-4 border rounded-md flex items-center justify-center ${
                      role === 'investor'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300'
                    }`}
                    onClick={() => setRole('investor')}
                  >
                    <CircleDollarSign size={18} className="mr-2" />
                    Investor
                  </button>
                </div>
              </div>

              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                startAdornment={<User size={18} />}
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                leftIcon={<LogIn size={18} />}
              >
                Sign in
              </Button>
            </form>

          ) : (
            <div className="space-y-6">

              <Input
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                fullWidth
              />

              <Button
                fullWidth
                onClick={handleVerifyOTP}
              >
                Verify OTP
              </Button>

              <button
                onClick={()=>setStep(1)}
                className="text-sm text-primary-600"
              >
                Back to Login
              </button>

            </div>
          )}


          <div className="mt-6">
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => fillDemoCredentials('entrepreneur')}
              >
                Entrepreneur Demo
              </Button>

              <Button
                variant="outline"
                onClick={() => fillDemoCredentials('investor')}
              >
                Investor Demo
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600">
                Sign up
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};