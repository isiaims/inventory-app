import { Router } from "express";
import { getCategoryItems } from "../controllers/indexControllers.js";

const categoryRouter = Router();

categoryRouter.get("/:id", getCategoryItems);

export default categoryRouter;
