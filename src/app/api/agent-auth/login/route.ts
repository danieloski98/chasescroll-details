import { NextResponse } from "next/server";
import connectDB from "@/services/db";
import Agent from "@/services/db/models/Agent";
import Otp from "@/services/db/models/Otp";
import { EmailService } from "@/services/emailservice";
import { ApiResponse } from "@/utils/Response";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const agent = await Agent.findOne({ email: normalizedEmail });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found." }, { status: 404 });
    }

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await Otp.findOneAndUpdate(
      { userId: agent._id },
      { userId: agent._id, code: otpCode, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await EmailService.sendEmail({
      to: normalizedEmail,
      subject: "Your Agent OTP Code",
      html: `<h1>Your OTP is: ${otpCode}</h1><p>It expires in 10 minutes.</p>`,
    });
    const response = new ApiResponse<Record<string, any>>({ message: 'OTP sent successfully', data: null });
    return NextResponse.json(response, { status: 201});
  } catch (error) {
    console.error("Agent login OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
