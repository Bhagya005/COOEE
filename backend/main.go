package main

import (
    "backend/config"
    "backend/models"
    "backend/routes"
    "log"
    "net/http"
)

func main() {
    config.ConnectDatabase()

    // Auto-migrate models
    config.DB.AutoMigrate(&models.User{}, &models.ArmstrongNumber{})

    // Set up routes
    r := routes.SetupRoutes()

    log.Println("Server is running on http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", r))
}
