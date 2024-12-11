package handlers

import (
    "backend/config"
    "backend/models"
    "encoding/json"
    "net/http"
    "time"
)

// VerifyArmstrong checks if a number is Armstrong and adds it to the database
func VerifyArmstrong(w http.ResponseWriter, r *http.Request) {
    // Decode JSON request body
    var data struct {
        UserID string `json:"user_id"` // Use string to match UUID format
        Number int    `json:"number"`
        Result string `json:"result"` // Result will be either "positive" or "negative"
    }

    if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

    // Validate inputs
    if data.UserID == "" {
        http.Error(w, "User ID is required", http.StatusBadRequest)
        return
    }
    if data.Number <= 0 {
        http.Error(w, "Invalid number", http.StatusBadRequest)
        return
    }

    // Check if the number already exists for the user
    var existingEntry models.ArmstrongNumber
    if err := config.DB.Where("user_id = ? AND number = ?", data.UserID, data.Number).First(&existingEntry).Error; err == nil {
        // If the entry exists, return a conflict response
        w.WriteHeader(http.StatusConflict)
        json.NewEncoder(w).Encode(map[string]string{
            "error": "Number already checked by this user",
        })
        return
    }

    // Add new entry to the database
    newEntry := models.ArmstrongNumber{
        UserID:    data.UserID, // Store the user_id as string
        Number:    data.Number,
        Result:    data.Result, // Store the result (positive or negative)
        CreatedAt: time.Now(),
    }

    if err := config.DB.Create(&newEntry).Error; err != nil {
        http.Error(w, "Error saving entry", http.StatusInternalServerError)
        return
    }

    // Send a successful response with the new entry
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(newEntry)
}
