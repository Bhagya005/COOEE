package handlers

import (
	"backend/config"
	"encoding/json"
	"log"
	"net/http"
)

// UserRemDetailsResponse represents the structure of the response
type UserRemDetailsResponse struct {
	UserID   string `json:"user_id"` // Added user_id field
	Name     string `json:"name"`
	Searches int    `json:"searches"`
	Positives int   `json:"positives"`
	Negatives int   `json:"negatives"`
}

// GetRemainingUsers retrieves the details of users excluding the current user
func GetRemainingUsers(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request to fetch remaining users")

	// Get user ID from query parameter
	userID := r.URL.Query().Get("user_id")
	log.Printf("Received user_id: %s", userID)

	if userID == "" {
		log.Println("Missing user ID")
		http.Error(w, `{"error":"Missing user ID"}`, http.StatusBadRequest)
		return
	}

	// Query to get other users with their aggregated details (searches, positives, negatives)
	var users []UserRemDetailsResponse
	err := config.DB.Raw(`
		SELECT 
			u.user_id,
			u.name,
			COALESCE(COUNT(a.id), 0) AS searches,
			COALESCE(SUM(CASE WHEN a.result = 'positive' THEN 1 ELSE 0 END), 0) AS positives,
			COALESCE(SUM(CASE WHEN a.result = 'negative' THEN 1 ELSE 0 END), 0) AS negatives
		FROM users u
		LEFT JOIN armstrong_numbers a ON u.user_id = a.user_id
		WHERE u.user_id != ?
		GROUP BY u.user_id, u.name
	`, userID).Scan(&users).Error

	if err != nil {
		log.Printf("Error querying users and armstrong tables: %v", err)
		http.Error(w, `{"error":"Internal server error"}`, http.StatusInternalServerError)
		return
	}

	// Log the fetched details for debugging
	log.Printf("Remaining Users fetched: %+v", users)

	// Send the response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(users); err != nil {
		log.Printf("Error encoding response: %v", err)
		http.Error(w, `{"error":"Internal server error"}`, http.StatusInternalServerError)
	}
}
