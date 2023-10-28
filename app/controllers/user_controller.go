package controllers

import (
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	connection "github.com/maulanashalihin/koncab-v3/app/db"
	"github.com/maulanashalihin/koncab-v3/app/models"
	"golang.org/x/crypto/bcrypt"
)

type UserController struct{}

func (u *UserController) CreateUser(c *fiber.Ctx) error {
	// save user to db

	payload := struct {
		Username string `json:"username"`
	}{}

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	Domain := strings.Split(c.Get("Referer"), "/")[2]

	data := connection.DB(Domain)

	UserId := uuid.New().String()

	user := models.User{
		ID:        UserId,
		Username:  payload.Username,
		LoginAt:   time.Now().UTC().Format(time.RFC3339),
		CreatedAt: time.Now().UTC().Format(time.RFC3339),
		UpdatedAt: time.Now().UTC().Format(time.RFC3339),
	}

	data.Create(&user)

	SessionId := uuid.New().String()

	session := models.Session{
		ID:        SessionId,
		UserId:    UserId,
		UserAgent: c.Get("User-Agent"),
		CreatedAt: time.Now().UTC().Format(time.RFC3339),
		UpdatedAt: time.Now().UTC().Format(time.RFC3339),
	}

	data.Create(&session)

	return c.SendString(SessionId)
}

func (u *UserController) Login(c *fiber.Ctx) error {
	// check session in db

	payload := struct {
		SessionId string `json:"session_id"`
	}{}

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	Domain := strings.Split(c.Get("Referer"), "/")[2]

	data := connection.DB(Domain)

	session := models.Session{}

	if err := data.Where("id = ?", payload.SessionId).First(&session).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "Session tidak ditemukan",
		})
	}

	if session.UserAgent != "" {

		return c.Status(404).JSON(fiber.Map{
			"error": "Session telah digunakan",
		})
	}

	session.UserAgent = c.Get("User-Agent")

	data.Save(&session)

	data.Model(&models.User{}).Where("id = ?", session.UserId).Update("LoginAt", time.Now().UTC().Format(time.RFC3339))

	portal := connection.DB("portal")

	var website models.Website

	result := portal.Where("domain = ?", Domain).First(&website)

	if result.Error != nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	return c.JSON(website)

}

func (u *UserController) AddAdmin(c *fiber.Ctx) error {
	Domain := strings.Split(c.Get("Referer"), "/")[2]

	payload := struct {
		Username string `json:"username"`
	}{}

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	data := connection.DB(Domain)

	UserId := uuid.New().String()

	user := models.User{
		ID:        UserId,
		Username:  payload.Username,
		CreatedAt: time.Now().UTC().Format(time.RFC3339),
		UpdatedAt: time.Now().UTC().Format(time.RFC3339),
	}

	data.Create(&user)

	SessionId := uuid.New().String()

	session := models.Session{
		ID:        SessionId,
		UserId:    UserId,
		UserAgent: "",
		CreatedAt: time.Now().UTC().Format(time.RFC3339),
		UpdatedAt: time.Now().UTC().Format(time.RFC3339),
	}

	data.Create(&session)

	type Admin struct {
		models.User
		Sessions []models.Session
	}

	admin := Admin{user, []models.Session{session}}

	return c.JSON(admin)
}

func (u *UserController) AddSession(c *fiber.Ctx) error {
	Domain := strings.Split(c.Get("Referer"), "/")[2]

	payload := struct {
		AdminId string `json:"admin_id"`
	}{}

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	data := connection.DB(Domain)

	SessionId := uuid.New().String()

	session := models.Session{
		ID:        SessionId,
		UserId:    payload.AdminId,
		UserAgent: "",
		CreatedAt: time.Now().UTC().Format(time.RFC3339),
		UpdatedAt: time.Now().UTC().Format(time.RFC3339),
	}

	data.Create(&session)

	return c.JSON(session)
}

func (u *UserController) DeleteSession(c *fiber.Ctx) error {
	Domain := strings.Split(c.Get("Referer"), "/")[2]

	sessionId := c.Params("id")

	data := connection.DB(Domain)

	session := models.Session{}

	// delete session from db
	data.Where("id = ?", sessionId).Delete(&session)

	return c.SendString("OK")
}

func (u *UserController) DeleteAdmin(c *fiber.Ctx) error {
	Domain := strings.Split(c.Get("Referer"), "/")[2]

	AdminId := c.Params("id")

	data := connection.DB(Domain)

	// delete user from db
	data.Where("id = ?", AdminId).Delete(&models.User{})

	// delete session from db
	data.Where("user_id = ?", AdminId).Delete(&models.Session{})

	return c.SendString("OK")
}

func (u *UserController) DeleteUser(c *fiber.Ctx) error {
	// delete user from db
	return c.SendString("Delete User")
}

func (u *UserController) GetCurrentUser(c *fiber.Ctx) error {

	Domain := strings.Split(c.Get("Referer"), "/")[2]

	// get current user
	userID, ok := c.Locals("UserId").(string)

	if !ok {
		// Handle the case where "UserID" is not found or not an int
		return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
	}

	data := connection.DB(Domain)

	var user models.User

	result := data.Where("ID = ?", userID).First(&user)

	if result.Error != nil {
		return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
	}

	return c.JSON(user)
}

func (u *UserController) GetAdmin(c *fiber.Ctx) error {

	Domain := strings.Split(c.Get("Referer"), "/")[2]

	// get current user

	data := connection.DB(Domain)

	// type Admin struct {
	// 	ID        string `gorm:"primaryKey"`
	// 	Username  string `gorm:"index:idx_username,unique"`
	// 	Pin       string
	// 	LoginAt   string
	// 	UpdatedAt string
	// 	CreatedAt string
	// 	sessions  []models.Session
	// }
	type Admin struct {
		models.User
		Sessions []models.Session
	}

	var users []models.User

	result := data.Find(&users)

	if result.Error != nil {
		return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
	}

	var admins []Admin

	for _, user := range users {
		var sessions []models.Session
		data.Where("user_id = ?", user.ID).Find(&sessions)
		admins = append(admins, Admin{user, sessions})
	}

	return c.JSON(admins)
}

func (u *UserController) SetPin(c *fiber.Ctx) error {

	Domain := strings.Split(c.Get("Referer"), "/")[2]

	// get current user
	userID, ok := c.Locals("UserId").(string)

	if !ok {
		// Handle the case where "UserID" is not found or not an int
		return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
	}

	data := connection.DB(Domain)

	var user models.User

	result := data.Where("ID = ?", userID).First(&user)

	if result.Error != nil {
		return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
	}

	payload := struct {
		Pin string `json:"pin"`
	}{}

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if user.Pin != "" {
		// do something if user has a pin
		err := bcrypt.CompareHashAndPassword([]byte(user.Pin), []byte(payload.Pin))

		if err != nil {
			return c.Status(400).SendString("Invalid PIN")
		}

		user.LoginAt = time.Now().UTC().Format(time.RFC3339)

	} else {
		// do something if user does not have a pin

		// generate hashed pin
		hashedPin, err := bcrypt.GenerateFromPassword([]byte(payload.Pin), bcrypt.DefaultCost)

		if err != nil {
			// handle error
		}

		// store hashed pin in user object
		user.Pin = string(hashedPin)

		user.LoginAt = time.Now().UTC().Format(time.RFC3339)

	}

	if err := data.Save(&user).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(user)
}
