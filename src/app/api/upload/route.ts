import { NextResponse } from "next/server";
import { s3Service } from "@/services/s3.service";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;

    const imageUrl = await s3Service.uploadImage(
      buffer,
      fileName,
      file.type
    );

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
