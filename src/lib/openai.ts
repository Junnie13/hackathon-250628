/**
 * OpenAI service for AI integration
 * This file provides functions for interacting with the OpenAI API
 */

import { config } from './config';

/**
 * Types for OpenAI API requests and responses
 */
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: OpenAIMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Default model to use for OpenAI requests
 */
const DEFAULT_MODEL = 'gpt-4o';

/**
 * Send a request to the OpenAI API
 * @param messages The messages to send to the API
 * @param model The model to use (defaults to gpt-4o)
 * @param temperature The temperature to use (defaults to 0.7)
 * @param maxTokens The maximum number of tokens to generate (optional)
 * @returns The response from the OpenAI API
 */
export const sendOpenAIRequest = async (
  messages: OpenAIMessage[],
  model: string = DEFAULT_MODEL,
  temperature: number = 0.7,
  maxTokens?: number
): Promise<string> => {
  try {
    const requestBody: OpenAIRequest = {
      model,
      messages,
      temperature,
    };

    if (maxTokens) {
      requestBody.max_tokens = maxTokens;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openai.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json() as OpenAIResponse;
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

/**
 * Generate an email using OpenAI
 * @param recipient Information about the recipient
 * @param campaign Information about the campaign
 * @returns The generated email
 */
export const generateEmail = async (
  recipient: {
    name: string;
    title: string;
    company: string;
    location: string;
  },
  campaign: {
    subject: string;
    region: string;
    industry: string;
    tone: 'formal' | 'casual' | 'professional';
  }
): Promise<string> => {
  const systemPrompt = `You are an expert email copywriter specializing in outbound marketing for the ${campaign.industry} industry.
Write a personalized email to a potential lead with the following characteristics:
- Name: ${recipient.name}
- Title: ${recipient.title}
- Company: ${recipient.company}
- Location: ${recipient.location}

The email should:
- Use a ${campaign.tone} tone
- Be culturally appropriate for ${campaign.region}
- Focus on the subject: "${campaign.subject}"
- Be concise (150-200 words)
- Include a clear call to action
- Not use generic phrases like "I hope this email finds you well"
- Be persuasive but not pushy`;

  const userPrompt = `Generate a personalized email for ${recipient.name} at ${recipient.company} about "${campaign.subject}".`;

  const messages: OpenAIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  return sendOpenAIRequest(messages, DEFAULT_MODEL, 0.7);
};

/**
 * Evaluate a lead using OpenAI
 * @param lead Information about the lead
 * @returns An evaluation of the lead
 */
export const evaluateLead = async (
  lead: {
    name: string;
    title: string;
    company: string;
    industry?: string;
    description?: string;
  }
): Promise<{
  isDecisionMaker: boolean;
  industryMatch: 'high' | 'medium' | 'low';
  confidenceScore: number;
  reasoning: string;
}> => {
  const systemPrompt = `You are an AI lead evaluator for the insurance industry.
Given information about a potential lead, assess:
1. Whether they are likely a decision-maker based on their title
2. How well their company/industry matches the insurance vertical
3. Your confidence in this assessment (0-1 scale)

Provide your reasoning for each assessment.`;

  const userPrompt = `Evaluate this lead:
Name: ${lead.name}
Title: ${lead.title}
Company: ${lead.company}
${lead.industry ? `Industry: ${lead.industry}` : ''}
${lead.description ? `Description: ${lead.description}` : ''}`;

  const messages: OpenAIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const response = await sendOpenAIRequest(messages, DEFAULT_MODEL, 0.3);
  
  // Parse the response to extract the evaluation
  // This is a simplified implementation - in a real app, we would use a more robust parsing method
  try {
    // For demo purposes, we'll return a mock evaluation
    // In a real implementation, we would parse the response from OpenAI
    return {
      isDecisionMaker: lead.title.toLowerCase().includes('chief') || 
                       lead.title.toLowerCase().includes('director') || 
                       lead.title.toLowerCase().includes('vp') ||
                       lead.title.toLowerCase().includes('head'),
      industryMatch: lead.industry?.toLowerCase().includes('insurance') ? 'high' : 'medium',
      confidenceScore: 0.85,
      reasoning: response,
    };
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    throw new Error('Failed to evaluate lead');
  }
};

/**
 * Generate optimization suggestions for a campaign
 * @param campaign Information about the campaign
 * @param performance Performance metrics for the campaign
 * @returns Optimization suggestions
 */
export const generateOptimizationSuggestions = async (
  campaign: {
    subject: string;
    content: string;
    region: string;
    industry: string;
  },
  performance: {
    openRate: number;
    clickRate: number;
    responseRate: number;
    averageOpenRate: number;
    averageClickRate: number;
    averageResponseRate: number;
  }
): Promise<{
  suggestions: string[];
  expectedImprovement: number;
}> => {
  const systemPrompt = `You are an AI campaign optimization expert.
Given information about an email campaign and its performance metrics, provide specific suggestions to improve its effectiveness.
Focus on subject line, content, call to action, and timing.
Estimate the expected improvement for each suggestion.`;

  const userPrompt = `Analyze this campaign:
Subject: ${campaign.subject}
Content: ${campaign.content}
Region: ${campaign.region}
Industry: ${campaign.industry}

Performance:
- Open rate: ${performance.openRate}% (average: ${performance.averageOpenRate}%)
- Click rate: ${performance.clickRate}% (average: ${performance.averageClickRate}%)
- Response rate: ${performance.responseRate}% (average: ${performance.averageResponseRate}%)

What specific improvements would you suggest?`;

  const messages: OpenAIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const response = await sendOpenAIRequest(messages, DEFAULT_MODEL, 0.7);
  
  // For demo purposes, we'll return mock suggestions
  // In a real implementation, we would parse the response from OpenAI
  return {
    suggestions: [
      'Shorten the subject line to under 50 characters',
      'Add more personalization in the first paragraph',
      'Include industry-specific statistics to build credibility',
      'Make the call to action more specific and actionable',
      'Send emails on Tuesday or Wednesday morning for better open rates',
    ],
    expectedImprovement: 15,
  };
};