import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zbmakzmugeueqbirudmt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibWFrem11Z2V1ZXFiaXJ1ZG10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNjM1NDMsImV4cCI6MjA3NzkzOTU0M30.YLjMGgpU6sMUpVEagGEhnsqb-J0k_raMIjBlEEKz3ak'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import the supabase client like this:
// For React:
// import { supabase } from "@/integrations/supabase/client";
// For React Native:
// import { supabase } from "@/src/integrations/supabase/client";
