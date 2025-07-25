import axios from "axios";

const API_URL = "/sales";

export const getAllSales = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching sales data: " + error.message);
  }
};
