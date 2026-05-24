import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export const getSupabaseBrowser = () => createPagesBrowserClient();
