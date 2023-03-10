import React, { useState } from "react";
import { json } from "react-router";
import CreateNoteForm from "../components/CreateNote";
import CurrentNotesList from "../components/CurrentNotes";
import { Header } from "../components/Header";
import { goGet } from "../helpers/goGet";
import { goPost } from "../helpers/goPost";

export const loader = async () => {
  const notes = await goGet("http://localhost:8080/notes");
  console.log(notes)
  return { notes };
};

export async function action({ request }) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  await goPost(values);
  const notes = await goGet("http://localhost:8080/notes");
  return json({ notes });
}


export default function Index() {

  return (
    <>
      <Header/>
      <div className="px-10 space-y-4">
        <CurrentNotesList />
      </div>
      <hr></hr>
      <div className="px-10 pt-2">
        <CreateNoteForm />
      </div>
    </>
  );
}
