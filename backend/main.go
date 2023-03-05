package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
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

func (app *App) getNotesHandler(w http.ResponseWriter, r *http.Request) {
	var notes []Note
	result := app.db.Find(&notes)
	if result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(notes)
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

func (app *App) updateNoteHandler(w http.ResponseWriter, r *http.Request) {
    id := mux.Vars(r)["id"]

    var note Note
    err := json.NewDecoder(r.Body).Decode(&note)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // Update the note record in the database with the new values
    result := app.db.Model(&note).Where("id = ?", id).Updates(&note)
    if result.Error != nil {
        http.Error(w, result.Error.Error(), http.StatusInternalServerError)
        return
    }

    // Encode and send back the updated note object
    response := map[string]interface{}{"success": true, "note": note}
    json.NewEncoder(w).Encode(response)
}


func (app *App) deleteNoteHandler(w http.ResponseWriter, r *http.Request) {
    // Extract the note ID from the URL parameters
    id := mux.Vars(r)["id"]

    // Find the note with the given ID in the database
    var note Note
    result := app.db.First(&note, id)
    if result.Error != nil {
        // If there is any other database error, return a 500 Internal Server Error HTTP status code
        http.Error(w, result.Error.Error(), http.StatusInternalServerError)
        return
    }

    // Delete the note from the database
    result = app.db.Delete(&note)
    if result.Error != nil {
        http.Error(w, result.Error.Error(), http.StatusInternalServerError)
        return
    }

    // Return a success response with a 200 OK HTTP status code
    response := map[string]interface{}{"success": true}
    json.NewEncoder(w).Encode(response)
}


func main() {

	router := mux.NewRouter()

	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	origins := handlers.AllowedOrigins([]string{"http://localhost:3000"})
	corsMiddleware := handlers.CORS(headers, methods, origins)

	db, err := gorm.Open(sqlite.Open("notes.db"), &gorm.Config{})
	if err != nil {
		fmt.Println("failed to connect database")
		os.Exit(1)
	}

	db.AutoMigrate(&Note{})

	app := App{db: db}

	router.HandleFunc("/create", app.createNoteHandler).Methods("POST")
	router.HandleFunc("/notes", app.getNotesHandler).Methods("GET")
	router.HandleFunc("/notes/{id}", app.updateNoteHandler).Methods("PUT")
	router.HandleFunc("/notes/{id}", app.deleteNoteHandler).Methods("DELETE")

	fmt.Println("listening on port 8080")
	err = http.ListenAndServe(":8080", corsMiddleware(router))
	if err != nil {
		fmt.Println(err)
	}
}
