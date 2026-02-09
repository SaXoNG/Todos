import mongoose from "mongoose";
import { ITodo } from "./Todo";

export interface IList extends Document {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  todos?: ITodo[];
}

const ListSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [20, "Title cannot be longer than 20 characters"],
      trim: true,
    },
  },
  { timestamps: true },
);

ListSchema.virtual("todos", {
  ref: "Todo",
  localField: "_id",
  foreignField: "listId",
});

ListSchema.set("toObject", { virtuals: true });
ListSchema.set("toJSON", { virtuals: true });

export default mongoose.model<IList>("List", ListSchema);
