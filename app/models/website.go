package models

import (
	"gorm.io/gorm"
)

type Website struct {
	gorm.Model
	Domain       string `gorm:"unique;not null"`
	Area         string `gorm:"default:Jawa"`
	User         string `gorm:"default:Rijal"`
	BuletinPrice int32  `gorm:"default:500"`
	TabloidPrice int32  `gorm:"default:10000"`
	MajalahPrice int32  `gorm:"default:10000"`
	CreatedAt    string
}
