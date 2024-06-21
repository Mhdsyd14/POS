import axios from "axios";

const API_URL = "http://localhost:3000/auth/register";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Kesalahan jaringan");
  }
};
