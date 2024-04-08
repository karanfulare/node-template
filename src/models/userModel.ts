import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import { HttpError } from "http-errors";
export interface User extends Document {
  // id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  bio: string;
  photo: string;
  visibility: "public" | "private";
  admin: boolean;
}

const userSchema: Schema = new Schema({
  // id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  bio: { type: String, required: true },
  photo: { type: String },
  visibility: { type: String, enum: ["public", "private"], default: "public" },
  admin: { type: Boolean, required: true, default: false },
});

userSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10); // You can configure salt rounds here
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err: Error | unknown) {
    next(err as Error);
  }
});
export default mongoose.model<User>("User", userSchema);
