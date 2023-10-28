package connection

import (
	"github.com/maulanashalihin/koncab-v3/app/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var data = make(map[string]*gorm.DB)

func DB(db_name string) *gorm.DB {

	if data[db_name] == nil {

		data[db_name], _ = gorm.Open(sqlite.Open("database/"+db_name+".db"), &gorm.Config{
			PrepareStmt: true,
		})

		data[db_name].AutoMigrate(&models.User{}, &models.Website{}, &models.Log{}, &models.Session{})

		return data[db_name]

	} else {
		return data[db_name]
	}

}
