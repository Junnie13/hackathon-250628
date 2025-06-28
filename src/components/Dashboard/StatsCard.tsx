import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'orange' | 'red';
}

const colorClasses = {
  blue: {
    bg: 'bg-gradient-to-br from-[#2F4FE0]/10 to-[#63B3ED]/5',
    icon: 'text-[#2F4FE0]',
    trend: 'text-[#2F4FE0]'
  },
  green: {
    bg: 'bg-gradient-to-br from-[#3AB795]/10 to-[#3AB795]/5',
    icon: 'text-[#3AB795]',
    trend: 'text-[#3AB795]'
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-500/10 to-orange-400/5',
    icon: 'text-orange-500',
    trend: 'text-orange-500'
  },
  red: {
    bg: 'bg-gradient-to-br from-[#F56565]/10 to-[#F56565]/5',
    icon: 'text-[#F56565]',
    trend: 'text-[#F56565]'
  }
};

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  color = 'blue' 
}) => {
  const colors = colorClasses[color];
  
  return (
    <div className={`
      ${colors.bg} backdrop-blur-sm rounded-lg p-4 border border-white/20
      hover:shadow-md hover:shadow-black/5 transition-all duration-300
      hover:border-white/40 group cursor-pointer
    `}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[#475569] text-xs font-medium mb-1 truncate">{title}</p>
          <p className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#2F4FE0] transition-colors">
            {value}
          </p>
          {subtitle && (
            <p className="text-[#475569] text-xs truncate">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-1 text-xs font-medium ${
              trend.isPositive ? colors.trend : 'text-[#F56565]'
            }`}>
              <span>{trend.isPositive ? '↗' : '↘'}</span>
              <span className="ml-1">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={`${colors.icon} group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};