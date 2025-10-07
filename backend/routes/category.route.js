const CategoryController = require("../controller/category.controller");

const Router = require("express").Router();

Router.post("/", CategoryController.create);
Router.get("/", CategoryController.getAll);
Router.get("/:id", CategoryController.getOne);
Router.put("/:id", CategoryController.updateCategory);
Router.delete("/:id", CategoryController.deleteCategory);

module.exports = Router;
