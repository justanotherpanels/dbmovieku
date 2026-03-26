import { supabase } from './lib/supabase';

async function checkFavicon() {
  const { data, error } = await supabase.from('setting_site').select('*').limit(1).single();
  if (error) {
    console.error('Error fetching settings:', error);
  } else {
    console.log('Settings Data:', JSON.stringify(data, null, 2));
  }
}

checkFavicon();
