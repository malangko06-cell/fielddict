import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mnpowjgmdvvyidybqqpt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ucG93amdtZHZ2eWlkeWJxcXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MDM3NzgsImV4cCI6MjA5NjQ3OTc3OH0.j8d8TlhEQwz_HXLXNxvED4l4FznBrqSdT9dxjFX38xs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
