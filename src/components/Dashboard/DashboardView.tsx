import React, { useEffect, useState } from 'react';
import { StatsCard } from './StatsCard';
import { 
  Users, 
  Mail, 
  TrendingUp, 
  Globe, 
  Target,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getDashboardAnalytics } from '../../lib/analytics';

export const DashboardView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<{
    totalLeads: number;
    qualifiedLeads: number;
    activeCampaigns: number;
    avgOpenRate: number;
    avgClickRate: number;
    avgResponseRate: number;
    topPerformingRegion: string;
    conversionTrend: {
      date: string;
      conversions: number;
      leads: number;
    }[];
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getDashboardAnalytics();
        setAnalytics(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard analytics:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Mock data for regional performance
  const regionData = [
    { region: 'North America', leads: 145, conversion: 18.2 },
    { region: 'Europe', leads: 128, conversion: 22.1 },
    { region: 'Asia Pacific', leads: 97, conversion: 15.8 },
    { region: 'Latin America', leads: 64, conversion: 19.5 },
  ];

  if (loading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2F4FE0] mb-3"></div>
          <p className="text-[#475569]">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center bg-[#F8FAFC]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-4 bg-[#F8FAFC] overflow-hidden">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#2F4FE0] to-[#63B3ED] rounded-lg p-4 text-white">
        <h2 className="text-lg font-bold mb-1">Welcome to Quotable</h2>
        <p className="text-blue-100 mb-3 text-sm">Your AI strategist for global growth and intelligent lead generation</p>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span>AI-Powered Targeting</span>
          </div>
          <div className="flex items-center space-x-1">
            <Globe className="h-3 w-3" />
            <span>Cross-Cultural Intelligence</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="h-3 w-3" />
            <span>Prescriptive Optimization</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard
          title="Total Leads"
          value={analytics?.totalLeads.toLocaleString() || "0"}
          subtitle="across all campaigns"
          icon={Users}
          trend={{ value: 12.5, isPositive: true }}
          color="blue"
        />
        <StatsCard
          title="Active Campaigns"
          value={analytics?.activeCampaigns.toString() || "0"}
          subtitle="generating leads"
          icon={Mail}
          trend={{ value: 2.1, isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Avg Open Rate"
          value={`${analytics?.avgOpenRate.toFixed(1)}%` || "0%"}
          subtitle="above industry avg"
          icon={TrendingUp}
          trend={{ value: 4.2, isPositive: true }}
          color="orange"
        />
        <StatsCard
          title="Top Market"
          value={analytics?.topPerformingRegion || "N/A"}
          subtitle="22.1% conversion"
          icon={Globe}
          color="blue"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Conversion Trend */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Conversion Trend</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.conversionTrend || []}>
                <XAxis dataKey="date" fontSize={10} />
                <YAxis fontSize={10} />
                <Area 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#2F4FE0" 
                  fill="url(#colorGradient)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F4FE0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2F4FE0" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Performance */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Regional Performance</h3>
          <div className="space-y-3">
            {regionData.map((region) => (
              <div key={region.region} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-900">{region.region}</span>
                    <span className="text-xs text-[#475569]">{region.conversion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-[#2F4FE0] to-[#63B3ED] h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${(region.conversion / 25) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#475569] mt-1">{region.leads} leads</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="flex items-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-[#2F4FE0] to-[#63B3ED] text-white hover:shadow-md transition-all duration-200 hover:scale-105">
            <Users className="h-4 w-4" />
            <span className="font-medium text-sm">Scrape New Leads</span>
          </button>
          <button className="flex items-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-[#3AB795] to-[#3AB795] text-white hover:shadow-md transition-all duration-200 hover:scale-105">
            <Mail className="h-4 w-4" />
            <span className="font-medium text-sm">Launch Campaign</span>
          </button>
          <button className="flex items-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-[#F56565] to-[#F56565] text-white hover:shadow-md transition-all duration-200 hover:scale-105">
            <TrendingUp className="h-4 w-4" />
            <span className="font-medium text-sm">Optimize Existing</span>
          </button>
        </div>
      </div>
    </div>
  );
};