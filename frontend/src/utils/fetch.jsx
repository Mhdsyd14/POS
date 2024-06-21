import axios from "axios";

const fetchData = async (url, config = {}) => {
  try {
    const response = await axios.get(url, config);
    return response;
  } catch (error) {
    console.error("error fetching data:", error);
    throw error;
  }
};

export default fetchData;
