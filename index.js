import express, { Router } from "express";
import { userRout } from "./routes/users.js";
import "dotenv/config";
import { db } from "./database/db.js";
import cors from "cors";
// import session from "express-session";

import path from "path";
import passport from "passport";
import { passportMiddleware } from "./middlewares/passportMiddleware.js";
import { serverError } from "./middlewares/handleErrors.js";
const app = express();

const port = process.env.PORT || PORT;
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(path.resolve(), "dist")));

app.use(passport.initialize());
passportMiddleware(passport);
const main = async () => {
  app.listen(port, async () => {
    console.log(`Server running on ${port}`);
    db();
  });
};
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
//---------------- API ROUTES --------------------
app.use("/api/auth", userRout);

// app.get("/*", (req, res) => {
//   res.status(404).json({ message: "No Such Route Exists!" });
// });

app.get("/*", (req, res) => {
  res.status(200).sendFile(path.join(path.resolve(), "dist/index.html"));
});
// app.use(express.static(path.resolve(__dirname, "dist")));
// server.get("*", (req, res) => res.sendFile(path.resolve("dist", "index.html")));
app.use(serverError);
