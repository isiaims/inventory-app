import {
  getCategoryById,
  getAllCategories,
  getItemsByCategory,
  deleteCategory,
  getAuth,
} from "../db/queries.js";

export async function getCategories(req, res) {
  const categories = await getAllCategories();
  res.render("index", { categories, title: "Homepage" });
}

export async function getNewItem(req, res) {
  const categories = await getAllCategories();
  res.render("newItem", { categories, errors: [], title: "Add New Item" });
}

export async function getCategoryItems(req, res) {
  const categoryId = req.params.id;
  const category = await getCategoryById(categoryId);
  if (!category) {
    return res.sendStatus(404);
  }
  const items = await getItemsByCategory(categoryId);
  res.render("categoryItems", { items, title: category.category });
}

async function validate() {
  const confirm = document.querySelector(".confirm-delete");
  confirm.classList.add("open");
  const acceptbutton = confirm.querySelector("button.accept");
  const rejectbutton = confirm.querySelector("button.reject");
  const input = confirm.querySelector("input.password");
  const setAuth = async (message) => {
    const password = await getAuth()[0];
    return message === password;
  };
  acceptbutton.addEventListener("click", () => (authenticated = true));
  rejectbutton.addEventListener("click", () => (authenticated = false));
}

export async function deleteCategoryPost(req, res) {
  const categoryId = req.params.id;
  await deleteCategory(categoryId);
}
