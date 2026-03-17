import { NextResponse } from "next/server";
import connectDB from "@/services/db";
import User from "@/services/db/models/User";
import Otp from "@/services/db/models/Otp";
import { EmailService } from "@/services/emailservice";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email } = await request.json();

    const user = await User.findOne({ companyEmail: email });
    if (!user) {
      return NextResponse.json({ error: "User not found. Please register first." }, { status: 404 });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    await Otp.findOneAndUpdate(
      { userId: user._id },
      { userId: user._id, code: otpCode, expiresAt: expires },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send OTP email
    await EmailService.sendEmail({
      to: email,
      subject: "Your Chasescroll Login Code",
      html: `<h1>Your OTP is: ${otpCode}</h1><p>This code will expire in 10 minutes.</p>`,
    });

    return NextResponse.json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
