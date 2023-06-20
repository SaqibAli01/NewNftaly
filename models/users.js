import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  password: String,
  emailVerificationToken: String,
});
const User = mongoose.model("User", UserSchema);
export default User;
