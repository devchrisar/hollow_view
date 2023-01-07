import express, { NextFunction, Request, Response } from "express";
export const router = express.Router();

import Album, { IAlbum } from "../model/album.model";
import Photo, { IPhotoReq, IPhoto, IPhotoFavReq } from "../model/photo.model";

import { middleware } from "../middleware/auth.middleware";

router.post("/add-to-album", middleware, async (req: Request, res: Response) => {
  const { ids, albumid }: IPhotoReq = req.body;

  const idPhotos = ids.split(",");

  const promises = [];

  for (let i = 0; i < idPhotos.length; i++) {
    promises.push(
      Photo.findByIdAndUpdate(idPhotos[i], {
        $push: { albums: albumid as any },
      })
    );
  }

  await Promise.all(promises);

  res.redirect("/home");
});

router.post("/add-favorite", middleware, async (req: Request, res: Response) => {
  const { photoid, origin }: IPhotoFavReq = req.body;

  try {
    await Photo.findByIdAndUpdate(photoid, { $set: { favorite: true as any } });

    res.redirect(origin);
  } catch (error) {}
});

router.post("/remove-favorite", middleware, async (req: Request, res: Response) => {
  const { photoid, origin }: IPhotoFavReq = req.body;

  try {
    await Photo.findByIdAndUpdate(photoid, {
      $set: { favorite: false as any },
    });

    res.redirect(origin);
  } catch (error) {}
});

router.get("/view/:photoid", middleware, async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.photoid as string;
  const origin = req.query.origin as string;

  try {
    const photo = await Photo.findById(id);

    res.render("layout/preview", {
      user: req.session.user,
      photo,
      origin,
    });
  } catch (error) {}
});
