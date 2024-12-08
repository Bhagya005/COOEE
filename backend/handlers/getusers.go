package handlers

import (
	"backend/config"
	"backend/models"
	"encoding/json"
	"net/http"
	"log"
)

// GetAllUsers - Retrieves all registered users
func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	log.Println("Received a GET request to /users")
	var users []models.User

	// Query all users from the database
	if err := config.DB.Find(&users).Error; err != nil {
		http.Error(w, "Error fetching users", http.StatusInternalServerError)
		return
	}

	// Return users as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}
