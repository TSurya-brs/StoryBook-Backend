import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmailVerificationLink } from "../utils/utils.js";

const createUser = async (req, res, next) => {
  const { first_name, last_name, email, password, isAuthor } = req.body;

  try {
    if (!first_name || !last_name || !email || !password) {
      const error = new Error(
        "Please fill first_name, last_name, email, and password in the body"
      );
      error.statusCode = 400;
      return next(error);
    }

    // Check for a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error("Invalid email format");
      error.statusCode = 400;
      return next(error);
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error("User already exists with this email");
      error.statusCode = 400;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    try {
      const verificationEmailResponse = await sendEmailVerificationLink(
        email,
        token,
        first_name
      );

      if (verificationEmailResponse.error) {
        const error = new Error("Error sending verification email");
        error.statusCode = 500;
        return next(error);
      }

      const user = await User.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        verify_token: token,
        verify_token_expires: Date.now() + 7200000,
        isAuthor,
      });

      return res.status(201).json({
        message:
          "Registered successfully. Please check your email for the verification link.",
      });
    } catch (emailError) {
      return next(emailError);
    }
  } catch (err) {
    return next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ verify_token: req.params.verify_token });

    if (!user) {
      return res.status(404).render("response_page", {
        message: "User not found, so the token is invalid.",
        status: "error",
      });
    } else if (user.verify_token_expires <= Date.now()) {
      if (!user.verified) {
        await user.deleteOne();
        return res.status(409).render("response_page", {
          message: "Verification link has expired. Please register again.",
          status: "error",
        });
      } else {
        return res.status(409).render("response_page", {
          message: "Please login to continue.",
          status: "info",
        });
      }
    } else if (user.verified === true) {
      return res.status(200).render("response_page", {
        message: "Email already verified. Please login.",
        status: "info",
      });
    } else {
      user.verified = true;
      await user.save();
      return res.status(201).render("response_page", {
        message: "Email verified successfully. Please login.",
        status: "success",
      });
    }
  } catch (error) {
    return next(error);
  }
};

// 3. Login User
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const err = new Error("Please enter both email and password");
    err.statusCode = 400;
    return next(err);
  }

  //Checking for vaild email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    const err = new Error("Invalid email");
    err.statusCode = 400;
    return next(err);
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }
    if (!user.verified) {
      const err = new Error(
        "Email verification is pending .So,please first verify your email"
      );
      err.statusCode = 409;
      return next(err);
    }
    console.log("username is correct");

    //Password Checking
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      const err = new Error("Invalid password");
      err.statusCode = 401;
      return next(err);
    }
    console.log("Password is correct");

    //Token Generation
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        isAuthor: user.isAuthor,
        name: user.first_name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 2592000,
      }
    );
    // console.log(user._id, user.isAuthor);
    user.token = token;
    await user.save();

    res.status(202).json({
      message: "Login Successfull",
      userId: user._id,
      token: token,
      isAuthor: user.isAuthor,
      name: user.first_name,
      email1: user.email,
    });
  } catch (error) {
    return next(error);
  }
};

export { createUser, verifyEmail, loginUser };
