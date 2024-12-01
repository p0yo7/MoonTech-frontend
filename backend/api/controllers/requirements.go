package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"github.com/gorilla/mux"
	"your-project-path/models"
	"your-project-path/services"
)

type ErrorResponse struct {
	Error string `json:"error"`
}

func GetRequirements(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		projectID := vars["projectId"]
		
		if projectID == "" {
			http.Error(w, "Project ID is required", http.StatusBadRequest)
			return
		}

		requirements, err := models.GetRequirementsByProject(db, projectID)
		if err != nil {
			handleError(w, err, "Failed to fetch requirements")
			return
		}
		
		respondJSON(w, http.StatusOK, requirements)
	}
}

func CreateRequirement(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req models.Requirement
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			handleError(w, err, "Invalid request body")
			return
		}

		if err := req.Create(db); err != nil {
			handleError(w, err, "Failed to create requirement")
			return
		}
		
		respondJSON(w, http.StatusCreated, req)
	}
}

func GenerateRequirements(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var data struct {
			ProjectID           string   `json:"projectId"`
			Description         string   `json:"description"`
			ExistingRequirements []string `json:"existingRequirements"`
		}
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			handleError(w, err, "Invalid request body")
			return
		}

		requirements, err := services.GenerateRequirementsWithAI(data.Description, data.ExistingRequirements)
		if err != nil {
			handleError(w, err, "Failed to generate requirements")
			return
		}

		respondJSON(w, http.StatusOK, map[string][]string{
			"requirements": requirements,
		})
	}
}

func handleError(w http.ResponseWriter, err error, message string) {
	w.WriteHeader(http.StatusInternalServerError)
	json.NewEncoder(w).Encode(ErrorResponse{Error: message})
}

func respondJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}