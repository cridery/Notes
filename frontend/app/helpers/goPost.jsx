export const goPost = async (noteData) => {
  const response = await fetch("/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noteData),
  });
  const data = await response.json();
  return data;
};
