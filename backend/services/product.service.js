const { Product } = require("../models");

const ProductService = {
  async createProduct(productData) {
    const product = await Product.create(productData);
    return product;
  },

  async getAllProducts({ filter = {}, sort = { createdAt: -1 } }) {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                from: "sub_categories",
                localField: "sub_category_id",
                foreignField: "_id",
                as: "SubCategory",
              },
            },
          ],
          as: "Category",
        },
      },
      {
        $match: filter,
      },
      { $sort: sort },
    ]);
    return products;
  },

  async updateProduct(filter, updateData) {
    const updatedProduct = await Product.updateOne(
      filter,
      { $set: updateData },
      { new: true }
    );
    return updatedProduct;
  },
};

module.exports = ProductService;
