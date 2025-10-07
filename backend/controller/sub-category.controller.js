const { Types } = require("mongoose");
const { sendResponse } = require("../lib/response.lib");
const { SubCategoryService } = require("../services");
const { CommonLib } = require("../lib");

const CategoryController = {
  async create(req, res) {
    try {
      const categoryData = req.body;
      const newCategory = await SubCategoryService.createSubCategory(
        categoryData
      );
      return sendResponse(res, 201, newCategory, false);
    } catch (error) {
      return sendResponse(res, 500, { message: error.message }, true);
    }
  },

  async getAll(req, res) {
    try {
      const filter = {
        is_deleted: false,
      };
      const query = req.query;
      const page = query.page ? parseInt(query.page) : 1;
      const size = query.size ? parseInt(query.size) : 10;
      const response = {};
      const index = page ? (page - 1) * size : 0;
      const { count, subCategories } =
        await SubCategoryService.getAllSubCategories({
          filter,
          sort: { createdAt: -1 },
          limit: size,
          index,
        });
      response.pagination = CommonLib.getPagination(count, page, size);
      response.sub_categories = subCategories;
      return sendResponse(res, 200, "Success", response, false);
    } catch (error) {
      return sendResponse(
        res,
        500,
        error.message,
        { message: error.message },
        true
      );
    }
  },

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const category = await SubCategoryService.getOneSubCategory({
        _id: new Types.ObjectId(id),
        is_deleted: false,
      });
      if (!category) {
        return { message: "Category not found" };
      }
      return sendResponse(res, 200, category, false);
    } catch (error) {
      return sendResponse(res, 500, { message: error.message }, true);
    }
  },

  async updateSubCategory(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedCategory = await SubCategoryService.updateSubCategory(
        { _id: new Types.ObjectId(id), is_deleted: false },
        updateData
      );
      if (!updatedCategory.matchedCount) {
        return sendResponse(res, 404, "Category not found", {}, true);
      }
      return sendResponse(
        res,
        200,
        "Category Updated successfully",
        updatedCategory,
        false
      );
    } catch (error) {
      return sendResponse(res, 500, { message: error.message }, true);
    }
  },

  async deleteSubCategory(req, res) {
    try {
      const { id } = req.params;
      const deletedCategory = await SubCategoryService.deleteSubCategory({
        _id: new Types.ObjectId(id),
        is_deleted: false,
      });
      if (!deletedCategory.matchedCount) {
        return sendResponse(res, 404, "Category not found", {}, true);
      }
      return sendResponse(
        res,
        200,
        "Category deleted successfully",
        deletedCategory,
        false
      );
    } catch (error) {
      return sendResponse(res, 500, { message: error.message }, true);
    }
  },
};

module.exports = CategoryController;
