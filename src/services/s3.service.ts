import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * Service for handling AWS S3 operations.
 * Requires the following environment variables:
 * - AWS_ACCESS_KEY_ID
 * - AWS_SECRET_ACCESS_KEY
 * - AWS_REGION
 * - AWS_S3_BUCKET_NAME
 */
export class S3Service {
  private client: S3Client;
  private bucketName: string;

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION_KEY!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_KEY_ID!,
      },
    });
    this.bucketName = process.env.AWS_BUCKET_NAME_ID!;
  }

  /**
   * Uploads an image to S3.
   * @param fileBuffer The image data as a Buffer or Uint8Array.
   * @param fileName The name to store the file as in S3.
   * @param contentType The MIME type of the image (e.g., 'image/jpeg').
   * @returns The public URL of the uploaded image.
   */
  async uploadImage(
    fileBuffer: Buffer | Uint8Array,
    fileName: string,
    contentType: string
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    });

    try {
      await this.client.send(command);
      // Construct the URL. This assumes the bucket is publicly accessible or you're using a CDN.
      // If the bucket is private, you should use getSignedUrl from @aws-sdk/s3-request-presigner.
      return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
      console.error("Error uploading image to S3:", error);
      throw new Error("Failed to upload image to S3.");
    }
  }
}

// Export a singleton instance
export const s3Service = new S3Service();
