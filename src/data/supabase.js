import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oktoqpifcrtjulonpcia.supabase.co';
const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rdG9xcGlmY3J0anVsb25wY2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTUwOTE5MjUsImV4cCI6MjAxMDY2NzkyNX0.-PkzeFaX5vTV7yYi4BQQDTE8qTkd6rHGnWLo1EPfFqw';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
