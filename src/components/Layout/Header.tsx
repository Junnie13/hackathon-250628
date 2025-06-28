import React from 'react';
import { Quote, Sparkles, LogOut } from 'lucide-react';

interface HeaderProps {
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSignOut }) => {
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-2 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Quote className="h-6 w-6 text-[#2F4FE0]" />
            <Sparkles className="h-3 w-3 text-[#63B3ED] absolute -top-1 -right-1" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#2F4FE0] font-['Poppins']">QUOTABLE</h1>
            <p className="text-xs text-[#475569] font-medium">AI Marketing Intelligence</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-4 text-xs text-[#475569]">
            <span className="font-medium">New Markets.</span>
            <span className="font-medium">Smarter Funnels.</span>
            <span className="font-medium text-[#3AB795]">More Quotes.</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2F4FE0] to-[#63B3ED] flex items-center justify-center">
              <span className="text-white font-semibold text-xs">Q</span>
            </div>
            {onSignOut && (
              <button 
                onClick={onSignOut}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};