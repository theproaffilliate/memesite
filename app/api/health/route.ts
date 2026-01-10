import { NextResponse } from "next/server";
import { supabase, supabaseServer } from "@/lib/supabase";

export async function GET() {
  try {
    const checks = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseClientExists: !!supabase,
      supabaseServerExists: !!supabaseServer,
    };

    return NextResponse.json(
      {
        status: "ok",
        checks,
        serverReady: Object.values(checks).every((v) => v),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Health check failed" },
      { status: 500 }
    );
  }
}
