import apiRequest from "../utils/api";
import queryClient from "../utils/queryClient";

const productsKey = "products";

export function useProducts(options = {}) {
  const {
    filters = {},
    sort = { field: "created_at", direction: "desc" },
    pagination = { page: 1, limit: 10 },
  } = options;

  const fetchProducts = async () => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", pagination.page);
    queryParams.append("size", pagination.limit);
    queryParams.append("sortField", sort.field);
    queryParams.append("sortDirection", sort.direction);
    queryParams.append("search_value", filters.search_value || "");
    delete filters.search_value;

    const response = await apiRequest.get(
      `/products/?${queryParams.toString()}&filter=${JSON.stringify(filters)}`
    );
    return response.data;
  };

  const createProducts = async (productsData) => {
    const response = await apiRequest("/products", {
      method: "POST",
      data: productsData,
    });
    queryClient.invalidateQueries({ queryKey: [productsKey] });
    return response;
  };

  const updateProducts = async ({ id, productsData }) => {
    const response = await apiRequest(`/products/${id}`, {
      method: "PUT",
      data: productsData,
    });
    queryClient.invalidateQueries({ queryKey: [productsKey] });
    return response;
  };

  const deleteProducts = async (id) => {
    await apiRequest(`/products/${id}`, {
      method: "DELETE",
    });
    queryClient.invalidateQueries({ queryKey: [productsKey] });
    return id;
  };

  const fetchProductsForLanding = async () => {
    const response = await apiRequest.get(`/products/landing`, {
      skipAuth: true,
    });
    return response.data;
  };

  return {
    fetchProducts,
    createProducts,
    updateProducts,
    deleteProducts,
    fetchProductsForLanding
  };
}
