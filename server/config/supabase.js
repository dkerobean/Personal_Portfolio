const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Log environment variables for debugging
console.log('\n===== SUPABASE CONFIGURATION =====');
console.log('Environment:', process.env.NODE_ENV || 'development');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Log configuration (masking sensitive parts of the key)
if (supabaseUrl && supabaseKey) {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key:', supabaseKey.substring(0, 10) + '...' + supabaseKey.substring(supabaseKey.length - 4));
} else {
  console.error('❌ Error: Missing Supabase configuration');
  console.error('- SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('- SUPABASE_KEY:', supabaseKey ? 'Set' : 'Missing');
  process.exit(1);
}

// Create Supabase client with options
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'X-Client-Info': 'personal-portfolio-admin/1.0.0'
    }
  }
});

// Test the connection
async function testConnection() {
  try {
    console.log('\nTesting Supabase connection...');
    const { data, error } = await supabase.from('admin_users').select('*').limit(1);
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      if (error.code) console.error('Error code:', error.code);
      if (error.details) console.error('Details:', error.details);
      if (error.hint) console.error('Hint:', error.hint);
    } else {
      console.log('✅ Successfully connected to Supabase');
      console.log(`Found ${data ? data.length : 0} admin users`);
    }
  } catch (err) {
    console.error('❌ Error testing Supabase connection:', err.message);
  }
}

// Run the connection test when this module is loaded
if (process.env.NODE_ENV !== 'test') {
  testConnection();
}

module.exports = supabase;
