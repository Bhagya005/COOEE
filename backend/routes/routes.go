package routes

import (
	"backend/handlers"

	"github.com/gorilla/mux"
)

func SetupRoutes() *mux.Router {
	r := mux.NewRouter()

	// User routes
	r.HandleFunc("/users", handlers.CreateUser).Methods("POST")
	r.HandleFunc("/users", handlers.GetAllUsers).Methods("GET")

	// Armstrong number routes
	r.HandleFunc("/verify", handlers.VerifyArmstrong).Methods("POST")
	r.HandleFunc("/verify", handlers.GetVerifyPage).Methods("GET")

	// r.HandleFunc("/numbers/{userId}", handlers.GetArmstrongNumbersByUser).Methods("GET")
	// r.HandleFunc("/numbers", handlers.GetAllArmstrongNumbers).Methods("GET")

	return r
}
