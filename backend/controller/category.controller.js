const { Types } = require("mongoose");
const { sendResponse } = require("../lib/response.lib");
const { CategoryService } = require("../services");
const { CommonLib } = require("../lib");

const CategoryController = {
  async create(req, res) {
    try {
      const categoryData = req.body;
      const newCategory = await CategoryService.createCategory(categoryData);
      return sendResponse(res, 201, "created", newCategory, false);
    } catch (error) {
      return sendResponse(res, 500, { message: error.message }, true);
    }
  },

  async getAll(req, res) {
    try {
      const filter = {
        is_deleted: false,
      };
      const categories = {};
      const query = req.query;
      const page = query.page ? parseInt(query.page) : 1;
      const size = query.size ? parseInt(query.size) : 10;
      const index = page ? (page - 1) * size : 0;
      const { category, count } = await CategoryService.getAllCategories({
        filter,
        sort: { createdAt: -1 },
      });
      categories.categories = CommonLib.paginateArray(category, page, size);
      categories.pagination = CommonLib.getPagination(page, size, count);
      return sendResponse(res, 200, "Categories Fetched", categories, false);
    } catch (error) {
      return sendResponse(res, 500, error.message, {}, true);
    }
  },

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const category = await CategoryService.getOneCategory({
        _id: id,
        is_deleted: false,
      });
      if (!category) {
        return sendResponse(
          res,
          404,
          "Category not found",
          { message: "Category not found" },
          true
        );
      }
      return sendResponse(res, 200, "Category fetched", category, false);
    } catch (error) {
      return sendResponse(res, 500, error.message, {}, true);
    }
  },

  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedCategory = await CategoryService.updateCategory({
        filter: { _id: id, is_deleted: false },
        data: updateData,
      });
      if (updatedCategory.modifiedCount === 0) {
        return sendResponse(
          res,
          404,
          "Category not found or no changes made",
          { message: "Category not found or no changes made" },
          true
        );
      }
      return sendResponse(res, 200, "Category updated successfully", {}, false);
    } catch (error) {
      return sendResponse(res, 500, error.message, {}, true);
    }
  },

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const deletedCategory = await CategoryService.deleteCategory({
        _id: id,
        is_deleted: false,
      });
      if (deletedCategory.modifiedCount === 0) {
        return sendResponse(
          res,
          404,
          { message: "Category not found or already deleted" },
          true
        );
      }
      return sendResponse(res, 200, "Category deleted successfully", {}, false);
    } catch (error) {
      return sendResponse(res, 500, error.message, {}, true);
    }
  },
};

module.exports = CategoryController;
