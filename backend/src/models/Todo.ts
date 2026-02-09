import mongoose from "mongoose";

import { Document, Types } from "mongoose";
import { TODO_STATUS } from "../types/TODO_STATUS";
import TODO_TITLE_MAX_LENGTH from "../constants/todoTitleMaxLength";

export interface ITodo extends Document {
  listId: Types.ObjectId;
  title: string;
  description: string;
  status: TODO_STATUS;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema = new mongoose.Schema(
  {
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: [true, "List ID is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [TODO_TITLE_MAX_LENGTH, "Title cannot exceed 20 characters"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(TODO_STATUS),
      default: TODO_STATUS.TODO,
    },
    position: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ITodo>("Todo", TodoSchema);
