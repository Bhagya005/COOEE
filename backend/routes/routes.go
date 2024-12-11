package routes

import (
	"backend/handlers"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func SetupRoutes() http.Handler {
	r := mux.NewRouter()

	// User routes
	r.HandleFunc("/users", handlers.LoginUser).Methods("POST")
	r.HandleFunc("/users", handlers.GetAllUsers).Methods("GET")
    r.HandleFunc("/getuserdet", handlers.GetUserDetails).Methods("POST")
	// Armstrong number routes
	r.HandleFunc("/verify", handlers.VerifyArmstrong).Methods("POST")
	r.HandleFunc("/verify", handlers.GetVerifyPage).Methods("GET")

	// Apply CORS middleware
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // Replace with your frontend's origin
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}).Handler(r)

	return corsHandler
}
