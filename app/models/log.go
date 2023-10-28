package models

import (
	"gorm.io/gorm"
)

type Log struct {
	gorm.Model
	ID        string `gorm:"primaryKey"`
	CreatedAt string `gorm:"index"`
	Action    string
	Data      string
	Table     string
}
