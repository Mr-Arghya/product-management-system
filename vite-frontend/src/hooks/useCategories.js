import apiRequest from "../utils/api";
import queryClient from "../utils/queryClient";

const categoriesKey = "category";

export function useCategories(options = {}) {
  const {
    filters = {},
    sort = { field: "created_at", direction: "desc" },
    pagination = { page: 1, limit: 10 },
  } = options;

  const fetchCategories = async () => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", pagination.page);
    queryParams.append("size", pagination.limit);
    queryParams.append("sortField", sort.field);
    queryParams.append("sortDirection", sort.direction);

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value);
      }
    }

    const response = await apiRequest.get(
      `/category/?${queryParams.toString()}`
    );
    return response.data;
  };

  const createCategories = async (categoriesData) => {
    const response = await apiRequest("/category", {
      method: "POST",
      data: categoriesData,
    });
    queryClient.invalidateQueries({ queryKey: [categoriesKey] });
    return response;
  };

  const updateCategories = async ({id, categoriesData}) => {
    const response = await apiRequest(`/category/${id}`, {
      method: "PUT",
      data: categoriesData,
    });
    queryClient.invalidateQueries({ queryKey: [categoriesKey] });
    return response;
  };

  const deleteCategories = async (id) => {
    await apiRequest(`/category/${id}`, {
      method: "DELETE",
    });
    queryClient.invalidateQueries({ queryKey: [categoriesKey] });
    return id;
  };

  return {
    fetchCategories,
    createCategories,
    updateCategories,
    deleteCategories,
  };
}
