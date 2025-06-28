/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_EMAIL_SERVICE_USER: string;
  readonly VITE_EMAIL_SERVICE_PASS: string;
  readonly VITE_ANALYTICS_ID?: string;
  readonly VITE_CRAWL4AI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
