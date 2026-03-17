import { NextResponse } from "next/server";
import { headers } from "next/headers";
import connectDB from "@/services/db";
import User from "@/services/db/models/User";

export async function GET() {
  try {
    await connectDB();

    const headersList = await headers();
    // Assumes middleware has run and set the 'x-user-id' header
    const userId = headersList.get("x-user-id");

    if (!userId) {
      // This case should be handled by middleware, but serves as a fallback.
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await User.findById(userId).select("-password"); // Exclude password

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error("Profile API error:", error);
    // With auth handled by middleware, errors here are likely internal.
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
