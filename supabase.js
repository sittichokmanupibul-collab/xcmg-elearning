// แก้ไขไฟล์ supabase.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://xptjbgzgogvpncbttcca.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdGpiZ3pnb2d2cG5jYnR0Y2NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMjA1ODQsImV4cCI6MjA5NDg5NjU4NH0.WoaiUQ5bNk1R5DQCCJSMXb-PCfSIMzIDVdiT2UNs9C0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);