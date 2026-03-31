import mongoose, { Schema, Document } from "mongoose";

export interface IAgent extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
}

const AgentSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    profilePicture: { type: String },
  },
  { timestamps: true }
);

// Prevent re-compiling the model if it already exists
const Agent = mongoose.models.Agent || mongoose.model<IAgent>("Agent", AgentSchema);

export default Agent;
