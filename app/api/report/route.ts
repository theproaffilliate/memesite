import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { meme_id, reason, comment } = await request.json();

    // Validate input
    if (!meme_id || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user from auth header
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized - no auth token" },
        { status: 401 }
      );
    }

    // Verify the user via their session
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - invalid token" },
        { status: 401 }
      );
    }

    // Check if meme exists
    const { data: meme, error: memeError } = await supabase
      .from("memes")
      .select("id")
      .eq("id", meme_id)
      .single();

    if (memeError || !meme) {
      return NextResponse.json({ error: "Meme not found" }, { status: 404 });
    }

    // Check if user already reported this meme
    const { data: existingReport } = await supabase
      .from("reports")
      .select("id")
      .eq("reporter_id", user.id)
      .eq("meme_id", meme_id)
      .single();

    if (existingReport) {
      return NextResponse.json(
        { error: "You have already reported this meme" },
        { status: 409 }
      );
    }

    // Create the report
    const { data, error } = await supabase
      .from("reports")
      .insert({
        meme_id,
        reporter_id: user.id,
        reason,
        comment: comment || null,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Report creation error:", error);
      return NextResponse.json(
        { error: "Failed to submit report" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: data?.[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Report endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
