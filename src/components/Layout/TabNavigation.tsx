import React from 'react';
import { 
  BarChart3, 
  Users, 
  Mail, 
  TrendingUp, 
  Brain, 
  Target 
} from 'lucide-react';

export type TabType = 'dashboard' | 'leads' | 'campaigns' | 'analytics' | 'optimization' | 'intelligence';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'dashboard' as TabType, label: 'Dashboard', icon: BarChart3 },
  { id: 'leads' as TabType, label: 'Lead Gen', icon: Users },
  { id: 'campaigns' as TabType, label: 'Campaigns', icon: Mail },
  { id: 'analytics' as TabType, label: 'Analytics', icon: TrendingUp },
  { id: 'optimization' as TabType, label: 'Optimizer', icon: Brain },
  { id: 'intelligence' as TabType, label: 'Intelligence', icon: Target },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 flex-shrink-0">
      <div className="flex space-x-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                transition-all duration-200 hover:text-[#2F4FE0]
                ${isActive 
                  ? 'border-[#2F4FE0] text-[#2F4FE0]' 
                  : 'border-transparent text-[#475569] hover:border-[#63B3ED]'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};