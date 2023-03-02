import React, { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { goPut } from "../helpers/goPut";

const CurrentNotesList = () => {
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
    }).then(response => {
      if (response.success) {
        setEditButtonState(false);
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
    if(noteFullinfo?.body === selectedNoteBody){
      setEditButtonState(false);
    } else {
      setEditButtonState(true);
    } 

    if(noteFullinfo?.title === selectedNoteTitle){
      setEditButtonState(false);
    } else {
      setEditButtonState(true);
    } 
  }, [selectedNoteBody, noteFullinfo, selectedNoteTitle])

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
          <div className="text-xl font-semibold">Notes list</div>
          {data.map((note, key) => (
            <div key={key}>
              <div onClick={() => setSelectedNoteId(note.ID)}>
                <span className="cursor-pointer">{note.title}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="w-3/4 pl-4 grid content-between">
          {selectedNoteId !== null ? (
            <label className="grid">
              <input 
                type="text"
                value={selectedNoteTitle}
                className="text-xl font-semibold"
                onChange={handleTitleChange}
              >
              </input>
              <input
                type="text"
                value={selectedNoteBody}
                onChange={handleBodyChange}
                className="mt-2"
              />
            </label>
          ) : (
            <div>Please select a note.</div>
          )}
           {selectedNoteId && editButtonState && (
              <div className="cursor-pointer w-full flex justify-end pb-2" >
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSaveNote}>
                  Išsaugoti
                </button>
              </div>
            )}
        </div>
      </div>
     
    </>
  );
};

export default CurrentNotesList;
