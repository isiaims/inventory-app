import express from "express";
import path from "node:path";
import indexRouter from "./routes/indexRouter.js";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsPath = path.join(__dirname, "public");
const viewsPath = path.join(__dirname, "view");

const app = express();

app.use(express.static(assetsPath));
app.set("views", viewsPath);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ status: "fine" });
});

app.use("/", indexRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err);
});

export default app;
