const formatter = {
  async formatFilter(req, res, next) {
    try {
      const query = req.query;
      const filterParam = query?.filter ? JSON.parse(query.filter) : {};

      if (Object.keys(filterParam).length === 0) {
        return next();
      }
      const formattedFilter = {
        [filterParam.field]: new RegExp(String(filterParam.value).trim(), "i"),
      };
      req.filter = formattedFilter;
      next();
    } catch (error) {
      next(error);
    }
  },

  async formatPageAndSize(req, res, next) {
    try {
      const query = req.query;
      const page =
        query.page && query.page !== "undefined" ? parseInt(query.page) : 1;
      const size =
        query.size && query.size !== "undefined" ? parseInt(query.size) : 10;
      req.query.page = page;
      req.query.size = size;
      next();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = formatter;
