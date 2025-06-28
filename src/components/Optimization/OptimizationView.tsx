import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  MessageSquare, 
  Target,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import { getCampaigns, Campaign } from '../../lib/campaigns';
import { 
  getPerformanceAnalysis, 
  getRootCauseAnalysis, 
  getPredictiveModel, 
  getOptimizationSuggestions 
} from '../../lib/analytics';

interface Recommendation {
  id: string;
  type: 'tone' | 'timing' | 'content' | 'targeting';
  title: string;
  description: string;
  expectedImprovement: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'applied' | 'testing';
}

const culturalInsights = [
  {
    region: 'Germany',
    insights: [
      'Prefer detailed, data-driven proposals',
      'Formal business language required',
      'Emphasize compliance and risk reduction'
    ],
    color: 'from-blue-500 to-blue-600'
  },
  {
    region: 'Japan',
    insights: [
      'Relationship-building is crucial',
      'Indirect communication style preferred',
      'Group consensus in decision making'
    ],
    color: 'from-green-500 to-green-600'
  },
  {
    region: 'Brazil',
    insights: [
      'Personal connections drive business',
      'Warm, friendly communication tone',
      'Visual presentations preferred'
    ],
    color: 'from-orange-500 to-orange-600'
  }
];

export const OptimizationView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [stats, setStats] = useState({
    projectedImpact: 0,
    recommendationsCount: 0,
    highPriorityCount: 0
  });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchOptimizations();
  }, []);

  const fetchOptimizations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all campaigns
      const campaigns = await getCampaigns();
      
      if (campaigns.length === 0) {
        setRecommendations([]);
        setStats({
          projectedImpact: 0,
          recommendationsCount: 0,
          highPriorityCount: 0
        });
        setLoading(false);
        return;
      }
      
      // Process each campaign to get optimization recommendations
      const allRecommendations: Recommendation[] = [];
      let totalImprovementPercentage = 0;
      
      for (const campaign of campaigns) {
        try {
          // Get performance analysis
          const performanceAnalysis = await getPerformanceAnalysis(campaign);
          
          // Get root cause analysis
          const rootCauseAnalysis = await getRootCauseAnalysis(campaign, performanceAnalysis);
          
          // Get predictive model
          const predictiveModel = await getPredictiveModel(campaign, performanceAnalysis);
          
          // Get optimization suggestions
          const optimizationSuggestions = await getOptimizationSuggestions(
            campaign,
            rootCauseAnalysis,
            predictiveModel
          );
          
          totalImprovementPercentage += optimizationSuggestions.expectedImprovement;
          
          // Map suggestions to recommendations
          const campaignRecommendations = rootCauseAnalysis.issues.map((issue, index) => {
            // Determine recommendation type based on issue category
            const type = issue.category as 'tone' | 'timing' | 'content' | 'targeting';
            
            // Determine priority based on severity
            const priority = issue.severity as 'high' | 'medium' | 'low';
            
            // Get a suggestion from the optimization suggestions
            const suggestion = optimizationSuggestions.suggestions[index % optimizationSuggestions.suggestions.length];
            
            return {
              id: `${campaign.id}-rec-${index}`,
              type,
              title: `${type.charAt(0).toUpperCase() + type.slice(1)} optimization for ${campaign.name}`,
              description: suggestion || issue.description,
              expectedImprovement: Math.round(issue.impact * 2) / 2, // Round to nearest 0.5
              priority,
              status: 'pending' as 'pending' | 'applied' | 'testing'
            };
          });
          
          allRecommendations.push(...campaignRecommendations);
        } catch (err) {
          console.error(`Error processing campaign ${campaign.id}:`, err);
          // Continue with other campaigns
        }
      }
      
      // Sort recommendations by priority and expected improvement
      allRecommendations.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return b.expectedImprovement - a.expectedImprovement;
      });
      
      // Update state
      setRecommendations(allRecommendations);
      
      // Calculate stats
      const avgImprovementPercentage = campaigns.length > 0 
        ? totalImprovementPercentage / campaigns.length 
        : 0;
      
      const highPriorityCount = allRecommendations.filter(rec => rec.priority === 'high').length;
      
      setStats({
        projectedImpact: Math.round(avgImprovementPercentage),
        recommendationsCount: allRecommendations.length,
        highPriorityCount
      });
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching optimizations:', err);
      setError('Failed to load optimization recommendations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInsights = async () => {
    try {
      setIsGenerating(true);
      await fetchOptimizations();
    } catch (err) {
      console.error('Error generating insights:', err);
      setError('Failed to generate new insights. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyRecommendation = (id: string) => {
    // In a real implementation, we would call an API to apply the recommendation
    // For the MVP, we'll just update the status locally
    setRecommendations(prevRecs => 
      prevRecs.map(rec => 
        rec.id === id ? { ...rec, status: 'applied' as const } : rec
      )
    );
  };

  const handleDismissRecommendation = (id: string) => {
    // Remove the recommendation from the list
    setRecommendations(prevRecs => prevRecs.filter(rec => rec.id !== id));
    
    // Update stats
    setStats(prevStats => ({
      ...prevStats,
      recommendationsCount: prevStats.recommendationsCount - 1,
      highPriorityCount: recommendations.find(rec => rec.id === id && rec.priority === 'high') 
        ? prevStats.highPriorityCount - 1 
        : prevStats.highPriorityCount
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tone': return MessageSquare;
      case 'timing': return Clock;
      case 'content': return Brain;
      case 'targeting': return Target;
      default: return Brain;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tone': return 'text-[#2F4FE0] bg-[#2F4FE0]/10';
      case 'timing': return 'text-[#3AB795] bg-[#3AB795]/10';
      case 'content': return 'text-[#63B3ED] bg-[#63B3ED]/10';
      case 'targeting': return 'text-orange-500 bg-orange-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'text-green-600 bg-green-100';
      case 'testing': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) return `${diffSecs} seconds ago`;
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2F4FE0] mb-3"></div>
          <p className="text-[#475569]">Loading optimization recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 space-y-4 bg-[#F8FAFC] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">AI Optimization Engine</h2>
          <p className="text-[#475569] text-sm">Prescriptive insights to improve campaign performance</p>
        </div>
        
        <button 
          className={`
            flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-[#2F4FE0] to-[#63B3ED] 
            text-white rounded-lg font-medium transition-all duration-200 text-sm
            ${isGenerating ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md hover:scale-105'}
          `}
          onClick={handleGenerateInsights}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Brain className="h-4 w-4" />
              <span>Generate New Insights</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* AI Status Banner */}
      <div className="bg-gradient-to-r from-[#2F4FE0]/10 to-[#63B3ED]/5 rounded-lg p-4 border border-[#2F4FE0]/20">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-[#2F4FE0] to-[#63B3ED] rounded-full flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">AI Analysis Complete</h3>
            <p className="text-[#475569] text-xs">
              {recommendations.length > 0 ? (
                <>
                  Found {stats.recommendationsCount} optimization opportunities with potential 
                  <span className="font-semibold text-[#3AB795]"> +{stats.projectedImpact}% improvement</span> in overall performance.
                </>
              ) : (
                'No campaigns found. Create campaigns to get optimization recommendations.'
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#475569]">Last updated</p>
            <p className="text-xs font-medium text-gray-900">{formatTimeAgo(lastUpdated)}</p>
          </div>
        </div>
      </div>

      {/* Performance Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">Projected Impact</h3>
            <TrendingUp className="h-4 w-4 text-[#3AB795]" />
          </div>
          <p className="text-2xl font-bold text-[#3AB795]">+{stats.projectedImpact}%</p>
          <p className="text-xs text-[#475569]">Overall campaign performance</p>
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">Recommendations</h3>
            <Lightbulb className="h-4 w-4 text-[#2F4FE0]" />
          </div>
          <p className="text-2xl font-bold text-[#2F4FE0]">{stats.recommendationsCount}</p>
          <p className="text-xs text-[#475569]">Actionable insights available</p>
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">Priority Actions</h3>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-500">{stats.highPriorityCount}</p>
          <p className="text-xs text-[#475569]">High-priority optimizations</p>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Optimization Recommendations</h3>
        </div>
        
        <div className="flex-1 overflow-auto divide-y divide-gray-200">
          {recommendations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <AlertCircle className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 mb-1">No recommendations found</p>
              <p className="text-sm text-gray-400">
                Create and run campaigns to get AI-powered optimization recommendations
              </p>
            </div>
          ) : (
            recommendations.map((rec) => {
              const Icon = getTypeIcon(rec.type);
              return (
                <div key={rec.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(rec.type)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">{rec.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(rec.priority)}`}>
                              {rec.priority} priority
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(rec.status)}`}>
                              {rec.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right ml-3">
                          <p className="text-lg font-bold text-[#3AB795]">+{rec.expectedImprovement}%</p>
                          <p className="text-xs text-[#475569]">Expected improvement</p>
                        </div>
                      </div>
                      
                      <p className="text-[#475569] mb-3 text-sm">{rec.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-[#475569] capitalize">{rec.type} optimization</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {rec.status === 'pending' && (
                            <>
                              <button 
                                className="px-2 py-1 text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => handleDismissRecommendation(rec.id)}
                              >
                                Dismiss
                              </button>
                              <button 
                                className="flex items-center space-x-1 px-2 py-1 text-xs bg-[#2F4FE0] text-white rounded-lg hover:bg-[#2F4FE0]/90 transition-colors"
                                onClick={() => handleApplyRecommendation(rec.id)}
                              >
                                <span>Apply</span>
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            </>
                          )}
                          {rec.status === 'applied' && (
                            <div className="flex items-center space-x-1 text-xs text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              <span>Applied</span>
                            </div>
                          )}
                          {rec.status === 'testing' && (
                            <div className="flex items-center space-x-1 text-xs text-blue-600">
                              <Clock className="h-3 w-3" />
                              <span>Testing</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Cultural Intelligence */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Cross-Cultural Intelligence</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {culturalInsights.map((culture) => (
            <div key={culture.region} className="space-y-3">
              <div className={`bg-gradient-to-r ${culture.color} rounded-lg p-3 text-white`}>
                <h4 className="font-semibold text-sm">{culture.region}</h4>
                <p className="text-xs opacity-90">Communication Preferences</p>
              </div>
              
              <div className="space-y-2">
                {culture.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-1 h-1 rounded-full bg-[#2F4FE0] mt-2 flex-shrink-0" />
                    <p className="text-xs text-[#475569]">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};