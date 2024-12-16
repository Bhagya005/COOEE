package handlers

import (
	"backend/config"
	"encoding/json"
	"log"
	"net/http"
)

// UserDetailsResponse represents the structure of the response
type UserDetailsResponse struct {
	Name      string `json:"name"`
	Searches  int    `json:"searches"`
	Positives int    `json:"positives"`
	Negatives int    `json:"negatives"`
}

// ArmstrongStats holds the values for searches, positives, and negatives
type ArmstrongStats struct {
	Searches  int `json:"searches"`
	Positives int `json:"positives"`
	Negatives int `json:"negatives"`
}

// GetUserDetails retrieves the current user details
func GetUserDetails(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request method:", r.Method)
	log.Println("Request headers:", r.Header)

	w.Header().Set("Content-Type", "application/json")

	userID := r.URL.Query().Get("user_id")
	log.Printf("Received user_id: %s", userID)

	if userID == "" {
		log.Println("Missing user ID")
		http.Error(w, `{"error":"Missing user ID"}`, http.StatusBadRequest)
		return
	}

	var name string
	err := config.DB.Raw("SELECT name FROM users WHERE user_id = ?", userID).Scan(&name).Error
	if err != nil {
		log.Printf("Error querying users table for user_id %s: %v", userID, err)
		http.Error(w, `{"error":"User not found"}`, http.StatusNotFound)
		return
	}

	log.Printf("Querying Armstrong table for user_id: %s", userID)
	var stats ArmstrongStats
	err = config.DB.Raw(`
		SELECT 
			COALESCE(COUNT(*), 0) AS searches,
			COALESCE(SUM(CASE WHEN result = 'positive' THEN 1 ELSE 0 END), 0) AS positives,
			COALESCE(SUM(CASE WHEN result = 'negative' THEN 1 ELSE 0 END), 0) AS negatives
		FROM armstrong_numbers
		WHERE user_id = ?`, userID).Scan(&stats).Error

	if err != nil {
		log.Printf("Error querying armstrong table for user_id %s: %v", userID, err)
		http.Error(w, `{"error":"Internal server error"}`, http.StatusInternalServerError)
		return
	}

	log.Printf("User Details: Name: %s, Searches: %d, Positives: %d, Negatives: %d", name, stats.Searches, stats.Positives, stats.Negatives)

	response := UserDetailsResponse{
		Name:      name,
		Searches:  stats.Searches,
		Positives: stats.Positives,
		Negatives: stats.Negatives,
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding response: %v", err)
		http.Error(w, `{"error":"Internal server error"}`, http.StatusInternalServerError)
	}
}
