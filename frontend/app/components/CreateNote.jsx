import { Form } from "@remix-run/react";
import React, { useState } from "react";
import { goPost } from "../helpers/goPost";

const CreateNoteForm = () => {
  
  const [noteData, setNoteData] = useState({
    title: "",
    body: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNoteData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await goPost(noteData);

    console.log(response);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={noteData.title}
            onChange={handleChange}
            className="border border-gray-400 py-2 px-4 rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="body" className="block text-gray-700 font-bold mb-2">
            Body
          </label>
          <textarea
            id="body"
            name="body"
            value={noteData.body}
            onChange={handleChange}
            className="border border-gray-400 py-2 px-4 rounded w-full h-40"
            required
          />
        </div>
        <div className="flex justify-end">
          {/* <Form method="get" action=""> */}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Create Note
            </button>
          {/* </Form> */}
        </div>
      </form>
    </>
  );
};

export default CreateNoteForm;
