import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a custom hook to get Supabase client with Clerk auth
export function useSupabaseClient() {
    const { getToken } = useAuth();

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            fetch: async (url, options = {}) => {
                const token = await getToken({ template: 'supabase' });
                const headers = new Headers(options?.headers);
                if (token) {
                    headers.set('Authorization', `Bearer ${token}`);
                }
                return fetch(url, { ...options, headers });
            },
        },
    });

    return supabase;
}
