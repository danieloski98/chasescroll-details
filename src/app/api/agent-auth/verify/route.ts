import { NextResponse } from "next/server";
import connectDB from "@/services/db";
import Agent from "@/services/db/models/Agent";
import Otp from "@/services/db/models/Otp";
import jwt from "jsonwebtoken";

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

    if (!otpDoc) {
      return NextResponse.json({ error: "Invalid OTP code." }, { status: 400 });
    }

    if (otpDoc.expiresAt < new Date()) {
      return NextResponse.json({ error: "OTP has expired." }, { status: 400 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined.");
    }

    const token = jwt.sign({ agentId: agent._id }, secret, { expiresIn: "7d" });

    await Otp.deleteOne({ _id: otpDoc._id });

    const response = NextResponse.json({
      message: "Verification successful",
      token,
      agent: {
        id: agent._id,
        firstName: agent.firstName,
        lastName: agent.lastName,
        email: agent.email,
        phoneNumber: agent.phoneNumber,
        profilePicture: agent.profilePicture,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Agent OTP verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
