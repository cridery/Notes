import React, { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";

const CurrentNotesList = () => {

  const notes = useLoaderData(); // add null check here


  const data = notes?.notes

  console.log(data);

  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedNoteBody, setSelectedNoteBody] = useState(null);

  useEffect(() => {
    const selectedNote = selectedNoteId ? data.find(note => note.ID === selectedNoteId) : null;
    setSelectedNoteBody(selectedNote);
  }, [selectedNoteId, data]);

  return (
    <div className="flex w-full">
      <div className="w-1/4">
        {data.map((note, key) => (
          <div key={key}>
            <div onClick={() => setSelectedNoteId(note.ID)}>{note.title}</div>
          </div>
        ))}
      </div>
      <div className="w-3/4">
        {selectedNoteId !== null ? (
          <div>{selectedNoteBody}</div>
        ) : (
          <div>Please select a note.</div>
        )}

      </div>
   
    </div>
  )
};

export default CurrentNotesList;
