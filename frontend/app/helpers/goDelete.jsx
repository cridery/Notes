import axios from "axios";

export const goDelete = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:8080/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};