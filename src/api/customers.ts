import axios from "axios";

const API_URL = "/customers";

export const getAllCustomers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error fetching customers data: " + error.message);
    }
    throw new Error("Error fetching customers data: " + String(error));
  }
};
