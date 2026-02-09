import mongoose from "mongoose";

export default function isValidId(id: any) {
  return mongoose.Types.ObjectId.isValid(id);
}
