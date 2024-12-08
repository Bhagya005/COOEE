package handlers

import (
    "backend/config"
    "backend/models"
    "encoding/json"
    "net/http"
    "regexp"
    "strings"
    "time"
)

func LoginUser(w http.ResponseWriter, r *http.Request) {
    var input struct {
        Name  string `json:"name"`
        Email string `json:"email"`
    }
    json.NewDecoder(r.Body).Decode(&input)

    // Validate inputs
    if strings.TrimSpace(input.Name) == "" {
        http.Error(w, "Name is required", http.StatusBadRequest)
        return
    }
    if strings.TrimSpace(input.Email) == "" {
        http.Error(w, "Email is required", http.StatusBadRequest)
        return
    }

    // Validate email format using regex
    emailRegex := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
    matched, err := regexp.MatchString(emailRegex, input.Email)
    if err != nil || !matched {
        w.Header().Set("Content-Type", "application/json") // Set Content-Type
        w.WriteHeader(http.StatusBadRequest)              // Send 400 Bad Request status
        json.NewEncoder(w).Encode(map[string]string{"error": "Invalid email format"})
        return
    }

    // Check if the user already exists
    var existingUser models.User
    if err := config.DB.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusConflict)
        json.NewEncoder(w).Encode(map[string]string{"error": "User already exists"})
        return
    }


    // Add user to the database
    newUser := models.User{
        Name:      input.Name,
        Email:     input.Email,
        CreatedAt: time.Now(),
    }

    if err := config.DB.Create(&newUser).Error; err != nil {
        http.Error(w, "Error creating user", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(newUser)
}
