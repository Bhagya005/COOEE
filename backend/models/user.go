package models

import (
    "time"
)

type User struct {
    ID        uint      `gorm:"primaryKey"`                      // Auto-incrementing primary key
    UserID    string    `gorm:"type:varchar(255);unique;not null"` // user_id as VARCHAR with a unique constraint
    Name      string    `gorm:"type:varchar(255);not null"`       // Name as VARCHAR
    Email     string    `gorm:"type:varchar(255);unique;not null"` // Email as VARCHAR with a unique constraint
    CreatedAt time.Time                                           // Timestamp for when the user was created
}

