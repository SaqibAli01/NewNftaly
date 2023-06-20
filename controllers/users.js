import { logIn } from "../middlewares/jwtToken.js";
import { BadRequest } from "../middlewares/throwErrors.js";
import User from "../models/users.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

// ------------------------register user------------------------ //
export const register = async (req, res) => {
  let { firstName, lastName, email, phone, address, password } = req.body;
  // try {
  const user = await User.findOne({ email });
  if (user) {
    throw new BadRequest("email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    email,
    phone,
    address,
    password: hashPassword,
  });
  await newUser.save();
  // res.send("user saved successfully");
  // res.status(201).send("user saved successfully");
  res.status(201).json({
    success: true,
    message: "user saved successfully",
  });

  // } catch (error) {
  //   res.status(400).send(error);
  // }
};

// ------------------------login user------------------------ //
export const login = async (req, res) => {
  let { email, password } = req.body;
  console.log(req.body);
  // try {
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequest("incorrect email or password");
  }
  let code = bcrypt.compareSync(password, user.password);
  if (!code) {
    throw new BadRequest("incorrect email or password");
  }
  //   let code = await  bcrypt.compare(password, user.password);
  // res.status(201).send("login successfully");
  const token = await logIn({ _id: user?._id });
  // localStorage.setItem("token", token);
  console.log(token);
  res.status(201).json({
    success: true,
    message: "Login Successfully!",
    token,
    user,
  });
  // else {
  // return res.status(400).send("incorrect email or password");
  // throw new BadRequest("incorrect email or password");

  // res.status(400).json({
  //   success: false,
  //   message: "incorrect email or password",
  // });
  // }
  // } else {
  // return res.status(400).send("incorrect email or password");
  // throw new BadRequest("incorrect email or password");

  // res.status(400).json({
  //   success: false,
  //   message: "incorrect email or password",
  // });
  // }
  //  catch (error) {
  //   // res.status(400).send("server error");
  //   res.status(400).json({
  //     success: false,
  //     message: error,
  //   });
  // }
};

// ------------------------forgotPassword------------------------ //
export const forgetPassword = async (req, res) => {
  let { email } = req.body;
  // try {
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    throw new BadRequest("incorrect email");
    // return res.status(400).send("incorrect email");
  }
  const token = await logIn({ _id: user?._id });
  const verifyUrl = `https://newnftaly-production.up.railway.app/reset-password?token=${token}`;
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "waqasalisiddiqi121@gmail.com",
      pass: "ydxeuozgxbumwkbb",
    },
  });

  // Set up the email data
  const mailOptions = {
    from: "waqasalisiddiqi121@gmail.com",
    to: user?.email,
    subject: "Verify your Email",
    html: `<a href="${verifyUrl}">Varify email</a>`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new BadRequest("Error occurred while sending email");

      // console.log("Error occurred while sending email:", error.message);
      // return res.status(201).json({
      //   success: false,
      //   message: "Error occurred while sending email",
      // });
    }
  });
  await user.updateOne({ emailVerificationToken: token });
  res.status(201).json({
    success: true,
    message: "Check your email for further processing...",
    token,
  });
  // res.status(201).send("Enter Your New Password");
  // }
  // catch (error) {
  //   res.status(400).send(error);
  // }
};

// ------------------------resetPassword------------------------ //
export const reset = async (req, res) => {
  const { token, password } = req.body;
  // console.log(req.body);
  // try {
  const user = await User.findOne({ emailVerificationToken: token });
  console.log(user);
  if (!user) {
    throw new BadRequest("user not found");
    // return res.status(400).send("user not found");
    // return res.status(400).json({
    //   success: false,
    //   message: "user not found",
    // });
  }
  const hashPassword = bcrypt.hashSync(password, 10);
  console.log(hashPassword);
  await user.updateOne({ password: hashPassword });
  // await User.findByIdAndUpdate(user?._id, { password: hashPassword });
  // res.send("password changes successfully");
  res.status(201).json({
    success: true,
    message: "password changes successfully",
  });
  // }
  // catch (error) {
  //   res.status(400).send(error);
  // }
};
// ------------------------getuser------------------------ //

export const getUser = async (req, res) => {
  res.status(200).json({
    user: req?.user,
    message: "User Successfully Login",
  });
};
