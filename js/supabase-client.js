// Fill these in from Supabase: Project Settings -> API.
// The anon key is safe to expose in client-side code - access is controlled
// by Row Level Security policies (see supabase/schema.sql), not key secrecy.
const SUPABASE_URL = "https://wsvcskvulbdxyzmdvxvb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzdmNza3Z1bGJkeHl6bWR2eHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMTcyNzEsImV4cCI6MjA5OTU5MzI3MX0.T0w_Ts7z7GLmM6v-Sy_I-EiO3vDyNTtJFQl1Z7ctQJ8";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
