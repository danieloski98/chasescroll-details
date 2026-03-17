import { NextResponse } from "next/server";
import connectDB from "@/services/db";
import User from "@/services/db/models/User";
import { EmailService } from "@/services/emailservice";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body: { firstName: string, lastName: string, companyEmail: string, email?: string } = await request.json();

    // Basic validation
    if (!body.firstName || !body.lastName || !body.companyEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newBody = {
      ...body,
      companyEmail: body?.companyEmail?.toLowerCase()
    };

    const userExist = await User.findOne({ companyEmail: newBody.companyEmail });
    if (userExist) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    // check if its a chasescroll email
    const isChasescrollEmail = newBody.companyEmail.endsWith("@chasescroll.com");
    if (!isChasescrollEmail) {
      return NextResponse.json({ error: "Invalid company email." }, { status: 400 });
    }

    const newUser = new User(newBody);
    await newUser.save();

    // Send a welcome email
    try {
      await EmailService.sendEmail({
        to: newUser.companyEmail,
        subject: "Welcome to Chasescroll!",
        html: `<h1>Hi ${newUser.firstName},</h1><p>Your profile has been created successfully. you can login anytime with your email ${newUser.companyEmail} to edit your profile.</p>`,
      });
    } catch (emailError) {
      // Log the email error but don't fail the whole request
      console.error("Failed to send welcome email:", emailError);
    }

    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Onboarding API error:", error);
    // Check for duplicate key error (email)
    if (error instanceof Error && 'code' in error && (error as Error & { code: number }).code === 11000) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
