import { NextResponse } from "next/server";
import connectDB from "@/services/db";
import Agent from "@/services/db/models/Agent";
import Otp from "@/services/db/models/Otp";
import jwt from "jsonwebtoken";
import { ApiResponse } from "@/utils/Response";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const agent = await Agent.findOne({ email: normalizedEmail });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found." }, { status: 404 });
    }

    const otpDoc = await Otp.findOne({ code: otp, userId: agent._id });

    const apiResponse = new ApiResponse({ message: '', success: true, data: null });

    if (!otpDoc) {
      apiResponse.message = 'Invalid OTP code';
      apiResponse.success = false;
      return NextResponse.json(apiResponse, { status: 400 });
    }

    if (otpDoc.expiresAt < new Date()) {
      apiResponse.message = 'OTP has expired';
      apiResponse.success = false;
      return NextResponse.json(apiResponse, {status: 400});
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined.");
    }

    const token = jwt.sign({ agentId: agent._id }, secret, { expiresIn: "7d" });

    await Otp.deleteOne({ _id: otpDoc._id });
    apiResponse.data = {
      token,
      agent
    } as any;
    apiResponse.message = 'Verification successful';
    const response = NextResponse.json(apiResponse, {status: 200 });

    return response;
  } catch (error) {
    console.error("Agent OTP verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
