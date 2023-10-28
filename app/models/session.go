package models

import (
	"gorm.io/gorm"
)

type Session struct {
	gorm.Model
	ID        string `gorm:"primaryKey"`
	UserId    string `gorm:"index"`
	UserAgent string
	CreatedAt string
	UpdatedAt string
}
