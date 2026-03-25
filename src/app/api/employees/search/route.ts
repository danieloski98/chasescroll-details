import { NextResponse } from "next/server";
import connectDB from "@/services/db";
import User from "@/services/db/models/User";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json([]);
    }

    const employees = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { companyEmail: { $regex: query, $options: "i" } },
      ],
    })
      .select("firstName lastName companyEmail position image")
      .limit(10);

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Employee Search API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
