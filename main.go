package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"github.com/maulanashalihin/koncab-v3/app/controllers"
	"github.com/maulanashalihin/koncab-v3/app/middlewares"
)

func main() {

	err := godotenv.Load(".env") // Load environment variables from the .env file

	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", // You can change this to the origin you want to allow
		AllowHeaders: "Origin, Content-Type, Accept, Authorization, User-Agent, Referer",
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Website is Online")
	})

	AppController := new(controllers.AppController)

	UserController := new(controllers.UserController)

	app.Get("/subscribe", AppController.Subscribe)

	app.Get("/sites", AppController.Sites)

	app.Get("/allow-register", AppController.AllowRegister)

	app.Post("/register", UserController.CreateUser)

	app.Post("/login", UserController.Login)

	app.Get("/check", AppController.Check)

	app.Get("/first-logs", AppController.FirstLogs)

	app.Post("/sites", AppController.SaveSite)

	app.Use("/auth", middlewares.Auth)

	app.Get("/auth/user", UserController.GetCurrentUser)

	app.Get("/auth/logs", AppController.GetLog)

	app.Post("/auth/logs", AppController.SaveLog)

	app.Get("/auth/admin", UserController.GetAdmin)

	app.Post("/auth/admin", UserController.AddAdmin)

	app.Post("/auth/pin", UserController.SetPin)

	app.Post("/auth/session", UserController.AddSession)

	app.Delete("/auth/session/:id", UserController.DeleteSession)

	app.Delete("/auth/admin/:id", UserController.DeleteAdmin)

	app.Listen(":3000")

}
