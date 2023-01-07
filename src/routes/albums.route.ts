import express, { NextFunction, Request, Response } from "express";
import User, { IUser } from "../model/user.model";
import Album, { IAlbum } from "../model/album.model";
import Photo, { IPhoto } from "../model/photo.model";
export const router = express.Router();

import { middleware } from "../middleware/auth.middleware";

router.get(
  "/albums",
  middleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const albums = await Album.find({ userid: req.session.user._id! });
      res.render("albums/index", { user: req.session.user, albums: albums });
    } catch (error) {}
  }
);

router.get(
  "/albums/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const albumid = req.params.id;

    try {
      let photos = await Photo.find({ albums: albumid });

      let album = await Album.findById(albumid);
      const albums = await Album.find({ userid: req.session.user._id! });

      if (album?.userid !== req.session.user._id && album?.isPrivate) {
        res.render("error/privacy", {});
        return;
      }

      res.render("albums/view", {
        user: req.session.user,
        photos,
        album,
        albums,
      });
    } catch (error) {}
  }
);

router.post(
  "/create-album",
  middleware, async (req: Request, res: Response, next: NextFunction) => {
    const { name, isPrivate }: { name: string; isPrivate: string } = req.body;

    const albumProps: IAlbum = {
      name,
      userid: req.session.user._id!,
      isPrivate: isPrivate === "on",
      createdAt: new Date(),
    };
    try {
      const album = await new Album(albumProps);
      album.save();
      res.redirect("/albums");
    } catch (error) {}
  }
);
