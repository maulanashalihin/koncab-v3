package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID        string `gorm:"primaryKey"`
	Username  string `gorm:"index:idx_username,unique"`
	Pin       string
	LoginAt   string
	UpdatedAt string
	CreatedAt string
}
