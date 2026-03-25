import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/services/db";
import User from "@/services/db/models/User";

export async function GET(
  _request: NextRequest,
  { params }: { params: any }
) {
  try {
    await connectDB();
    const { id } = await params;

    console.log('[USER ID]', id);

    const user = await User.findById(id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    console.log('[USER DETAILS]', user);

    return NextResponse.json(user);
  } catch (error) {
    console.error("Public Profile API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
