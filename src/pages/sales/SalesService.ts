import axios from "axios";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const API_URL_CUSTOMERS = `${REACT_APP_API_URL}/customers`;
const API_URL_PAYMENT_METHODS = `${REACT_APP_API_URL}/payment-methods`;
const API_URL_PRODUCTS = `${REACT_APP_API_URL}/products`;
const API_URL_SALES = `${REACT_APP_API_URL}/sales`;

export const getAllCustomers = async () => {
  try {
    const response = await axios.get(API_URL_CUSTOMERS);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error fetching customers data: " + error.message);
    }
    throw new Error("Error fetching customers data: " + String(error));
  }
};

export const getAllPaymentMethods = async () => {
  try {
    const response = await axios.get(API_URL_PAYMENT_METHODS);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error fetching payment methods data: " + error.message);
    }
    throw new Error("Error fetching payment methods data: " + String(error));
  }
};

export const getAllProducts = async () => {
  try {
    const response = await axios.get(API_URL_PRODUCTS);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error fetching products data: " + error.message);
    }
    throw new Error("Error fetching products data: " + String(error));
  }
};

export const getAllSales = async () => {
  try {
    const response = await axios.get(API_URL_SALES);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error fetching sales data: " + error.message);
    }
    throw new Error("Error fetching sales data: " + String(error));
  }
};
