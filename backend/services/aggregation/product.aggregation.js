const AGGREGATION = [
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
];

module.exports = AGGREGATION;
