import mongoose from "mongoose";
import { IComment } from '../../utils/interface'

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    blog_id: mongoose.Types.ObjectId,
    blog_user_id: mongoose.Types.ObjectId,
    content: { type: String, require: true },
    replyCM: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
    reply_user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IComment>("Comment", commentSchema);
