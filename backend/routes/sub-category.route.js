const SubCategoryController = require("../controller/sub-category.controller");

const Router = require("express").Router();

Router.post("/", SubCategoryController.create);
Router.get("/", SubCategoryController.getAll);
Router.get("/:id", SubCategoryController.getOne);
Router.put("/:id", SubCategoryController.updateSubCategory);
Router.delete("/:id", SubCategoryController.deleteSubCategory);

module.exports = Router;
