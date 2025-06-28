import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Play, 
  Pause, 
  Eye, 
  MousePointer, 
  MessageSquare,
  Calendar,
  Globe,
  Plus,
  Edit,
  AlertCircle
} from 'lucide-react';
import { 
  Campaign, 
  getCampaigns, 
  pauseCampaign, 
  resumeCampaign, 
  getCampaignById 
} from '../../lib/campaigns';

export const CampaignView: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    avgOpenRate: 0,
    avgClickRate: 0,
    avgResponseRate: 0
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await getCampaigns();
      setCampaigns(data);
      
      // Calculate stats
      const activeCampaigns = data.filter(c => c.status === 'active').length;
      const avgOpenRate = data.length > 0 
        ? data.reduce((sum, c) => sum + c.openRate, 0) / data.length 
        : 0;
      const avgClickRate = data.length > 0 
        ? data.reduce((sum, c) => sum + c.clickRate, 0) / data.length 
        : 0;
      const avgResponseRate = data.length > 0 
        ? data.reduce((sum, c) => sum + c.responseRate, 0) / data.length 
        : 0;
      
      setStats({
        activeCampaigns,
        avgOpenRate,
        avgClickRate,
        avgResponseRate
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError('Failed to load campaigns. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePauseCampaign = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row selection
    try {
      await pauseCampaign(id);
      // Refresh campaigns
      fetchCampaigns();
    } catch (err) {
      console.error('Error pausing campaign:', err);
      setError('Failed to pause campaign. Please try again later.');
    }
  };

  const handleResumeCampaign = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row selection
    try {
      await resumeCampaign(id);
      // Refresh campaigns
      fetchCampaigns();
    } catch (err) {
      console.error('Error resuming campaign:', err);
      setError('Failed to resume campaign. Please try again later.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-orange-100 text-orange-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-3 w-3" />;
      case 'paused': return <Pause className="h-3 w-3" />;
      default: return <Calendar className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2F4FE0] mb-3"></div>
          <p className="text-[#475569]">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-4 bg-[#F8FAFC] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Campaign Management</h2>
          <p className="text-[#475569] text-sm">Create, monitor, and optimize your outreach campaigns</p>
        </div>
        
        <button className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-[#2F4FE0] to-[#63B3ED] text-white rounded-lg font-medium hover:shadow-md hover:scale-105 transition-all duration-200 text-sm">
          <Plus className="h-4 w-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Campaign Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#475569] mb-1">Active Campaigns</p>
              <p className="text-lg font-bold text-gray-900">{stats.activeCampaigns}</p>
            </div>
            <Play className="h-6 w-6 text-[#3AB795]" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#475569] mb-1">Avg Open Rate</p>
              <p className="text-lg font-bold text-gray-900">{stats.avgOpenRate.toFixed(1)}%</p>
            </div>
            <Eye className="h-6 w-6 text-[#2F4FE0]" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#475569] mb-1">Avg Click Rate</p>
              <p className="text-lg font-bold text-gray-900">{stats.avgClickRate.toFixed(1)}%</p>
            </div>
            <MousePointer className="h-6 w-6 text-[#63B3ED]" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#475569] mb-1">Response Rate</p>
              <p className="text-lg font-bold text-gray-900">{stats.avgResponseRate.toFixed(1)}%</p>
            </div>
            <MessageSquare className="h-6 w-6 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Your Campaigns</h3>
        </div>
        
        <div className="flex-1 overflow-auto divide-y divide-gray-200">
          {campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <AlertCircle className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 mb-1">No campaigns found</p>
              <p className="text-sm text-gray-400">
                Click 'New Campaign' to create your first campaign
              </p>
            </div>
          ) : (
            campaigns.map((campaign) => (
              <div 
                key={campaign.id} 
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedCampaign(campaign.id === selectedCampaign ? null : campaign.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{campaign.name}</h4>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                        {getStatusIcon(campaign.status)}
                        <span className="ml-1 capitalize">{campaign.status}</span>
                      </span>
                    </div>
                    
                    <p className="text-[#475569] mb-2 text-xs truncate">{campaign.subject}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-[#475569]">
                      <div className="flex items-center space-x-1">
                        <Globe className="h-3 w-3" />
                        <span>{campaign.targetRegion}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{campaign.leadsCount} leads</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 ml-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-[#2F4FE0]">{campaign.openRate.toFixed(1)}%</p>
                      <p className="text-xs text-[#475569]">Open</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-[#63B3ED]">{campaign.clickRate.toFixed(1)}%</p>
                      <p className="text-xs text-[#475569]">Click</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-[#3AB795]">{campaign.responseRate.toFixed(1)}%</p>
                      <p className="text-xs text-[#475569]">Response</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {campaign.status === 'active' ? (
                        <button 
                          className="flex items-center space-x-1 px-2 py-1 border border-orange-300 bg-orange-50 rounded-lg text-orange-700 hover:bg-orange-100 transition-colors text-xs"
                          onClick={(e) => handlePauseCampaign(campaign.id, e)}
                        >
                          <Pause className="h-3 w-3" />
                          <span>Pause</span>
                        </button>
                      ) : campaign.status === 'paused' ? (
                        <button 
                          className="flex items-center space-x-1 px-2 py-1 border border-green-300 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 transition-colors text-xs"
                          onClick={(e) => handleResumeCampaign(campaign.id, e)}
                        >
                          <Play className="h-3 w-3" />
                          <span>Resume</span>
                        </button>
                      ) : null}
                      
                      <button className="flex items-center space-x-1 px-2 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-xs">
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Expanded Details */}
                {selectedCampaign === campaign.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-[#2F4FE0]/10 to-[#63B3ED]/5 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-900 mb-2 text-sm">Performance Metrics</h5>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-[#475569]">Emails Sent:</span>
                            <span className="font-medium">{campaign.leadsCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#475569]">Opens:</span>
                            <span className="font-medium">{Math.round(campaign.leadsCount * campaign.openRate / 100)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#475569]">Clicks:</span>
                            <span className="font-medium">{Math.round(campaign.leadsCount * campaign.clickRate / 100)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#475569]">Responses:</span>
                            <span className="font-medium">{Math.round(campaign.leadsCount * campaign.responseRate / 100)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-[#3AB795]/10 to-[#3AB795]/5 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-900 mb-2 text-sm">AI Insights</h5>
                        <div className="space-y-1 text-xs text-[#475569]">
                          <p>• This message resonates 15% better than industry average</p>
                          <p>• Optimal send time: Tuesday 10 AM local time</p>
                          <p>• Consider adding more data-driven value props</p>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-orange-500/10 to-orange-400/5 rounded-lg p-3">
                        <h5 className="font-semibold text-gray-900 mb-2 text-sm">Optimization Suggestions</h5>
                        <div className="space-y-1 text-xs text-[#475569]">
                          <p>• Test shorter subject lines (+8% open rate)</p>
                          <p>• Add personalized company insights</p>
                          <p>• Include regional case studies</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};