/**
 * Email service for sending emails
 * This is a simplified implementation for the MVP
 * In a real implementation, we would use a backend service or an email API
 */

import { config } from './config';

/**
 * Types for email requests and responses
 */
interface EmailRecipient {
  name: string;
  email: string;
}

interface EmailRequest {
  to: EmailRecipient;
  subject: string;
  body: string;
  from?: EmailRecipient;
  replyTo?: string;
  trackOpens?: boolean;
  trackClicks?: boolean;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Mock function to simulate sending an email
 * In a real implementation, this would use a backend service or an email API
 * @param request The email request
 * @returns A promise that resolves to an email response
 */
export const sendEmail = async (request: EmailRequest): Promise<EmailResponse> => {
  try {
    // Log the email request for debugging
    console.log('Sending email:', {
      to: request.to,
      subject: request.subject,
      // Truncate the body for logging
      body: request.body.length > 100 ? `${request.body.substring(0, 100)}...` : request.body,
    });

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For the MVP, we'll just simulate sending an email
    // In a real implementation, we would use a backend service or an email API
    
    // Simulate a 90% success rate
    const success = Math.random() < 0.9;

    if (success) {
      // Generate a random message ID
      const messageId = `mock-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      
      return {
        success: true,
        messageId,
      };
    } else {
      return {
        success: false,
        error: 'Failed to send email',
      };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Send a campaign email to a recipient
 * @param recipient The recipient of the email
 * @param campaign The campaign details
 * @param emailContent The content of the email
 * @returns A promise that resolves to an email response
 */
export const sendCampaignEmail = async (
  recipient: {
    name: string;
    email: string;
  },
  campaign: {
    id: string;
    name: string;
    subject: string;
  },
  emailContent: string
): Promise<EmailResponse> => {
  const request: EmailRequest = {
    to: {
      name: recipient.name,
      email: recipient.email,
    },
    subject: campaign.subject,
    body: emailContent,
    from: {
      name: 'Quotable',
      email: config.email.user,
    },
    replyTo: config.email.user,
    trackOpens: true,
    trackClicks: true,
  };

  return sendEmail(request);
};

/**
 * Track email opens
 * This is a simplified implementation for the MVP
 * In a real implementation, we would use a backend service or an email API
 * @param messageId The ID of the email message
 * @returns A promise that resolves to a boolean indicating success
 */
export const trackEmailOpen = async (messageId: string): Promise<boolean> => {
  try {
    console.log(`Tracking email open: ${messageId}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } catch (error) {
    console.error('Error tracking email open:', error);
    return false;
  }
};

/**
 * Track email clicks
 * This is a simplified implementation for the MVP
 * In a real implementation, we would use a backend service or an email API
 * @param messageId The ID of the email message
 * @param linkUrl The URL that was clicked
 * @returns A promise that resolves to a boolean indicating success
 */
export const trackEmailClick = async (messageId: string, linkUrl: string): Promise<boolean> => {
  try {
    console.log(`Tracking email click: ${messageId}, link: ${linkUrl}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } catch (error) {
    console.error('Error tracking email click:', error);
    return false;
  }
};