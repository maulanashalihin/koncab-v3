package middlewares

import (
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	connection "github.com/maulanashalihin/koncab-v3/app/db"
	"github.com/maulanashalihin/koncab-v3/app/models"
)

func Auth(c *fiber.Ctx) error {
	// get Authorization header
	authHeader := c.Get("Authorization")

	// split the header into two parts
	// Bearer and the token itself
	token := strings.Split(authHeader, " ")

	// if token is invalid
	// return 401
	if len(token) != 2 {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	// if token does not have Bearer
	// return 401
	if token[0] != "Bearer" {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	// if token is not valid
	// return 401

	Domain := strings.Split(c.Get("Referer"), "/")[2]

	data := connection.DB(Domain)

	var session models.Session

	result := data.Where("id = ?", token[1]).First(&session)

	if result.Error != nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	if token[1] != session.ID {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	Env := os.Getenv("APP_ENV")

	if Env == "production" {

		if session.UserAgent != c.Get("User-Agent") {
			return c.SendStatus(fiber.StatusUnauthorized)
		}

	}

	c.Locals("UserId", session.UserId)

	// if token is valid
	// continue with the next middleware

	return c.Next()
}
