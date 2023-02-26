import React, { useState } from "react";
import CreateNoteForm from "../components/CreateNote";
import CurrentNotesList from "../components/CurrentNotes";
import { goGet } from "../helpers/goGet";

export const loader = async () => {
  const notes = await goGet("http://localhost:8080/notes");
  return { notes };
};

export default function Index() {

  return (
    <>
      <div className="px-10 space-y-4">
        <CurrentNotesList />
        <CreateNoteForm />
      </div>
    </>
  );
}
