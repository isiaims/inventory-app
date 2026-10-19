import express from "express";
const { PORT } = process.env;
import path from "node:path";
import { fileURLToPath } from "node:url";
import indexRouter from "./routes/indexRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsPath = path.join(__dirname, "public");
const viewsPath = path.join(__dirname, "view");

const app = express();

app.use(express.static(assetsPath));
app.set("views", viewsPath);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);

app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`App runing on port ${PORT}`);
});
