package router

import (
	"database/sql"
	"net/http"
	"your-project-path/controllers"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func SetupRouter(db *sql.DB) http.Handler {
	router := mux.NewRouter()

	// Requirements routes
	router.HandleFunc("/api/requirements/{projectId}", controllers.GetRequirements(db)).Methods("GET")
	router.HandleFunc("/api/requirements", controllers.CreateRequirement(db)).Methods("POST")
	router.HandleFunc("/api/requirements/generate", controllers.GenerateRequirements(db)).Methods("POST")

	// CORS middleware
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"}, // Add your frontend URL
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})

	return c.Handler(router)
}
