# Environment Variables Setup Guide

This guide provides instructions for setting up environment variables for the Quotable app, ensuring that sensitive information like API keys are securely stored and not committed to GitHub.

## Creating Environment Files

1. Create a `.env` file in the root directory of the project
2. Create a `.env.example` file as a template (this will be committed to GitHub)
3. Update `.gitignore` to exclude the `.env` file

## Environment Variables Template

Copy the content below into your `.env.example` file:

```
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI API Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Email Service Configuration (Gmail SMTP)
VITE_EMAIL_SERVICE_USER=your_email_address_here
VITE_EMAIL_SERVICE_PASS=your_app_password_here

# Optional: Analytics Configuration
VITE_ANALYTICS_ID=your_analytics_id_here

# Optional: Crawl4AI Configuration (for Phase 2)
VITE_CRAWL4AI_API_KEY=your_crawl4ai_key_here
```

Then create your actual `.env` file with the same structure but with your real values.

## Gitignore Configuration

Ensure your `.gitignore` file includes the following entries:

```
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# But keep the example file
!.env.example
```

## Accessing Environment Variables in Code

Create a centralized configuration file to access environment variables:

```typescript
// src/lib/config.ts

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
  // Add other configuration sections as needed
}

const validateEnvVar = (name: string): string => {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

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
  // Initialize other sections with their respective environment variables
};
```

## Best Practices for API Key Security

1. **Never commit API keys to GitHub**
   - Always use environment variables
   - Check your commits before pushing to ensure no keys are included

2. **Rotate API keys regularly**
   - Change your API keys periodically
   - Immediately rotate keys if you suspect they've been compromised

3. **Use appropriate access levels**
   - Only request the permissions your application needs
   - Use read-only access when possible

4. **Consider using a secrets manager**
   - For production environments, consider using a dedicated secrets manager
   - Options include AWS Secrets Manager, Google Secret Manager, or HashiCorp Vault

5. **Implement proper error handling**
   - Handle missing environment variables gracefully
   - Provide clear error messages for configuration issues

By following these guidelines, you'll ensure that your API keys and other sensitive information remain secure while developing the Quotable app.