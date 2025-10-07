import api from "../utils/api";

export function useUpload() {
  const uploadFile = async (
    file,
    endpoint = "/claudinary-upload",
    additionalData = {}
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      Object.keys(additionalData).forEach((key) => {
        formData.append(key, additionalData[key]);
      });

      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  const uploadMultipleFiles = async (
    files,
    endpoint = "/claudinary-upload",
    additionalData = {}
  ) => {
    try {
      const formData = new FormData();

      files.forEach((file, index) => {
        formData.append(`files`, file);
      });

      Object.keys(additionalData).forEach((key) => {
        formData.append(key, additionalData[key]);
      });

      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Multiple files upload failed:", error);
      throw error;
    }
  };

  return {
    uploadFile,
    uploadMultipleFiles,
  };
}
