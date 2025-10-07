const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default : ""
    },
    description: {
      type: String,
      default: "",
    },
    is_deleted : {
      type : Boolean,
      default : false
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
