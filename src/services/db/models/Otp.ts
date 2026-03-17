import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  code: string;
  userId: string;
}

const OtpSchema: Schema = new Schema(
  {
    code: { required: true, type: String },
    userId: { required: true, type: String },
    expiresAt: { required: true, type: Date },
  },
  { timestamps: true }
);

// Prevent re-compiling the model if it already exists
const Otp = mongoose.models.Otp || mongoose.model<IOtp>("Otp", OtpSchema);

export default Otp;
