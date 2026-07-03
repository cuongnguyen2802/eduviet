import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      await prisma.user.upsert({
        where: { authId: data.user.id },
        update: {},
        create: {
          authId: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.full_name ?? data.user.email!.split("@")[0],
          avatarUrl: data.user.user_metadata?.avatar_url ?? null,
        },
      });
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
