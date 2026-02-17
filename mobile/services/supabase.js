import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Keys retrieved from client/.env on 2026-01-05
const SUPABASE_URL = 'https://flsguqlmcqxyulkqmriu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_F2h4qlMjmDY0sb8D-t5adw_5l31usVM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
