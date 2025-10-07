"use strict";
const monggose = require("mongoose");
const process = require("process");
const User = require("./user.model");
const SubCategory = require("./sub-category.model");
const Product = require("./product.model");
const Category = require("./category.model");
const Session = require("./session.model");
const Otp = require("./otp.model");

const mongooseConn = monggose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongooseConn
  .then((r) => {
    console.log("MongoDB connected successfully");
  })
  .catch((e) => {
    console.log("DB Connection Error: ", e);
  });

module.exports = {
  Category,
  SubCategory,
  Product,
  User,
  Session,
  Otp
};
