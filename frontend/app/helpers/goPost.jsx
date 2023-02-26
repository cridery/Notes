import axios from "axios";

export const goPost = async (noteData) => {
  try {
    const response = await axios.post("http://localhost:8080/create", noteData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
