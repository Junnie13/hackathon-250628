import React, { useState } from 'react';
import { Quote, Sparkles, ArrowLeft, Eye, EyeOff, Check } from 'lucide-react';

interface SignUpPageProps {
  onBack: () => void;
  onSignIn: () => void;
  onSignUp: (email: string, password: string, fullName: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onBack, onSignIn, onSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) return;
    setIsLoading(true);
    await onSignUp(email, password, fullName);
    setIsLoading(false);
  };

  const handleGoogleSignUp = () => {
    // This would integrate with Supabase Google OAuth
    console.log('Google Sign Up');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#2F4FE0] via-[#63B3ED] to-[#3AB795] flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-md w-full">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <button 
              onClick={onBack}
              className="absolute top-6 left-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="relative">
                <Quote className="h-8 w-8 text-[#2F4FE0]" />
                <Sparkles className="h-4 w-4 text-[#63B3ED] absolute -top-1 -right-1" />
              </div>
              <h1 className="text-2xl font-bold text-[#2F4FE0] font-['Poppins']">QUOTABLE</h1>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-600">Start your AI-powered growth journey</p>
          </div>

          {/* Google Sign Up */}
          <button 
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-6"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium text-gray-700">Continue with Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4FE0] focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4FE0] focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4FE0] focus:border-transparent"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <button
                type="button"
                onClick={() => setAcceptTerms(!acceptTerms)}
                className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  acceptTerms ? 'bg-[#2F4FE0] border-[#2F4FE0]' : 'border-gray-300'
                }`}
              >
                {acceptTerms && <Check className="h-3 w-3 text-white" />}
              </button>
              <p className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-[#2F4FE0] hover:text-[#63B3ED]">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[#2F4FE0] hover:text-[#63B3ED]">Privacy Policy</a>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !acceptTerms}
              className="w-full bg-gradient-to-r from-[#2F4FE0] to-[#63B3ED] text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <button onClick={onSignIn} className="text-[#2F4FE0] hover:text-[#63B3ED] font-medium">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};