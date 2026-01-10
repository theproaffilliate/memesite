// app/api/bookmarks/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { memeId, action } = await request.json();

    if (!memeId || !action || (action !== "add" && action !== "remove")) {
      return NextResponse.json(
        { error: "Invalid request. memeId and action are required." },
        { status: 400 }
      );
    }

    // Get current user session from the request
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized. User session required." },
        { status: 401 }
      );
    }

    // Extract token and verify user
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid session." },
        { status: 401 }
      );
    }

    const userId = user.id;

    if (action === "add") {
      // Add bookmark
      const { data, error } = await supabase
        .from("bookmarks")
        .insert({
          user_id: userId,
          meme_id: memeId,
          created_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error("Bookmark insert error:", error);
        return NextResponse.json(
          { error: "Failed to add bookmark" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, data, message: "Bookmark added successfully" },
        { status: 200 }
      );
    } else if (action === "remove") {
      // Remove bookmark
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .match({ user_id: userId, meme_id: memeId });

      if (error) {
        console.error("Bookmark delete error:", error);
        return NextResponse.json(
          { error: "Failed to remove bookmark" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, message: "Bookmark removed successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Bookmark API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current user session
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized. User session required." },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid session." },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Get user's bookmarks
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Bookmarks fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch bookmarks" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: data || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Bookmarks GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
