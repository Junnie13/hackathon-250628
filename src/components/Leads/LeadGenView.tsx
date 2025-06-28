import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Building, 
  Mail, 
  CheckCircle, 
  AlertCircle,
  Download,
  Filter,
  Plus
} from 'lucide-react';
import { Lead, scrapeLeads, evaluateLeads, ScrapingOptions } from '../../lib/scraper';

export const LeadGenView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('Insurance');
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalLeads: 0,
    qualifiedLeads: 0,
    contactedLeads: 0,
    avgConfidence: 0
  });

  // Filter leads when search term or filters change
  useEffect(() => {
    if (leads.length === 0) {
      setFilteredLeads([]);
      return;
    }

    let filtered = [...leads];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(term) || 
        lead.company.toLowerCase().includes(term) || 
        lead.location.toLowerCase().includes(term)
      );
    }

    // Apply region filter
    if (selectedRegion !== 'All Regions') {
      filtered = filtered.filter(lead => 
        lead.location.includes(selectedRegion)
      );
    }

    // Apply industry filter
    if (selectedIndustry !== 'All Industries') {
      filtered = filtered.filter(lead => 
        lead.industry === selectedIndustry
      );
    }

    setFilteredLeads(filtered);
  }, [searchTerm, selectedRegion, selectedIndustry, leads]);

  // Calculate stats when leads change
  useEffect(() => {
    if (leads.length === 0) {
      setStats({
        totalLeads: 0,
        qualifiedLeads: 0,
        contactedLeads: 0,
        avgConfidence: 0
      });
      return;
    }

    const qualifiedLeads = leads.filter(lead => lead.status === 'qualified').length;
    const contactedLeads = leads.filter(lead => lead.status === 'contacted').length;
    const totalConfidence = leads.reduce((sum, lead) => sum + lead.confidenceScore, 0);
    const avgConfidence = totalConfidence / leads.length;

    setStats({
      totalLeads: leads.length,
      qualifiedLeads,
      contactedLeads,
      avgConfidence
    });
  }, [leads]);

  const handleStartScraping = async () => {
    try {
      setIsScrapingActive(true);
      setError(null);

      // Determine region from selected filter
      const region = selectedRegion === 'All Regions' ? 'Global' : selectedRegion;

      // Create scraping options
      const options: ScrapingOptions = {
        source: 'linkedin',
        region,
        industry: selectedIndustry,
        maxResults: 10
      };

      // Scrape leads
      const scrapedLeads = await scrapeLeads(options);
      
      // Evaluate leads
      const evaluatedLeads = await evaluateLeads(scrapedLeads);
      
      // Add to existing leads
      setLeads(prevLeads => [...evaluatedLeads, ...prevLeads]);
    } catch (err) {
      console.error('Error scraping leads:', err);
      setError('Failed to scrape leads. Please try again later.');
    } finally {
      setIsScrapingActive(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'contacted': return 'bg-orange-100 text-orange-800';
      case 'responded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="flex-1 p-4 space-y-4 bg-[#F8FAFC] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Lead Generation</h2>
          <p className="text-[#475569] text-sm">AI-powered lead scraping and qualification</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleStartScraping}
            disabled={isScrapingActive}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm
              ${isScrapingActive 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#2F4FE0] to-[#63B3ED] text-white hover:shadow-md hover:scale-105'
              }
            `}
          >
            <Plus className="h-4 w-4" />
            <span>{isScrapingActive ? 'Scraping...' : 'Start Scraping'}</span>
          </button>
          
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads by name, company, or location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4FE0] focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4FE0] focus:border-transparent text-sm"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option>All Regions</option>
              <option>North America</option>
              <option>Europe</option>
              <option>Asia Pacific</option>
              <option>Latin America</option>
            </select>
            
            <select 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4FE0] focus:border-transparent text-sm"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              <option>Insurance</option>
              <option>Financial Services</option>
              <option>Healthcare</option>
              <option>Technology</option>
            </select>
            
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      {isScrapingActive && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2F4FE0]"></div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Scraping in Progress</h3>
              <p className="text-xs text-[#475569]">Finding qualified leads from LinkedIn and Google Maps...</p>
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-[#2F4FE0] to-[#63B3ED] h-1.5 rounded-full transition-all duration-1000 animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#475569] mb-1">Total Leads</p>
              <p className="text-lg font-bold text-gray-900">{stats.totalLeads.toLocaleString()}</p>
            </div>
            <Search className="h-6 w-6 text-[#2F4FE0]" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#475569] mb-1">Qualified</p>
              <p className="text-lg font-bold text-gray-900">{stats.qualifiedLeads.toLocaleString()}</p>
            </div>
            <CheckCircle className="h-6 w-6 text-[#3AB795]" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#475569] mb-1">Contacted</p>
              <p className="text-lg font-bold text-gray-900">{stats.contactedLeads.toLocaleString()}</p>
            </div>
            <Mail className="h-6 w-6 text-[#63B3ED]" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#475569] mb-1">Avg Confidence</p>
              <p className="text-lg font-bold text-gray-900">{stats.avgConfidence ? `${Math.round(stats.avgConfidence * 100)}%` : '0%'}</p>
            </div>
            <AlertCircle className="h-6 w-6 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Recent Leads</h3>
        </div>
        
        <div className="flex-1 overflow-auto">
          {filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <AlertCircle className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 mb-1">No leads found</p>
              <p className="text-sm text-gray-400">
                {leads.length === 0 
                  ? "Click 'Start Scraping' to generate new leads" 
                  : "Try adjusting your search filters"}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        <div className="text-xs text-[#475569]">{lead.title}</div>
                        {lead.email && (
                          <div className="text-xs text-[#475569] flex items-center mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            {lead.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{lead.company}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{lead.location}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getConfidenceColor(lead.confidenceScore)}`}>
                        {Math.round(lead.confidenceScore * 100)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button className="text-[#2F4FE0] hover:text-[#63B3ED] transition-colors">
                          View
                        </button>
                        <button className="text-[#3AB795] hover:text-green-600 transition-colors">
                          Contact
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};