import { createClient } from '@supabase/supabase-js';

// Hardcoded keys to ensure the app works locally and on deployment
const supabaseUrl = 'https://tpfmclmixjoonlfjccpj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwZm1jbG1peGpvb25sZmpjY3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NDc5MjEsImV4cCI6MjA3OTUyMzkyMX0.4CsrLd-iVqNDLiRbphYDDKvxx84rLrV16Mpo-gsAuYY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
