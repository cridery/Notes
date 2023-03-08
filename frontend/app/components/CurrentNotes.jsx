import React, { useEffect, useState } from "react";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { goPut } from "../helpers/goPut";
import { goDelete } from "../helpers/goDelete";

const CurrentNotesList = () => {
  const revalidator = useRevalidator();
  const notes = useLoaderData();

  const data = notes?.notes;

  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedNoteBody, setSelectedNoteBody] = useState("");
  const [selectedNoteTitle, setSelectedNoteTitle] = useState("");

  const [editButtonState, setEditButtonState] = useState(false);

  const noteFullinfo = data?.find((note) => note.ID === selectedNoteId);

  const handleSaveNote = () => {
    goPut(selectedNoteId, {
      title: selectedNoteTitle,
      body: selectedNoteBody,
    }).then((response) => {
      if (response.success) {
        setEditButtonState(false);
      }
    });
  };

  const handleDeleteNote = () => {
    goDelete(selectedNoteId).then((response) => {
      if (response.success) {
        revalidator.revalidate();
        setSelectedNoteId(null);
      }
    });
  };

  const handleTitleChange = (e) => {
    setSelectedNoteTitle(e.target.value);
  };

  const handleBodyChange = (e) => {
    setSelectedNoteBody(e.target.value);
  };

  useEffect(() => {
    if (
      noteFullinfo?.body !== selectedNoteBody ||
      noteFullinfo?.title !== selectedNoteTitle
    ) {
      setEditButtonState(true);
    } else {
      setEditButtonState(false);
    }
  }, [selectedNoteBody, selectedNoteTitle, noteFullinfo]);

  useEffect(() => {
    const selectedNote = selectedNoteId
      ? data.find((note) => note.ID === selectedNoteId)
      : null;
    setSelectedNoteBody(selectedNote?.body || "");
    setSelectedNoteTitle(selectedNote?.title || "");
  }, [selectedNoteId, data]);

  return (
    <>
      <div className="flex w-full">
        <div className="w-1/4 border-r pb-2">
          {/* <div className="text-xl font-semibold">Notes list</div>
          <hr></hr> */}
          {data.map((note, key) => (
            <div key={key}>
              <div onClick={() => setSelectedNoteId(note.ID)} className>
                <div className="cursor-pointer text-lg font-medium ">
                  {note.title}
                </div>
                <span className="text-gray-500">
                  {note.body.length > 15
                    ? `${note.body.substring(0, 15)}...`
                    : note.body}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="w-3/4 p-4 ">
          {selectedNoteId !== null ? (
            <>
              <label>
                <input
                  type="text"
                  value={selectedNoteTitle}
                  className="w-full px-3 py-2 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:border-blue-300"
                  onChange={handleTitleChange}
                />
              </label>
              <label className="">
                <textarea
                  value={selectedNoteBody}
                  onChange={handleBodyChange}
                  className="w-full px-3 py-2 mt-4 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:border-blue-300"
                  rows={5}
                />
              </label>
            </>
          ) : (
            // <label className="grid pt-2">
            //   <input
            //     type="text"
            //     value={selectedNoteTitle}
            //     className="text-xl font-semibold"
            //     onChange={handleTitleChange}
            //   >
            //   </input>
            //   <textarea
            //     value={selectedNoteBody}
            //     onChange={handleBodyChange}
            //     className="mt-2"
            //   />
            // </label>
            <div>Please select a note.</div>
          )}
          <div className="flex justify-end w-full">
            <div className="flex space-x-2">
              {selectedNoteId && (
                <div className="cursor-pointer w-full pb-2">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleDeleteNote}
                  >
                    Delete
                  </button>
                </div>
              )}

              {selectedNoteId && editButtonState && (
                <div className="cursor-pointer pb-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleSaveNote}
                  >
                    Išsaugoti
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrentNotesList;
