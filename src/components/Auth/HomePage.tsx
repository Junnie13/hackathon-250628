import React from 'react';
import { Quote, Sparkles, Globe, Target, Brain, TrendingUp, Users, Mail, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSignIn, onSignUp }) => {
  return (
    <div className="h-screen bg-gradient-to-br from-[#2F4FE0] via-[#63B3ED] to-[#3AB795] flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Hero Content */}
        <div className="text-white space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="relative">
              <Quote className="h-12 w-12 text-white" />
              <Sparkles className="h-6 w-6 text-yellow-300 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-['Poppins']">QUOTABLE</h1>
              <p className="text-blue-100 font-medium">AI Marketing Intelligence</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">New Markets.</h2>
            <h2 className="text-3xl font-bold">Smarter Funnels.</h2>
            <h2 className="text-3xl font-bold text-yellow-300">More Quotes.</h2>
          </div>
          
          <p className="text-xl text-blue-100 leading-relaxed">
            AI-powered lead generation and campaign optimization for global expansion. 
            Stop guessing, start converting.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={onSignUp}
              className="px-8 py-3 bg-white text-[#2F4FE0] rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Get Started Free
            </button>
            <button 
              onClick={onSignIn}
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#2F4FE0] transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
        
        {/* Right Side - Features Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <Users className="h-8 w-8 text-yellow-300 mb-3" />
            <h3 className="text-white font-semibold mb-2">Smart Lead Gen</h3>
            <p className="text-blue-100 text-sm">AI scrapes & qualifies leads from LinkedIn and Google Maps</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <Mail className="h-8 w-8 text-yellow-300 mb-3" />
            <h3 className="text-white font-semibold mb-2">Auto Campaigns</h3>
            <p className="text-blue-100 text-sm">Culturally-adapted emails that convert across regions</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <TrendingUp className="h-8 w-8 text-yellow-300 mb-3" />
            <h3 className="text-white font-semibold mb-2">Live Analytics</h3>
            <p className="text-blue-100 text-sm">Real-time performance tracking and optimization insights</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <Brain className="h-8 w-8 text-yellow-300 mb-3" />
            <h3 className="text-white font-semibold mb-2">AI Optimizer</h3>
            <p className="text-blue-100 text-sm">Prescriptive recommendations for better campaigns</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 col-span-2">
            <div className="flex items-center space-x-3 mb-3">
              <Globe className="h-8 w-8 text-yellow-300" />
              <Target className="h-8 w-8 text-yellow-300" />
            </div>
            <h3 className="text-white font-semibold mb-2">Market Intelligence</h3>
            <p className="text-blue-100 text-sm">Cross-cultural insights and competitive analysis for global expansion</p>
          </div>
        </div>
      </div>
    </div>
  );
};