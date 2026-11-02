import bcrypt from "bcrypt";
import { body, matchedData, validationResult } from "express-validator";
import {
  addItemToCategory,
  deleteItem,
  getAllCategories,
  getAllItems,
  getAuth,
  getItemsByCategory,
  updateItem,
} from "../db/queries.js";

export async function getItem(req, res) {
  const itemId = Number(req.params.itemID);
  const categoryId = Number(req.params.categoryID);
  const items = await getItemsByCategory(categoryId);
  const item = items.find((item) => item.item_id === itemId);
  if (!item) {
    return res.sendStatus(404);
  }
  res.render("item", { item, title: "Product ID: " + item.item_id });
}

export async function getItems(req, res) {
  const items = await getAllItems();
  res.render("allItems", { items, title: "All Stock" });
}

const validation = [
  body("item_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Item name cannot be empty"),
  body("price")
    .trim()
    .isInt({ min: 10 })
    .withMessage("Item price must be above $10.")
    .toInt(),
  body("rating")
    .trim()
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5")
    .toInt(),
  body("stock")
    .trim()
    .isInt({ min: 1, max: 2000 })
    .withMessage("Min stock: 1, Max stock: 2000")
    .toInt(),
  body("categoryId").trim().isInt().toInt(),
  body("description")
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description should not exceed 200 characters.")
    .escape(),
];

export const addItem = [
  validation,
  async (req, res) => {
    const errors = validationResult(req);
    const categories = await getAllCategories();
    if (!errors.isEmpty()) {
      return res.status(400).render("newItem", {
        categories,
        title: "Add New Item",
        errors: errors.array(),
      });
    }
    const { item_name, price, rating, stock, categoryId, description } =
      matchedData(req);

    const itemImage = categories.find(
      (category) => category.id === categoryId,
    ).category_image;

    await addItemToCategory({
      name: item_name,
      price,
      rating,
      stock,
      description,
      itemImage,
      categoryId,
    });
    const items = await getAllItems();
    res.render("allItems", { items, title: "All Stock" });
  },
];

async function isValidAdminPassword(userInput) {
  if (typeof userInput !== "string") {
    return false;
  }

  const [auth] = await getAuth();
  return Boolean(auth && (await bcrypt.compare(userInput, auth.pass)));
}

export async function deleteItemPost(req, res) {
  const itemId = Number(req.params.itemID);
  if (!(await isValidAdminPassword(req.body.password))) {
    return res.status(401).send("Invalid password");
  }
  await deleteItem(itemId);
  res.redirect("/items");
}

export async function updateItemGet(req, res) {
  const itemId = Number(req.params.itemID);
  const categoryId = Number(req.params.categoryID);
  const items = await getItemsByCategory(categoryId);
  const item = items.find((item) => item.item_id === itemId);
  if (!item) {
    return res.sendStatus(404);
  }
  const categories = await getAllCategories();
  res.render("editItem", { title: "Edit Item", item, categories, errors: [] });
}

export const updateItemPost = [
  validation,
  async (req, res) => {
    const itemId = Number(req.params.itemID);
    const categoryId = Number(req.params.categoryID);
    const items = await getItemsByCategory(categoryId);
    const item = items.find((item) => item.item_id === itemId);
    if (!item) {
      return res.sendStatus(404);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const categories = await getAllCategories();
      return res.status(400).render("editItem", {
        title: "Edit Item",
        item,
        categories,
        errors: errors.array(),
      });
    }

    const {
      item_name,
      price,
      rating,
      stock,
      categoryId: newCategoryId,
      description,
    } = matchedData(req);

    if (!(await isValidAdminPassword(req.body.password))) {
      return res.status(401).send("Invalid password");
    }

    await updateItem({
      name: item_name,
      price,
      rating,
      stock,
      description,
      categoryId: newCategoryId,
      item_id: itemId,
    });
    return res.redirect("/items");
  },
];
