import nodemailer from "nodemailer";
import ejs from "ejs";

import { fileURLToPath } from "url";
import { dirname } from "path";
const currentFilePath = import.meta.url;
const currentDirectory = dirname(fileURLToPath(currentFilePath));

// console.log(currentDirectory);

//creating a nodemailer
const mail = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "surya.nyros@gmail.com",
    pass: "djjwjkyxtopaesmw",
  },
});

const sendEmailVerificationLink = async (email, token, name) => {
  try {
    const renderedContent = await ejs.renderFile(
      `${currentDirectory}/../templates/confirm_email.ejs`,
      { token, name }
    );
    // console.log(`${currentDirectory}/../templates/confirm_email.ejs`);

    const mailOptions = {
      from: "surya.nyros@gmail.com",
      to: email,
      subject: "StoryBook - Email Confirmation",
      html: renderedContent,
    };

    const verificationInfo = await mail.sendMail(mailOptions);
    // console.log("Verification Info:", verificationInfo);
    console.log("Email sent successfully");
    return verificationInfo;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { error };
  }
};

//Password Reset link
// const sendPasswordResetLink = async (email, token, name) => {
//   try {
//     const renderedContent = await ejs.renderFile(
//       `${currentDirectory}/../templates/reset_password.ejs`,
//       { token, name }
//     );

//     const mailOptions = {
//       from: "surya.nyros@gmail.com",
//       to: email,
//       subject: "Storytime - Password Reset Link",
//       html: renderedContent,
//     };

//     const verificationInfo = await mail.sendMail(mailOptions);
//     console.log("Email sent successfully");
//     return verificationInfo;
//   } catch (error) {
//     console.error("Error sending verification email:", error);
//     return { error };
//   }
// };

export { sendEmailVerificationLink };
