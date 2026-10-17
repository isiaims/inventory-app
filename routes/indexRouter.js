import { Router } from "express";
import getNewMessage from "../controllers/newMessageController.js";
import { getMessages } from "../db/queries.js";

const indexRouter = Router();

indexRouter.get("/", async (req, res) => {
  const messages = await getMessages();
  res.render("index", { title: "Mini Messageboard", messages });
});

indexRouter.post("/new", getNewMessage);

export default indexRouter;
