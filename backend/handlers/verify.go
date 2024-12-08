package handlers

import (
	"fmt"
	"net/http"
)

// GetVerifyPage - Handles GET requests to /verify
func GetVerifyPage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Welcome to the Armstrong Number Verification API! Send a POST request with a number to verify.")
}
