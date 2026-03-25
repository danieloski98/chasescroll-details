import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/services/db";
import User from "@/services/db/models/User";
import * as jose from 'jose';


export async function GET(request: NextRequest) {
  try {
    await connectDB();
    // const userId = request.headers.get("x-user-id");
    const token = request.cookies.get("token")?.value;
    console.log("TOKEN FROM MIDDLEWARE", token);
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    const { payload } = await jose.jwtVerify(token, secret);

    const userId = payload.userId as string;
    
    console.log(token, userId);

    if (!userId) {
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

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
     // const userId = request.headers.get("x-user-id");
    const token = request.cookies.get("token")?.value;
    console.log("TOKEN FROM MIDDLEWARE", token);
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    const { payload } = await jose.jwtVerify(token, secret);

    const userId = payload.userId as string;
    
    console.log(token, userId);

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    
    // Update the user record
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error("Profile Update API error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
