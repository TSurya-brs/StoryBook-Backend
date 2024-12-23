import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const checkAuthorAuthentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Get the token
    if (!token) {
      return res.status(403).json({ message: "No token provided." });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from the database
    const user = await User.findById(decoded.userId);
    // if (!user || !user.isAuthor) {
    if (!user.isAuthor) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action." });
    }

    // Attach user info to request
    req.user = { userId: user._id, name: user.first_name }; // Attach userId and name
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

export default checkAuthorAuthentication;
