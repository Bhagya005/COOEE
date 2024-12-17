package handlers

import (
	"backend/config"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
)

// NumberDetails represents a single entry in the armstrong_numbers table
type NumberDetails struct {
	ID        uint   `json:"id"`
	Number    int    `json:"number"`
	Result    string `json:"result"`
	CreatedAt string `json:"created_at"`
}

// PaginatedNumberDetailsResponse contains paginated number details
type PaginatedNumberDetailsResponse struct {
	NumberDetails []NumberDetails `json:"number_details"`
	TotalCount    int64           `json:"total_count"`
	Page          int             `json:"page"`
	PageSize      int             `json:"page_size"`
	TotalPages    int             `json:"total_pages"`
}

// GetUserNumbers retrieves paginated numbers entered by the user
func GetUserNumbers(w http.ResponseWriter, r *http.Request) {
    log.Println("Received request to fetch user numbers")

    // Get user ID from query parameter
    userID := r.URL.Query().Get("user_id")
    log.Printf("Received user_id: %s", userID)

    if userID == "" {
        log.Println("Missing user ID")
        http.Error(w, `{"error":"Missing user ID"}`, http.StatusBadRequest)
        return
    }

    // Parse pagination parameters
    pageStr := r.URL.Query().Get("page")
    pageSizeStr := r.URL.Query().Get("page_size")
    filter := r.URL.Query().Get("filter") // New filter parameter

    // Default values
    page := 1
    pageSize := 5

    // Convert page and page_size to integers
    if pageStr != "" {
        if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
            page = p
        }
    }
    if pageSizeStr != "" {
        if ps, err := strconv.Atoi(pageSizeStr); err == nil && ps > 0 && ps <= 100 {
            pageSize = ps
        }
    }

    // Calculate offset
    offset := (page - 1) * pageSize

    // Prepare response struct
    var response PaginatedNumberDetailsResponse

    // Query for total count
    var totalCount int64
    countQuery := "SELECT COUNT(*) FROM armstrong_numbers WHERE user_id = ?"
    countParams := []interface{}{userID}

    // Apply filter if present
    if filter == "positive" || filter == "negative" {
        countQuery += " AND result = ?"
        countParams = append(countParams, filter)
    }

    config.DB.Raw(countQuery, countParams...).Scan(&totalCount)

    // Calculate total pages
    totalPages := (int(totalCount) + pageSize - 1) / pageSize

    // Query for paginated data
    var numberDetails []NumberDetails
    dataQuery := `
        SELECT 
            id,
            number,
            result,
            created_at
        FROM armstrong_numbers
        WHERE user_id = ?
    `
    dataParams := []interface{}{userID}

    if filter == "positive" || filter == "negative" {
        dataQuery += " AND result = ?"
        dataParams = append(dataParams, filter)
    }

    dataQuery += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    dataParams = append(dataParams, pageSize, offset)

    err := config.DB.Raw(dataQuery, dataParams...).Scan(&numberDetails).Error

    if err != nil {
        log.Printf("Error querying armstrong_numbers table for user_id %s: %v", userID, err)
        http.Error(w, `{"error":"Internal server error"}`, http.StatusInternalServerError)
        return
    }

    // Populate response
    response = PaginatedNumberDetailsResponse{
        NumberDetails: numberDetails,
        TotalCount:    totalCount,
        Page:          page,
        PageSize:      pageSize,
        TotalPages:    totalPages,
    }

    // Send the response
    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(response); err != nil {
        log.Printf("Error encoding response: %v", err)
        http.Error(w, `{"error":"Internal server error"}`, http.StatusInternalServerError)
    }
}
