import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Eye, 
  MousePointer, 
  MessageSquare,
  Globe,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getDashboardAnalytics } from '../../lib/analytics';
import { getCampaigns } from '../../lib/campaigns';

export const AnalyticsView: React.FC = () => {
  const [timeframe, setTimeframe] = useState('30');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  
  const [industryData, setIndustryData] = useState([
    { industry: 'Insurance', campaigns: 12, avgOpen: 28.4, avgClick: 12.1 },
    { industry: 'Financial Services', campaigns: 8, avgOpen: 24.7, avgClick: 10.8 },
    { industry: 'Healthcare', campaigns: 6, avgOpen: 31.2, avgClick: 14.3 },
    { industry: 'Technology', campaigns: 4, avgOpen: 26.9, avgClick: 11.7 },
  ]);

  // Performance data for the chart
  const [performanceData, setPerformanceData] = useState([
    { date: 'Jan', opens: 2400, clicks: 1200, responses: 340 },
    { date: 'Feb', opens: 2210, clicks: 1398, responses: 400 },
    { date: 'Mar', opens: 2290, clicks: 1800, responses: 520 },
    { date: 'Apr', opens: 2000, clicks: 1908, responses: 610 },
    { date: 'May', opens: 2181, clicks: 1800, responses: 580 },
    { date: 'Jun', opens: 2500, clicks: 2100, responses: 720 },
  ]);

  // Region data for the pie chart
  const [regionData, setRegionData] = useState([
    { name: 'North America', value: 35, color: '#2F4FE0' },
    { name: 'Europe', value: 30, color: '#63B3ED' },
    { name: 'Asia Pacific', value: 25, color: '#3AB795' },
    { name: 'Latin America', value: 10, color: '#F56565' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch analytics data
        const analyticsData = await getDashboardAnalytics();
        setAnalytics(analyticsData);
        
        // Fetch campaigns to calculate industry performance
        const campaigns = await getCampaigns();
        
        // Group campaigns by industry and calculate averages
        const industries = new Map();
        
        campaigns.forEach(campaign => {
          const industry = campaign.targetIndustry;
          if (!industries.has(industry)) {
            industries.set(industry, {
              industry,
              campaigns: 1,
              totalOpen: campaign.openRate,
              totalClick: campaign.clickRate
            });
          } else {
            const data = industries.get(industry);
            industries.set(industry, {
              ...data,
              campaigns: data.campaigns + 1,
              totalOpen: data.totalOpen + campaign.openRate,
              totalClick: data.totalClick + campaign.clickRate
            });
          }
        });
        
        // Convert to array and calculate averages
        const industryPerformance = Array.from(industries.values()).map(data => ({
          industry: data.industry,
          campaigns: data.campaigns,
          avgOpen: data.totalOpen / data.campaigns,
          avgClick: data.totalClick / data.campaigns
        }));
        
        if (industryPerformance.length > 0) {
          setIndustryData(industryPerformance);
        }
        
        // Create region distribution data
        const regionCounts = new Map();
        let totalCampaigns = 0;
        
        campaigns.forEach(campaign => {
          const region = campaign.targetRegion;
          totalCampaigns++;
          if (!regionCounts.has(region)) {
            regionCounts.set(region, 1);
          } else {
            regionCounts.set(region, regionCounts.get(region) + 1);
          }
        });
        
        if (totalCampaigns > 0) {
          const colors = ['#2F4FE0', '#63B3ED', '#3AB795', '#F56565'];
          const regionDistribution = Array.from(regionCounts.entries())
            .map(([name, count], index) => ({
              name,
              value: Math.round((count / totalCampaigns) * 100),
              color: colors[index % colors.length]
            }));
          
          if (regionDistribution.length > 0) {
            setRegionData(regionDistribution);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2F4FE0] mb-3"></div>
          <p className="text-[#475569]">Loading analytics data...</p>
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
    <div className="flex-1 p-4 space-y-4 bg-[#F8FAFC] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-[#475569] text-sm">Comprehensive performance insights and trends</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4FE0] focus:border-transparent text-sm"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
            <Calendar className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-[#2F4FE0]/10 to-[#63B3ED]/5 rounded-lg p-3 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#475569] mb-1">Total Campaigns</p>
              <p className="text-lg font-bold text-gray-900">{analytics?.activeCampaigns || 0}</p>
              <p className="text-xs text-[#3AB795] flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% vs last month
              </p>
            </div>
            <TrendingUp className="h-6 w-6 text-[#2F4FE0]" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#3AB795]/10 to-[#3AB795]/5 rounded-lg p-3 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#475569] mb-1">Avg Open Rate</p>
              <p className="text-lg font-bold text-gray-900">{analytics?.avgOpenRate.toFixed(1)}%</p>
              <p className="text-xs text-[#3AB795] flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3.4% vs industry
              </p>
            </div>
            <Eye className="h-6 w-6 text-[#3AB795]" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#63B3ED]/10 to-[#63B3ED]/5 rounded-lg p-3 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#475569] mb-1">Avg Click Rate</p>
              <p className="text-lg font-bold text-gray-900">{analytics?.avgClickRate.toFixed(1)}%</p>
              <p className="text-xs text-[#3AB795] flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +1.8% vs last month
              </p>
            </div>
            <MousePointer className="h-6 w-6 text-[#63B3ED]" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-400/5 rounded-lg p-3 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#475569] mb-1">Response Rate</p>
              <p className="text-lg font-bold text-gray-900">{analytics?.avgResponseRate.toFixed(1)}%</p>
              <p className="text-xs text-[#3AB795] flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.7% vs last month
              </p>
            </div>
            <MessageSquare className="h-6 w-6 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Performance Trend */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Performance Trend</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <XAxis dataKey="date" fontSize={10} />
                <YAxis fontSize={10} />
                <Line 
                  type="monotone" 
                  dataKey="opens" 
                  stroke="#2F4FE0" 
                  strokeWidth={2}
                  dot={{ fill: '#2F4FE0', strokeWidth: 2, r: 3 }}
                  name="Opens"
                />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#63B3ED" 
                  strokeWidth={2}
                  dot={{ fill: '#63B3ED', strokeWidth: 2, r: 3 }}
                  name="Clicks"
                />
                <Line 
                  type="monotone" 
                  dataKey="responses" 
                  stroke="#3AB795" 
                  strokeWidth={2}
                  dot={{ fill: '#3AB795', strokeWidth: 2, r: 3 }}
                  name="Responses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Regional Distribution</h3>
          <div className="flex items-center justify-center h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {regionData.map((region) => (
              <div key={region.name} className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: region.color }}
                />
                <span className="text-xs text-[#475569] truncate">{region.name}</span>
                <span className="text-xs font-medium text-gray-900">{region.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Industry Performance */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 flex-1 min-h-0 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Industry Performance</h3>
        
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-xs font-medium text-[#475569]">Industry</th>
                <th className="text-left py-2 text-xs font-medium text-[#475569]">Campaigns</th>
                <th className="text-left py-2 text-xs font-medium text-[#475569]">Avg Open Rate</th>
                <th className="text-left py-2 text-xs font-medium text-[#475569]">Avg Click Rate</th>
                <th className="text-left py-2 text-xs font-medium text-[#475569]">Performance</th>
              </tr>
            </thead>
            <tbody>
              {industryData.map((industry) => (
                <tr key={industry.industry} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3">
                    <span className="font-medium text-gray-900 text-sm">{industry.industry}</span>
                  </td>
                  <td className="py-3">
                    <span className="text-[#475569] text-sm">{industry.campaigns}</span>
                  </td>
                  <td className="py-3">
                    <span className="font-medium text-[#2F4FE0] text-sm">{industry.avgOpen.toFixed(1)}%</span>
                  </td>
                  <td className="py-3">
                    <span className="font-medium text-[#63B3ED] text-sm">{industry.avgClick.toFixed(1)}%</span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                        <div 
                          className="bg-gradient-to-r from-[#2F4FE0] to-[#63B3ED] h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${(industry.avgOpen / 35) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#475569]">
                        {industry.avgOpen > 28 ? 'Excellent' : industry.avgOpen > 24 ? 'Good' : 'Average'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-[#2F4FE0] to-[#63B3ED] rounded-lg p-4 text-white">
        <h3 className="text-sm font-semibold mb-3">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-blue-100 text-xs mb-1">Best Performing Region</p>
            <p className="text-lg font-bold">{analytics?.topPerformingRegion || 'N/A'}</p>
            <p className="text-blue-100 text-xs">31.2% open rate, 22% above average</p>
          </div>
          <div>
            <p className="text-blue-100 text-xs mb-1">Optimal Send Time</p>
            <p className="text-lg font-bold">Tuesday 10 AM</p>
            <p className="text-blue-100 text-xs">Local timezone, +15% open rate</p>
          </div>
          <div>
            <p className="text-blue-100 text-xs mb-1">Top Subject Pattern</p>
            <p className="text-lg font-bold">Question + Benefit</p>
            <p className="text-blue-100 text-xs">28% higher engagement rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};