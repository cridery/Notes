import axios from "axios";

export const goPut = async (id, noteData) => {
  try {
    const response = await axios.put(`http://localhost:8080/notes/${id}`, noteData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};