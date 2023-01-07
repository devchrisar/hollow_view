import express, { NextFunction, Request, Response } from "express";

import User, { IUser } from "../model/user.model";

import { middlewareHome } from "../middleware/auth.middleware";

export const router = express.Router();

router.get("/login", middlewareHome, (req: Request, res: Response) => {
  res.render("login/index");
});

router.get("/signup", middlewareHome, (req: Request, res: Response) => {
  res.render("login/signup");
});

router.post(
  "/register",
  middlewareHome, async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, name }: IUser = req.body;

    if (!username || !password || !name) {
      console.log("Missing fields");
      res.redirect("/signup");
    } else {
      const userProps = { username, password, name };
      const user = new User(userProps);
      try {
        const exists = await user.usernameExists(username);

        if (exists) res.redirect("/signup");

        await user.save();

        res.redirect("/login");
      } catch (error) {
        res.redirect("/login");
      }
    }
  }
);

router.post(
  "/auth",
  middlewareHome, async (req: Request, res: Response, next: NextFunction) => {
    const { username, password }: IUser = req.body;

    if (!username || !password) {
      console.log("Missing fields");
      res.redirect("/login");
    } else {
      try {
        const user = new User();
        const userExists = await user.usernameExists(username);
        if (userExists) {
          const userFound = await User.findOne({ username });
          const isCorrectPassword = await user.isCorrectPassword(
            password,
            userFound.password
          );
          if (isCorrectPassword) {
            req.session.user = userFound;
            res.redirect("/home");
          } else {
            res.redirect("/login");
          }
        } else {
          res.redirect("/login");
        }
      } catch (error) {
        res.redirect("/login");
      }
    }
  }
);
