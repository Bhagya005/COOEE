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

// GetUserDetails retrieves the current user details
func GetUserDetails(w http.ResponseWriter, r *http.Request) {
	// Get user ID from query parameter
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "Missing user ID", http.StatusBadRequest)
		return
	}

	// Fetch user name from the `users` table
	var name string
	err := config.DB.Raw("SELECT name FROM users WHERE user_id = ?", userID).Scan(&name).Error
	if err != nil {
		log.Println("Error querying users table:", err)
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Fetch statistics from the `armstrong` table
	var searches, positives, negatives int
	err = config.DB.Raw(`
    SELECT COUNT(*) AS searches,
           SUM(CASE WHEN result = 'positive' THEN 1 ELSE 0 END) AS positives,
           SUM(CASE WHEN result = 'negative' THEN 1 ELSE 0 END) AS negatives
    FROM armstrong
    WHERE user_id = ?`, userID).Scan(&[]interface{}{&searches, &positives, &negatives}).Error
	if err != nil {
		log.Println("Error querying armstrong table:", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Create response
	response := UserDetailsResponse{
		Name:      name,
		Searches:  searches,
		Positives: positives,
		Negatives: negatives,
	}

	// Send JSON response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
