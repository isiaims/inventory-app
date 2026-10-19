import { Router } from "express";
import { getCategories } from "../controllers/indexControllers.js";

const indexRouter = Router();

indexRouter.get("/", getCategories);

export default indexRouter;
