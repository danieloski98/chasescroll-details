import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  companyEmail: string;
  dateOfBirth?: Date;
  phoneNumber: string;
  position: string;
  address?: string;
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyEmail: { type: String, required: true },
    dateOfBirth: { type: Date, required: false },
    phoneNumber: { type: String, required: true },
    position: { type: String, required: true },
    address: { type: String, required: false },
    bio: { type: String, required: false },
    image: { type: String },
  },
  { timestamps: true }
);

// Prevent re-compiling the model if it already exists
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
