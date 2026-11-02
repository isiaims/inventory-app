import { Router } from "express";
import {
  deleteItemPost,
  getItem,
  getItems,
  updateItemGet,
  updateItemPost,
} from "../controllers/itemControllers.js";

const itemRouter = Router();

itemRouter.get("/", getItems);

itemRouter.get("/:categoryID/:itemID", getItem);

itemRouter.post("/:itemID/delete", deleteItemPost);

itemRouter.get("/:categoryID/:itemID/edit-item", updateItemGet);

itemRouter.post("/:categoryID/:itemID/edit-item", updateItemPost);

export default itemRouter;
