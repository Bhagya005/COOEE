package handlers

import (
	"backend/config"
	"encoding/json"
	"log"
	"net/http"
)

// UserDetails represents the data we want to return for each user
type UserDetails struct {
	UserID   uint   `json:"user_id"`
	Name     string `json:"name"`
	Searches int    `json:"searches"`
	Possibles int  `json:"positives"`
	Negatives int  `json:"negatives"`
}

// GetRemainingUsers retrieves the data for all users except the current user
func GetRemainingUsers(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request to fetch remaining user details")

	// Get current user ID from query parameter
	currentUserID := r.URL.Query().Get("user_id")
	log.Printf("Received current_user_id: %s", currentUserID)

	if currentUserID == "" {
		log.Println("Missing user ID")
		http.Error(w, `{"error":"Missing user ID"}`, http.StatusBadRequest)
		return
	}

	// Fetch the data for all users except the current user
	var remainingUsers []UserDetails
	err := config.DB.Raw(`
		SELECT u.id as user_id, u.name, a.searches, a.positives, a.negatives
		FROM users u
		LEFT JOIN armstrong a ON u.id = a.user_id
		WHERE u.id != ?
	`, currentUserID).Scan(&remainingUsers).Error

	if err != nil {
		log.Printf("Error querying users and armstrong tables: %v", err)
		http.Error(w, `{"error":"Internal server error"}`, http.StatusInternalServerError)
		return
	}

	// Log the fetched details for debugging
	log.Printf("Remaining Users fetched: %+v", remainingUsers)

	// Send the response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(remainingUsers); err != nil {
		log.Printf("Error encoding response: %v", err)
		http.Error(w, `{"error":"Internal server error"}`, http.StatusInternalServerError)
	}
}
