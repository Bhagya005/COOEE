package handlers

import (
	"backend/config"
	"encoding/json"
	"log"
	"net/http"
)

// NumberDetails represents a single entry in the armstrong_numbers table
type NumberDetails struct {
	ID        uint   `json:"id"`
	Number    int    `json:"number"`
	Result    string `json:"result"`
	CreatedAt string `json:"created_at"`
}

// GetUserNumbers retrieves all numbers entered by the user along with their result, date, and time
func GetUserNumbers(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request to fetch user numbers")

	// Get user ID from query parameter
	userID := r.URL.Query().Get("user_id")
	log.Printf("Received user_id: %s", userID)

	if userID == "" {
		log.Println("Missing user ID")
		http.Error(w, `{"error":"Missing user ID"}`, http.StatusBadRequest)
		return
	}

	// Fetch all numbers, results, and timestamps for the user
	var numberDetails []NumberDetails
	err := config.DB.Raw(`
		SELECT 
			id,
			number,
			result,
			created_at
		FROM armstrong_numbers
		WHERE user_id = ?
		ORDER BY created_at DESC
	`, userID).Scan(&numberDetails).Error

	if err != nil {
		log.Printf("Error querying armstrong_numbers table for user_id %s: %v", userID, err)
		http.Error(w, `{"error":"Internal server error"}`, http.StatusInternalServerError)
		return
	}

	// Log the fetched details for debugging
	log.Printf("Number Details fetched for user_id %s: %+v", userID, numberDetails)

	// Send the response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(numberDetails); err != nil {
		log.Printf("Error encoding response: %v", err)
		http.Error(w, `{"error":"Internal server error"}`, http.StatusInternalServerError)
	}
}
