package handlers

import (
    "backend/config"
    "backend/models"
    "encoding/json"
    "net/http"
    
)

func VerifyArmstrong(w http.ResponseWriter, r *http.Request) {
    var data map[string]int
    json.NewDecoder(r.Body).Decode(&data)
    number := data["number"]

    if isArmstrong(number) {
        armstrong := models.ArmstrongNumber{Number: number, UserID: 1} // Example UserID
        config.DB.Create(&armstrong)
        w.WriteHeader(http.StatusCreated)
        json.NewEncoder(w).Encode(armstrong)
    } else {
        http.Error(w, "Not an Armstrong number", http.StatusBadRequest)
    }
}

func isArmstrong(num int) bool {
    sum, temp := 0, num
    for temp > 0 {
        digit := temp % 10
        sum += digit * digit * digit
        temp /= 10
    }
    return sum == num
}
