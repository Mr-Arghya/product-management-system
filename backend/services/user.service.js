const { User } = require("../models");
const NotificationService = require("./notification.service");

const UserService = {
  async createUser(data) {
    const user = (await User.create(data)).toJSON();  
    return user;
  },
  async findOneUser(filter) {
    return await User.findOne(filter).lean();
  },
  async findAllUsers({ sort = { createdAt: -1 }, filter = {}, index, size }) {
    return await User.find(filter).sort(sort).skip(index).limit(size).lean();
  },
};

module.exports = UserService;
