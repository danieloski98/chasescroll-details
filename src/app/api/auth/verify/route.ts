import { NextResponse } from "next/server";
import connectDB from "@/services/db";
import User from "@/services/db/models/User";
import Otp from "@/services/db/models/Otp";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, otp } = await request.json();

    const user = await User.findOne({ companyEmail: email });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const otpDoc = await Otp.findOne({ code: otp });
    console.log("USER Details", user);
    console.log("OTP DETAILS", otpDoc);

    if (user?._id.toString() !== otpDoc.userId) {
      return NextResponse.json({ error: "Invalid OTP." }, { status: 400 });
    }

    if (!otpDoc) {
      return NextResponse.json({ error: "Invalid OTP Code" }, { status: 400 });
    }

    if (otpDoc.expiresAt < new Date()) {
      return NextResponse.json({ error: "OTP has expired." }, { status: 400 });
    }

    if (!user) {
      // This should ideally not happen if login flow is correct
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    // Clean up OTP
    await Otp.deleteOne({ _id: otpDoc._id });

    const response = NextResponse.json({ message: "Verification successful" });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;

  } catch (error) {
    console.error("Verify API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
