export interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  email?: string;
  linkedin_url?: string;
  industry: string;
  confidence_score: number;
  status: 'new' | 'qualified' | 'contacted' | 'responded';
  created_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  target_region: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  leads_count: number;
  open_rate: number;
  click_rate: number;
  response_rate: number;
  created_at: string;
}

export interface Analytics {
  total_leads: number;
  qualified_leads: number;
  active_campaigns: number;
  avg_open_rate: number;
  avg_click_rate: number;
  avg_response_rate: number;
  top_performing_region: string;
  conversion_trend: Array<{
    date: string;
    conversions: number;
    leads: number;
  }>;
}

export interface Optimization {
  id: string;
  campaign_id: string;
  recommendation_type: 'tone' | 'timing' | 'content' | 'targeting';
  description: string;
  expected_improvement: number;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'applied' | 'rejected';
}