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
    if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

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
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(map[string]string{"error": "Invalid email format"})
        return
    }

    // Check if the user already exists
    var existingUser models.User
    if err := config.DB.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
        // Return the existing user's ID (uid)
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(map[string]interface{}{
            "message": "User already exists",
            "uid":     existingUser.ID,
            "name":    existingUser.Name,
            "email":   existingUser.Email,
        })
        return
    }

    // Add new user to the database
    newUser := models.User{
        Name:      input.Name,
        Email:     input.Email,
        CreatedAt: time.Now(),
    }

    if err := config.DB.Create(&newUser).Error; err != nil {
        http.Error(w, "Error creating user", http.StatusInternalServerError)
        return
    }

    // Return the new user's ID (uid)
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "message": "User created successfully",
        "uid":     newUser.ID,  // Send the new user's ID
        "name":    newUser.Name,
        "email":   newUser.Email,
    })
}
