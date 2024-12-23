import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  first_name: { type: String, required: true, default: null },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  token: { type: String },
  verified: { type: Boolean, default: false },
  verify_token: { type: String },
  verify_token_expires: Date,
  isAuthor: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

export default User;
