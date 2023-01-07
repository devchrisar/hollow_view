import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import { join } from "path";
import mongoose from "mongoose";

import { router as LoginRouter } from "./routes/login.route";
import { router as HomeRouter } from "./routes/home.route";
import { router as AlbumRouter } from "./routes/albums.route";
import { router as PhotosRouter } from "./routes/photos.route";

import { IUser } from "./model/user.model";

declare module "express-session" {
  interface Session {
    user: IUser;
  }
}

export const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(join(__dirname, "../public")));
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(LoginRouter);
app.use(HomeRouter);
app.use(PhotosRouter);
app.use(AlbumRouter);

const options: mongoose.ConnectOptions = {
    dbName: process.env.DB_NAME as string,
    user: process.env.DB_USER as string,
    pass: process.env.DB_PASS as string,
};

mongoose.set('strictQuery', false);
(async () => {
    await mongoose.connect(process.env.DB_CONNECTION as string, options);
        console.log("Connected to database");
})();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

const port = 3001;

app.use(function (req,res,next) {
  res.render("error/404");
});

app.listen(port, () => {
  console.log("Listening on port", port);
});
