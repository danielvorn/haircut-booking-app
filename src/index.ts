import cookieSession from "cookie-session";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import "./config/passport";
import authRoutes from "./routes/auth.routes";
import { COOKIE_KEY, MONGO_URI, PORT } from "./utils/secrets";

const app = express();

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [COOKIE_KEY],
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(MONGO_URI);

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Yahhhhh");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
