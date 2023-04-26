import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
const router = express.Router();

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.redirect("/auth/oops");
  }
  next();
};

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get("/oops", (req, res) => {
  res.send("Opps, you are not authenticated");
});

router.get("/login", (req, res) => {
  res.send("Login");
});

router.get("/logout", (req, res) => {
  req.logout((error) => console.log(`There was an ${error}`));
  res.redirect("/");
});

router.get("/protected-route", checkAuth, (req, res) => {
  res.send(`My req user information is ${req.user}`);
  // res.redirect("/");
});

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.send(`This is the callback route ${req.user}`);
});

export default router;
