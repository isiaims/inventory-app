import { getAllCategories } from "../db/queries.js";

export async function getCategories(req, res) {
  const categories = await getAllCategories();
  res.render("index", { categories, title: "Homepage" });
}
