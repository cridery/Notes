package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

type App struct {
	db *gorm.DB
}

type Note struct {
	gorm.Model
	Title string `json:"title"`
	Body  string `json:"body"`
}

func (app *App) getNotesHandler(w http.ResponseWriter, r *http.Request){
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
	// fs := http.FileServer(http.Dir("../frontend/build"))
	// http.Handle("/", fs)

	fmt.Println("listening on port 8080")
	err = http.ListenAndServe(":8080", corsMiddleware(router))
}
