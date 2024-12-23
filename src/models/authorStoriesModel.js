import mongoose from "mongoose";

const storiesSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  author: { type: String, required: true }, // Store author's name as a string
  likes: { type: Number, default: 0 },
  liked_by_id: { type: Array, default: [] },
  // likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: { type: Array, default: [] },
});

const Story = mongoose.model("Story", storiesSchema);

export default Story;
