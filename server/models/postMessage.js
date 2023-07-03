import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: String,
  message: String,
  creator: String,
  name: String,
  tags: [String],
  selectedFile: String,
  likes: {
    type: [String],
    default: [],
  },
  comments:{
    type:[String],
    default:[]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PostMessage =
  mongoose.models.PostMessage || mongoose.model("PostMessage", postSchema);

export default PostMessage;
