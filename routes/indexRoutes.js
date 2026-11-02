import { Router } from "express";
import { getCategories, getNewItem } from "../controllers/indexControllers.js";
import { addItem } from "../controllers/itemControllers.js";

const indexRouter = Router();

indexRouter.get("/", getCategories);

indexRouter.get("/new-item", getNewItem);

indexRouter.post("/new-item", addItem);

export default indexRouter;
