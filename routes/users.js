import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  forgetPassword,
  reset,
  getUser,
} from "../controllers/users.js";
import { catchAsync } from "../middlewares/handleErrors.js";
export const userRout = Router();
userRout.post("/register", catchAsync(register));
userRout.post("/login", catchAsync(login));
userRout.post("/forgetPassword", catchAsync(forgetPassword));
userRout.post("/reset-password", catchAsync(reset));
userRout.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  catchAsync(getUser)
);
