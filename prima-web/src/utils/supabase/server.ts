import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};

// SERVER-ONLY. Bypasses RLS. Untuk admin read/export & write ke tabel terproteksi.
// Jangan import di client component. SUPABASE_SERVICE_ROLE_KEY tidak NEXT_PUBLIC_.
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const createServiceClient = () => {
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY belum diset (server env).");
  }
  return createSupabaseClient(supabaseUrl!, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};
