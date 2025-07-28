import axios from "axios";

const API_URL = "/products";

export const getAllProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error fetching products data: " + error.message);
    }
    throw new Error("Error fetching products data: " + String(error));
  }
};
