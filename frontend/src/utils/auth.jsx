import axios from "axios";

const login = async (credentials) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/auth/login",
      credentials
    );
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export { login };
