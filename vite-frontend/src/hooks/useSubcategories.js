import apiRequest from "../utils/api";
import queryClient from "../utils/queryClient";

const subcategoriesKey = "sub-categories";

export function useSubcategories(options = {}) {
  const {
    filters = {},
    sort = { field: "created_at", direction: "desc" },
    pagination = { page: 1, limit: 10 },
  } = options;

  const fetchSubcategories = async () => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", pagination.page);
    queryParams.append("limit", pagination.limit);
    queryParams.append("sortField", sort.field);
    queryParams.append("sortDirection", sort.direction);

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value);
      }
    }

    const response = await apiRequest.get(
      `/sub-category/?${queryParams.toString()}`
    );
    return response.data;
  };

  const createSubcategory = async (subcategoryData) => {
    console.log(subcategoryData, "<----subcategoryData");
    const response = await apiRequest("/sub-category", {
      method: "POST",
      data: subcategoryData,
    });
    queryClient.invalidateQueries({ queryKey: [subcategoriesKey] });
    return response;
  };

  const updateSubcategory = async ({ _id, subcategoryData }) => {
    const response = await apiRequest(`/sub-category/${_id}`, {
      method: "PUT",
      data: subcategoryData,
    });
    queryClient.invalidateQueries({ queryKey: [subcategoriesKey] });
    return response;
  };

  const deleteSubcategory = async (id) => {
    await apiRequest(`/sub-category/${id}`, {
      method: "DELETE",
    });
    queryClient.invalidateQueries({ queryKey: [subcategoriesKey] });
    return id;
  };

  return {
    fetchSubcategories,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
  };
}
