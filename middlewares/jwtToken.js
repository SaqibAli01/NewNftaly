import jwt from "jsonwebtoken";
import "dotenv/config";

const { APP_SECRET } = process.env;

export const logIn = (user) =>
  new Promise((resolve, reject) => {
    jwt.sign(user, APP_SECRET, (error, token) => {
      if (!error) {
        // resolve(token);
        resolve(`Bearer ${token}`); //for passport
      } else {
        reject(error);
      }
    });
  });
