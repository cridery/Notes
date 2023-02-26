package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type App struct {
	db *gorm.DB
}

type Note struct {
	gorm.Model
	Title string `json:"title"`
	Body  string `json:"body"`
}

func (app *App) createNoteHandler(w http.ResponseWriter, r *http.Request) {
	var note Note
	err := json.NewDecoder(r.Body).Decode(&note)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	app.db.Create(&note)
	json.NewEncoder(w).Encode(note)
}

func main() {

	db, err := gorm.Open(sqlite.Open("notes.db"), &gorm.Config{})
	if err != nil {
		fmt.Println("failed to connect database")
		os.Exit(1)
	}

	app := App{db: db}

	http.HandleFunc("/create", app.createNoteHandler)

	fs := http.FileServer(http.Dir("../frontend/build"))
	http.Handle("/", fs)

	fmt.Println("listening on port 3000")
	err = http.ListenAndServe(":3000", nil)
	if err != nil {
		fmt.Println("Failed to start server")
		os.Exit(1)
	}
}
