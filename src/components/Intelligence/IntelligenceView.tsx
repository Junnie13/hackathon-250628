import React, { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp, 
  Globe, 
  BarChart3,
  Users,
  MessageSquare,
  ArrowUpRight,
  Eye,
  Loader2
} from 'lucide-react';
import { sendOpenAIRequest } from '../../lib/openai';
import { getDashboardAnalytics } from '../../lib/analytics';

// Types for market intelligence data
interface Competitor {
  name: string;
  marketShare: number;
  avgOpenRate: number;
  msgVolume: string;
  primaryRegion: string;
  threat: 'High' | 'Medium' | 'Low';
}

interface MarketOpportunity {
  region: string;
  potential: 'High' | 'Medium' | 'Low';
  competition: string;
  entryScore: number;
  insights: string[];
}

interface IndustryTrend {
  trend: string;
  growth: string;
  relevance: 'High' | 'Medium' | 'Low';
  timeframe: string;
}

interface IntelligenceData {
  competitors: Competitor[];
  marketOpportunities: MarketOpportunity[];
  industryTrends: IndustryTrend[];
  strategicRecommendations: {
    immediate: string[];
    strategic: string[];
  };
}

// Initial mock data (will be replaced with AI-generated data)
const initialCompetitorData: Competitor[] = [
  {
    name: 'InsureTech Solutions',
    marketShare: 23,
    avgOpenRate: 19.2,
    msgVolume: 'High',
    primaryRegion: 'North America',
    threat: 'Medium'
  },
  {
    name: 'Global Risk Partners',
    marketShare: 18,
    avgOpenRate: 22.7,
    msgVolume: 'Medium',
    primaryRegion: 'Europe',
    threat: 'High'
  },
  {
    name: 'Asian Insurance Hub',
    marketShare: 15,
    avgOpenRate: 16.8,
    msgVolume: 'Low',
    primaryRegion: 'Asia Pacific',
    threat: 'Low'
  }
];

const initialMarketOpportunities: MarketOpportunity[] = [
  {
    region: 'Scandinavia',
    potential: 'High',
    competition: 'Low',
    entryScore: 8.4,
    insights: ['Strong digital adoption', 'English-friendly business culture', 'High insurance penetration']
  },
  {
    region: 'Southeast Asia',
    potential: 'Medium',
    competition: 'Medium',
    entryScore: 7.2,
    insights: ['Growing insurance market', 'Language barriers exist', 'Price-sensitive buyers']
  }
];

const initialIndustryTrends: IndustryTrend[] = [
  {
    trend: 'AI-Powered Risk Assessment',
    growth: '+145%',
    relevance: 'High',
    timeframe: '6 months'
  },
  {
    trend: 'Parametric Insurance Products',
    growth: '+89%',
    relevance: 'Medium',
    timeframe: '12 months'
  }
];

export const IntelligenceView: React.FC = () => {
  // State for intelligence data
  const [intelligenceData, setIntelligenceData] = useState<IntelligenceData>({
    competitors: initialCompetitorData,
    marketOpportunities: initialMarketOpportunities,
    industryTrends: initialIndustryTrends,
    strategicRecommendations: {
      immediate: [
        'Target Scandinavian insurance executives with formal, data-driven messaging',
        'Develop AI risk assessment value propositions for Q2 campaigns'
      ],
      strategic: [
        'Build partnerships in Southeast Asian markets before competition intensifies',
        'Develop climate risk analytics positioning for enterprise clients'
      ]
    }
  });

  // State for analytics data
  const [analyticsData, setAnalyticsData] = useState({
    marketCoverage: 67,
    marketCoverageChange: 8,
    competitiveEdge: 24,
    newOpportunities: 12,
    trendAlignment: 89
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch analytics data on component mount
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        const dashboardData = await getDashboardAnalytics();
        
        // Update analytics data based on dashboard data
        setAnalyticsData({
          marketCoverage: Math.round((dashboardData.qualifiedLeads / dashboardData.totalLeads) * 100),
          marketCoverageChange: 8, // Mock change value
          competitiveEdge: Math.round((dashboardData.avgResponseRate / dashboardData.avgOpenRate) * 100),
          newOpportunities: 12, // Mock value
          trendAlignment: 89 // Mock value
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Function to generate market intelligence report using OpenAI
  const generateMarketReport = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Create system prompt for OpenAI
      const systemPrompt = `You are an expert market intelligence analyst for the insurance industry.
      Generate a comprehensive market intelligence report with the following sections:
      1. Competitive Landscape - Analyze 3-4 key competitors with their market share, messaging volume, and threat level
      2. Market Opportunities - Identify 2-3 high-potential regions with entry scores and key insights
      3. Industry Trends - Highlight 2-3 emerging trends with growth rates and relevance
      4. Strategic Recommendations - Provide immediate (30-day) and strategic (90-day) action items

      Format the response as a JSON object with the following structure:
      {
        "competitors": [
          {
            "name": "Competitor Name",
            "marketShare": number,
            "avgOpenRate": number,
            "msgVolume": "High|Medium|Low",
            "primaryRegion": "Region Name",
            "threat": "High|Medium|Low"
          }
        ],
        "marketOpportunities": [
          {
            "region": "Region Name",
            "potential": "High|Medium|Low",
            "competition": "High|Medium|Low",
            "entryScore": number,
            "insights": ["Insight 1", "Insight 2", "Insight 3"]
          }
        ],
        "industryTrends": [
          {
            "trend": "Trend Name",
            "growth": "Growth Rate (e.g., +145%)",
            "relevance": "High|Medium|Low",
            "timeframe": "Timeframe (e.g., 6 months)"
          }
        ],
        "strategicRecommendations": {
          "immediate": ["Action 1", "Action 2"],
          "strategic": ["Strategy 1", "Strategy 2"]
        }
      }`;

      const userPrompt = `Generate a market intelligence report for an insurance technology company focusing on international lead generation and marketing campaign optimization.`;

      // Send request to OpenAI
      const response = await sendOpenAIRequest(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        undefined, // Use default model
        0.7 // Temperature
      );

      // Parse the response
      try {
        const parsedResponse = JSON.parse(response);
        setIntelligenceData(parsedResponse);
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        setError('Failed to parse the generated report. Please try again.');
      }

      setIsGenerating(false);
    } catch (err) {
      console.error('Error generating market report:', err);
      setError('Failed to generate market report. Please try again later.');
      setIsGenerating(false);
    }
  };

  // Helper functions for styling
  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-orange-600 bg-orange-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'High': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-orange-600 bg-orange-100';
      case 'Low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case 'High': return 'text-[#2F4FE0] bg-[#2F4FE0]/10';
      case 'Medium': return 'text-[#63B3ED] bg-[#63B3ED]/10';
      case 'Low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="flex-1 p-4 space-y-4 bg-[#F8FAFC] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Market Intelligence</h2>
          <p className="text-[#475569] text-sm">Competitive analysis and market penetration insights</p>
        </div>
        
        <button 
          className={`flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-[#2F4FE0] to-[#63B3ED] text-white rounded-lg font-medium hover:shadow-md ${isGenerating ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'} transition-all duration-200 text-sm`}
          onClick={generateMarketReport}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating Report...</span>
            </>
          ) : (
            <>
              <Target className="h-4 w-4" />
              <span>Generate Market Report</span>
            </>
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#2F4FE0]" />
          <span className="ml-2 text-[#475569]">Loading intelligence data...</span>
        </div>
      ) : (
        <>
          {/* Intelligence Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-[#2F4FE0]/10 to-[#63B3ED]/5 rounded-lg p-3 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#475569] mb-1">Market Coverage</p>
                  <p className="text-lg font-bold text-gray-900">{analyticsData.marketCoverage}%</p>
                  <p className="text-xs text-[#3AB795] flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +{analyticsData.marketCoverageChange}% this quarter
                  </p>
                </div>
                <Globe className="h-6 w-6 text-[#2F4FE0]" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#3AB795]/10 to-[#3AB795]/5 rounded-lg p-3 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#475569] mb-1">Competitive Edge</p>
                  <p className="text-lg font-bold text-gray-900">+{analyticsData.competitiveEdge}%</p>
                  <p className="text-xs text-[#3AB795] flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Above avg performance
                  </p>
                </div>
                <BarChart3 className="h-6 w-6 text-[#3AB795]" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-400/5 rounded-lg p-3 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#475569] mb-1">New Opportunities</p>
                  <p className="text-lg font-bold text-gray-900">{analyticsData.newOpportunities}</p>
                  <p className="text-xs text-[#475569]">High-potential markets</p>
                </div>
                <Target className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#63B3ED]/10 to-[#63B3ED]/5 rounded-lg p-3 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#475569] mb-1">Trend Alignment</p>
                  <p className="text-lg font-bold text-gray-900">{analyticsData.trendAlignment}%</p>
                  <p className="text-xs text-[#475569]">With industry direction</p>
                </div>
                <TrendingUp className="h-6 w-6 text-[#63B3ED]" />
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
            {/* Competitor Analysis */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 flex flex-col">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Competitive Landscape</h3>
              
              <div className="space-y-3 flex-1 overflow-auto">
                {intelligenceData.competitors.map((competitor) => (
                  <div key={competitor.name} className="p-3 rounded-lg border border-gray-200 hover:border-[#2F4FE0]/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{competitor.name}</h4>
                        <p className="text-xs text-[#475569]">Primary in {competitor.primaryRegion}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getThreatColor(competitor.threat)}`}>
                        {competitor.threat} threat
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="text-[#475569]">Market Share</p>
                        <p className="font-semibold text-gray-900">{competitor.marketShare}%</p>
                      </div>
                      <div>
                        <p className="text-[#475569]">Open Rate</p>
                        <p className="font-semibold text-gray-900">{competitor.avgOpenRate}%</p>
                      </div>
                      <div>
                        <p className="text-[#475569]">Msg Volume</p>
                        <p className="font-semibold text-gray-900">{competitor.msgVolume}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Opportunities */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 flex flex-col">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Market Opportunities</h3>
              
              <div className="space-y-3 flex-1 overflow-auto">
                {intelligenceData.marketOpportunities.map((market) => (
                  <div key={market.region} className="p-3 rounded-lg border border-gray-200 hover:border-[#3AB795]/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">{market.region}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPotentialColor(market.potential)}`}>
                            {market.potential} potential
                          </span>
                          <span className="text-xs text-[#475569]">Competition: {market.competition}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#3AB795]">{market.entryScore}</p>
                        <p className="text-xs text-[#475569]">Entry Score</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {market.insights.map((insight, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-1 h-1 rounded-full bg-[#3AB795] mt-2 flex-shrink-0" />
                          <p className="text-xs text-[#475569]">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Industry Trends */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Industry Trends & Opportunities</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {intelligenceData.industryTrends.map((trend) => (
                <div key={trend.trend} className="p-3 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm flex-1">{trend.trend}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRelevanceColor(trend.relevance)}`}>
                      {trend.relevance}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#475569]">Growth Rate</span>
                      <span className="text-sm font-bold text-[#3AB795]">{trend.growth}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#475569]">Timeframe</span>
                      <span className="text-xs font-medium text-gray-900">{trend.timeframe}</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-3 px-3 py-2 text-xs border border-[#2F4FE0] text-[#2F4FE0] rounded-lg hover:bg-[#2F4FE0] hover:text-white transition-colors">
                    Explore Opportunity
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Recommendations */}
          <div className="bg-gradient-to-r from-[#2F4FE0] to-[#63B3ED] rounded-lg p-4 text-white">
            <h3 className="text-sm font-semibold mb-3">Strategic Recommendations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Immediate Actions (Next 30 days)</h4>
                <div className="space-y-1 text-xs text-blue-100">
                  {intelligenceData.strategicRecommendations.immediate.map((action, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-1 h-1 rounded-full bg-white mt-2 flex-shrink-0" />
                      <p>{action}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Strategic Focus (Next 90 days)</h4>
                <div className="space-y-1 text-xs text-blue-100">
                  {intelligenceData.strategicRecommendations.strategic.map((strategy, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-1 h-1 rounded-full bg-white mt-2 flex-shrink-0" />
                      <p>{strategy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};