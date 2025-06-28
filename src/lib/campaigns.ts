/**
 * Campaign management service
 * This file provides functions for creating, updating, and tracking campaigns
 */

import { config } from './config';
import { supabase } from './supabase';
import { generateEmail } from './openai';
import { sendCampaignEmail, trackEmailOpen, trackEmailClick } from './email';
import { Lead } from './scraper';

/**
 * Types for campaign data
 */
export interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  targetRegion: string;
  targetIndustry: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  leadsCount: number;
  openRate: number;
  clickRate: number;
  responseRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignLead {
  id: string;
  campaignId: string;
  leadId: string;
  emailSent: boolean;
  emailOpened: boolean;
  emailClicked: boolean;
  responded: boolean;
  sentAt?: string;
  openedAt?: string;
  clickedAt?: string;
  respondedAt?: string;
}

export interface CampaignCreationParams {
  name: string;
  subject: string;
  content?: string;
  targetRegion: string;
  targetIndustry: string;
  leads: Lead[];
}

/**
 * Mock campaigns for the MVP
 */
const mockCampaigns: Campaign[] = [
  {
    id: 'campaign-1',
    name: 'European Insurance Expansion',
    subject: 'Transform your risk management strategy',
    content: `Dear {{name}},

As the {{title}} at {{company}}, you understand the challenges of managing risk in today's rapidly evolving insurance landscape.

Our AI-powered risk assessment platform has helped companies like yours reduce claims processing time by 35% while improving accuracy by 28%.

I'd love to schedule a brief call to discuss how we can help {{company}} streamline your risk management processes.

Would you be available for a 15-minute call next week?

Best regards,
Alex Johnson
Strategic Partnerships
Quotable`,
    targetRegion: 'Europe',
    targetIndustry: 'Insurance',
    status: 'active',
    leadsCount: 245,
    openRate: 28.4,
    clickRate: 12.1,
    responseRate: 4.8,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'campaign-2',
    name: 'APAC Leadership Outreach',
    subject: 'Innovative solutions for Asian markets',
    content: `Dear {{name}},

I noticed your role as {{title}} at {{company}} and your focus on the insurance sector in {{location}}.

Our platform has been specifically designed to address the unique regulatory challenges in the APAC region, with localized compliance modules for each major market.

Several leading insurers in {{location}} have already implemented our solution, resulting in a 42% reduction in compliance-related delays.

I would appreciate the opportunity to share how these results could be replicated at {{company}}.

Respectfully,
Sarah Chen
Regional Director, APAC
Quotable`,
    targetRegion: 'Asia Pacific',
    targetIndustry: 'Insurance',
    status: 'active',
    leadsCount: 189,
    openRate: 22.7,
    clickRate: 8.9,
    responseRate: 3.2,
    createdAt: '2024-01-12T10:30:00Z',
    updatedAt: '2024-01-12T10:30:00Z'
  },
  {
    id: 'campaign-3',
    name: 'North American CRO Campaign',
    subject: 'Advanced risk analytics platform',
    content: `Dear {{name}},

As {{company}}'s {{title}}, you're likely focused on optimizing risk assessment processes while maintaining regulatory compliance.

Our advanced analytics platform has been recognized by Gartner as a leader in the insurance risk management space, with particular strength in predictive modeling.

Companies implementing our solution have seen:
- 31% reduction in false positives
- 24% improvement in risk prediction accuracy
- 40% faster regulatory reporting

I'd like to share a case study from a company similar to {{company}} that might be relevant to your current initiatives.

Would you be interested in discussing this further?

Regards,
Michael Roberts
VP of Enterprise Solutions
Quotable`,
    targetRegion: 'North America',
    targetIndustry: 'Insurance',
    status: 'paused',
    leadsCount: 167,
    openRate: 31.2,
    clickRate: 15.6,
    responseRate: 6.1,
    createdAt: '2024-01-08T14:15:00Z',
    updatedAt: '2024-01-10T09:45:00Z'
  }
];

/**
 * Get all campaigns
 * @returns A promise that resolves to an array of campaigns
 */
export const getCampaigns = async (): Promise<Campaign[]> => {
  try {
    // In a real implementation, we would fetch campaigns from Supabase
    // For the MVP, we'll return mock data
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [...mockCampaigns];
  } catch (error) {
    console.error('Error getting campaigns:', error);
    throw error;
  }
};

/**
 * Get a campaign by ID
 * @param id The ID of the campaign
 * @returns A promise that resolves to the campaign
 */
export const getCampaignById = async (id: string): Promise<Campaign | null> => {
  try {
    // In a real implementation, we would fetch the campaign from Supabase
    // For the MVP, we'll return mock data
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const campaign = mockCampaigns.find(c => c.id === id);
    return campaign || null;
  } catch (error) {
    console.error(`Error getting campaign ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new campaign
 * @param params The campaign creation parameters
 * @returns A promise that resolves to the created campaign
 */
export const createCampaign = async (params: CampaignCreationParams): Promise<Campaign> => {
  try {
    console.log('Creating campaign:', params.name);
    
    // Generate content if not provided
    let content = params.content;
    if (!content) {
      // Generate a sample email for a lead
      const sampleLead = params.leads[0];
      content = await generateEmail(
        {
          name: sampleLead.name,
          title: sampleLead.title,
          company: sampleLead.company,
          location: sampleLead.location,
        },
        {
          subject: params.subject,
          region: params.targetRegion,
          industry: params.targetIndustry,
          tone: 'professional',
        }
      );
    }
    
    // In a real implementation, we would create the campaign in Supabase
    // For the MVP, we'll create a mock campaign
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCampaign: Campaign = {
      id: `campaign-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: params.name,
      subject: params.subject,
      content,
      targetRegion: params.targetRegion,
      targetIndustry: params.targetIndustry,
      status: 'draft',
      leadsCount: params.leads.length,
      openRate: 0,
      clickRate: 0,
      responseRate: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add the campaign to the mock data
    mockCampaigns.push(newCampaign);
    
    console.log(`Created campaign ${newCampaign.id}`);
    return newCampaign;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
};

/**
 * Update a campaign
 * @param id The ID of the campaign
 * @param updates The updates to apply
 * @returns A promise that resolves to the updated campaign
 */
export const updateCampaign = async (
  id: string,
  updates: Partial<Omit<Campaign, 'id' | 'createdAt'>>
): Promise<Campaign | null> => {
  try {
    console.log(`Updating campaign ${id}`);
    
    // In a real implementation, we would update the campaign in Supabase
    // For the MVP, we'll update the mock data
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const campaignIndex = mockCampaigns.findIndex(c => c.id === id);
    if (campaignIndex === -1) {
      return null;
    }
    
    const updatedCampaign = {
      ...mockCampaigns[campaignIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    mockCampaigns[campaignIndex] = updatedCampaign;
    
    console.log(`Updated campaign ${id}`);
    return updatedCampaign;
  } catch (error) {
    console.error(`Error updating campaign ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a campaign
 * @param id The ID of the campaign
 * @returns A promise that resolves to a boolean indicating success
 */
export const deleteCampaign = async (id: string): Promise<boolean> => {
  try {
    console.log(`Deleting campaign ${id}`);
    
    // In a real implementation, we would delete the campaign from Supabase
    // For the MVP, we'll update the mock data
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const campaignIndex = mockCampaigns.findIndex(c => c.id === id);
    if (campaignIndex === -1) {
      return false;
    }
    
    mockCampaigns.splice(campaignIndex, 1);
    
    console.log(`Deleted campaign ${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting campaign ${id}:`, error);
    throw error;
  }
};

/**
 * Launch a campaign
 * @param id The ID of the campaign
 * @param leads The leads to send the campaign to
 * @returns A promise that resolves to the updated campaign
 */
export const launchCampaign = async (id: string, leads: Lead[]): Promise<Campaign | null> => {
  try {
    console.log(`Launching campaign ${id} to ${leads.length} leads`);
    
    // Get the campaign
    const campaign = await getCampaignById(id);
    if (!campaign) {
      throw new Error(`Campaign ${id} not found`);
    }
    
    // Update the campaign status
    const updatedCampaign = await updateCampaign(id, {
      status: 'active',
      leadsCount: leads.length,
    });
    
    if (!updatedCampaign) {
      throw new Error(`Failed to update campaign ${id}`);
    }
    
    // In a real implementation, we would send emails to the leads
    // For the MVP, we'll simulate sending emails
    
    console.log(`Campaign ${id} launched successfully`);
    return updatedCampaign;
  } catch (error) {
    console.error(`Error launching campaign ${id}:`, error);
    throw error;
  }
};

/**
 * Pause a campaign
 * @param id The ID of the campaign
 * @returns A promise that resolves to the updated campaign
 */
export const pauseCampaign = async (id: string): Promise<Campaign | null> => {
  try {
    console.log(`Pausing campaign ${id}`);
    
    // Update the campaign status
    const updatedCampaign = await updateCampaign(id, {
      status: 'paused',
    });
    
    console.log(`Campaign ${id} paused successfully`);
    return updatedCampaign;
  } catch (error) {
    console.error(`Error pausing campaign ${id}:`, error);
    throw error;
  }
};

/**
 * Resume a campaign
 * @param id The ID of the campaign
 * @returns A promise that resolves to the updated campaign
 */
export const resumeCampaign = async (id: string): Promise<Campaign | null> => {
  try {
    console.log(`Resuming campaign ${id}`);
    
    // Update the campaign status
    const updatedCampaign = await updateCampaign(id, {
      status: 'active',
    });
    
    console.log(`Campaign ${id} resumed successfully`);
    return updatedCampaign;
  } catch (error) {
    console.error(`Error resuming campaign ${id}:`, error);
    throw error;
  }
};

/**
 * Complete a campaign
 * @param id The ID of the campaign
 * @returns A promise that resolves to the updated campaign
 */
export const completeCampaign = async (id: string): Promise<Campaign | null> => {
  try {
    console.log(`Completing campaign ${id}`);
    
    // Update the campaign status
    const updatedCampaign = await updateCampaign(id, {
      status: 'completed',
    });
    
    console.log(`Campaign ${id} completed successfully`);
    return updatedCampaign;
  } catch (error) {
    console.error(`Error completing campaign ${id}:`, error);
    throw error;
  }
};

/**
 * Send a campaign email to a lead
 * @param campaignId The ID of the campaign
 * @param lead The lead to send the email to
 * @returns A promise that resolves to a boolean indicating success
 */
export const sendCampaignEmailToLead = async (campaignId: string, lead: Lead): Promise<boolean> => {
  try {
    console.log(`Sending campaign ${campaignId} email to ${lead.name}`);
    
    // Get the campaign
    const campaign = await getCampaignById(campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }
    
    // Personalize the email content
    let emailContent = campaign.content;
    emailContent = emailContent.replace(/{{name}}/g, lead.name);
    emailContent = emailContent.replace(/{{title}}/g, lead.title);
    emailContent = emailContent.replace(/{{company}}/g, lead.company);
    emailContent = emailContent.replace(/{{location}}/g, lead.location);
    
    // Send the email
    const result = await sendCampaignEmail(
      {
        name: lead.name,
        email: lead.email || `${lead.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      },
      {
        id: campaign.id,
        name: campaign.name,
        subject: campaign.subject,
      },
      emailContent
    );
    
    if (!result.success) {
      throw new Error(`Failed to send email to ${lead.name}: ${result.error}`);
    }
    
    console.log(`Email sent to ${lead.name} successfully`);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${lead.name}:`, error);
    return false;
  }
};

/**
 * Get campaign performance metrics
 * @param id The ID of the campaign
 * @returns A promise that resolves to the campaign performance metrics
 */
export const getCampaignPerformance = async (id: string): Promise<{
  openRate: number;
  clickRate: number;
  responseRate: number;
  leadsCount: number;
}> => {
  try {
    console.log(`Getting performance metrics for campaign ${id}`);
    
    // In a real implementation, we would fetch the metrics from Supabase
    // For the MVP, we'll return mock data
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const campaign = await getCampaignById(id);
    if (!campaign) {
      throw new Error(`Campaign ${id} not found`);
    }
    
    return {
      openRate: campaign.openRate,
      clickRate: campaign.clickRate,
      responseRate: campaign.responseRate,
      leadsCount: campaign.leadsCount,
    };
  } catch (error) {
    console.error(`Error getting performance metrics for campaign ${id}:`, error);
    throw error;
  }
};