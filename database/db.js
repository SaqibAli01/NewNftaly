import mongoose from "mongoose";
import "dotenv/config";
export const db = () => {
  mongoose
    .connect(process.env.MONGO_DB)
    .then(() => {
      console.log("db connected...");
    })
    .catch((err) => {
      console.log(err);
    });
};
