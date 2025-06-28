import { createClient } from '@supabase/supabase-js';
import { config, validateConfig } from './config';

// Validate all environment variables
validateConfig();

export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);