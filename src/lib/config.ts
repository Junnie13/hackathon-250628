/**
 * Centralized configuration file for accessing environment variables
 * This file validates that all required environment variables are present
 * and provides a type-safe way to access them throughout the application.
 */

interface Config {
  supabase: {
    url: string;
    anonKey: string;
  };
  openai: {
    apiKey: string;
  };
  email: {
    user: string;
    pass: string;
  };
  analytics?: {
    id: string;
  };
  crawl4ai?: {
    apiKey: string;
  };
}

/**
 * Validates that an environment variable exists and returns its value
 * @param name The name of the environment variable
 * @param required Whether the variable is required (defaults to true)
 * @returns The value of the environment variable
 * @throws Error if the variable is required but not found
 */
const validateEnvVar = (name: string, required = true): string => {
  const value = import.meta.env[name as keyof ImportMetaEnv] as string | undefined;
  
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  
  return value || '';
};

/**
 * Configuration object with all environment variables
 */
export const config: Config = {
  supabase: {
    url: validateEnvVar('VITE_SUPABASE_URL'),
    anonKey: validateEnvVar('VITE_SUPABASE_ANON_KEY'),
  },
  openai: {
    apiKey: validateEnvVar('VITE_OPENAI_API_KEY'),
  },
  email: {
    user: validateEnvVar('VITE_EMAIL_SERVICE_USER'),
    pass: validateEnvVar('VITE_EMAIL_SERVICE_PASS'),
  },
  // Optional configurations
  analytics: import.meta.env.VITE_ANALYTICS_ID
    ? { id: import.meta.env.VITE_ANALYTICS_ID }
    : undefined,
  crawl4ai: import.meta.env.VITE_CRAWL4AI_API_KEY
    ? { apiKey: import.meta.env.VITE_CRAWL4AI_API_KEY }
    : undefined,
};

/**
 * Check if all required environment variables are present
 * This function is called when the application starts
 */
export const validateConfig = (): void => {
  // Validate Supabase configuration
  if (!config.supabase.url || !config.supabase.anonKey) {
    throw new Error('Missing Supabase configuration');
  }
  
  // Validate OpenAI configuration
  if (!config.openai.apiKey) {
    throw new Error('Missing OpenAI API key');
  }
  
  // Validate Email configuration
  if (!config.email.user || !config.email.pass) {
    throw new Error('Missing Email service configuration');
  }
  
  console.log('✅ Environment variables validated successfully');
};