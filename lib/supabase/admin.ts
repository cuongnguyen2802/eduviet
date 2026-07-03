import { createClient } from "@supabase/supabase-js";

/** Client dùng service_role key — chỉ dùng ở server (API routes/Server Actions), không bao giờ để lộ ra client. */
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
