import { NextResponse } from "next/server";
import connectDB from "@/services/db";
import Agent from "@/services/db/models/Agent";
import { agentOnboardingSchema } from '@/schemas/agent.schema'

export async function POST(request: Request) {
  try {
    await connectDB();

    const body: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      profilePicture: string;
    } = await request.json();

    const validationResult = await agentOnboardingSchema.validate(body, { abortEarly: false });
    if (!validationResult) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    const normalizedEmail = body.email.trim().toLowerCase();

    const existingAgent = await Agent.findOne({ email: normalizedEmail });
    if (existingAgent) {
      return NextResponse.json({ error: "Agent with this email already exists" }, { status: 409 });
    }

    const newAgent = new Agent({
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: normalizedEmail,
      phoneNumber: body.phoneNumber.trim(),
      profilePicture: body.profilePicture?.trim(),
    });

    await newAgent.save();

    return NextResponse.json({ message: "Agent created successfully", agent: newAgent }, { status: 201 });
  } catch (error) {
    console.error("Agent signup API error:", error);

    if (error instanceof Error && "code" in error && (error as any).code === 11000) {
      return NextResponse.json({ error: "Agent with this email already exists" }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
  }
}
