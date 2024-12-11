package models

import "time"

type ArmstrongNumber struct {
    ID        uint      `gorm:"primaryKey"`
    UserID    string      `gorm:"not null"`
    Number    int       `gorm:"not null"`
    Result    string    `gorm:"not null"` // Column to store "positive" or "negative"
    CreatedAt time.Time
}

