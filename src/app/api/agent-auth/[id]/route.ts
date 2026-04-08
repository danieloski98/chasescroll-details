import { NextResponse } from "next/server";
import connectDB from "@/services/db";
import Agent from "@/services/db/models/Agent";
import { ApiResponse } from "@/utils/Response";

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
      const response = new ApiResponse({ success: false, message: 'Agent not found', data: null});
      return NextResponse.json(response, { status: 400 });
    }

    const response = new ApiResponse({ message: 'Agent details', data: { ...agent }});

    return NextResponse.json(response, { status: 200 });
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
    const apiResponse = new ApiResponse({ data: null });
    if (!id) {
      apiResponse.message = 'Agent id is required';
      return NextResponse.json(apiResponse, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("profilePicture");

    if (!file || !(file instanceof File)) {
      apiResponse.message = 'Profile picture file required';
      return NextResponse.json(apiResponse, { status: 400 });
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
      const response = new ApiResponse({ message: 'Agent not found', data: null, success: false });
      return NextResponse.json(response, {status: 404});
    }

    return NextResponse.json(new ApiResponse({ message: 'Agent updated', data: updatedAgent}), { status: 201});
  } catch (error) {
    console.error("Agent update profile picture error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
