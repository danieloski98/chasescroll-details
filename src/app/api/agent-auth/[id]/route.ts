import { NextResponse } from "next/server";
import connectDB from "@/services/db";
import Agent from "@/services/db/models/Agent";

export async function GET(
  request: Request,
  { params }: { params: any }
) {
  try {
    await connectDB();

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Agent id is required." }, { status: 400 });
    }

    const agent = await Agent.findById(id);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found." }, { status: 404 });
    }

    return NextResponse.json(agent);
  } catch (error) {
    console.error("Agent fetch by id error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: any }
) {
  try {
    await connectDB();

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Agent id is required." }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("profilePicture");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "profilePicture file is required." }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const filename = `${id}-${Date.now()}-${file.name}`;

    const { s3Service } = await import("@/services/s3.service");
    const uploadedUrl = await s3Service.uploadImage(fileBuffer, filename, file.type);

    const updatedAgent = await Agent.findByIdAndUpdate(
      id,
      { profilePicture: uploadedUrl },
      { new: true }
    );

    if (!updatedAgent) {
      return NextResponse.json({ error: "Agent not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile picture updated", agent: updatedAgent });
  } catch (error) {
    console.error("Agent update profile picture error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
