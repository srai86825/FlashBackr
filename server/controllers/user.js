import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../models/user.js";

dotenv.config();

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res
        .status(404)
        .json({ message: "No user found with the specific email" });
    const isCorrectPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isCorrectPassword)
      return res.status(404).json({ message: "Password dosen't match" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({ result: existingUser, token });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  console.log("recieved for signup", req.body);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exisits" });
    if (confirmPassword !== password)
      return res.status(400).json({ message: "Passwords don't match." });
    const newUser = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: await bcrypt.hash(password, 12),
      //12 is salt difficulty level(higher takes more time)
    });

    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      result: newUser,
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
