package controllers

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	connection "github.com/maulanashalihin/koncab-v3/app/db"
	"github.com/maulanashalihin/koncab-v3/app/models"
	"github.com/valyala/fasthttp"
)

type AppController struct{}

type Client struct {
	ID      uint64
	Channel string
	W       *bufio.Writer
}

var clients []Client

func (u *AppController) SaveSite(c *fiber.Ctx) error {

	payload := struct {
		Domain       string `json:"domain"`
		MajalahPrice int32  `json:"majalah_price"`
		TabloidPrice int32  `json:"tabloid_price"`
		BuletinPrice int32  `json:"buletin_price"`
		Area         string `json:"area"`
		User         string `json:"user"`
	}{}

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	data := connection.DB("portal")

	website := models.Website{
		Domain:       payload.Domain,
		Area:         payload.Area,
		User:         payload.User,
		MajalahPrice: payload.MajalahPrice,
		TabloidPrice: payload.TabloidPrice,
		BuletinPrice: payload.BuletinPrice,
		CreatedAt:    time.Now().UTC().Format(time.RFC3339),
	}

	result := data.Create(&website)

	if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}

	connection.DB(payload.Domain)

	Env := os.Getenv("APP_ENV")

	if Env == "production" {

		cmd_config := exec.Command("sudo ./config-writer " + payload.Domain)

		cmd_config.Run()

		cmd_restart := exec.Command("sudo systemctl reload caddy")

		cmd_restart.Run()

	}

	return c.SendString("Website successfully added")
}

func (u *AppController) AllowRegister(c *fiber.Ctx) error {

	Domain := strings.Split(c.Get("Referer"), "/")[2]

	data := connection.DB(Domain)

	var userCount int64
	// Count the users
	data.Model(&models.User{}).Count(&userCount)

	fmt.Print(userCount)

	if userCount > 0 {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	portal := connection.DB("portal")

	var website models.Website

	result := portal.Where("domain = ?", Domain).First(&website)

	if result.Error != nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	return c.JSON(website)
}

func (u *AppController) Check(c *fiber.Ctx) error {
	currentTime := time.Now().UTC().Format(time.RFC3339)
	return c.SendString(currentTime)
}

func (u *AppController) SaveLog(c *fiber.Ctx) error {
	// validate session id
	// then save log
	// send to sse
	Domain := strings.Split(c.Get("Referer"), "/")[2]

	data := connection.DB(Domain)

	payload := struct {
		Table     string `json:"Table"`
		Data      string `json:"Data"`
		ID        string `json:"ID"`
		Action    string `json:"Action"`
		CreatedAt string `json:"CreatedAt"`
	}{}

	if err := c.BodyParser(&payload); err != nil {

		return c.Status(500).JSON(fiber.Map{

			"error": err.Error(),
		})

	}

	log := models.Log{

		Table:     payload.Table,
		Data:      payload.Data,
		ID:        payload.ID,
		Action:    payload.Action,
		CreatedAt: payload.CreatedAt,
	}

	result := data.Create(&log)

	if result.Error != nil {

		return c.Status(500).JSON(fiber.Map{

			"error": result.Error.Error(),
		})

	}

	jsonData, _ := json.Marshal(log)

	// Convert the JSON byte slice to a string
	jsonString := string(jsonData)

	for _, client := range clients {
		if client.Channel == Domain {
			message := jsonString
			fmt.Fprintf(client.W, "data: %s\n\n", message)
			client.W.Flush()
		}
	}

	return c.SendString("Save Log")
}

func (u *AppController) FirstLogs(c *fiber.Ctx) error {
	// validate session id
	// get logs
	Domain := strings.Split(c.Get("Referer"), "/")[2]

	data := connection.DB(Domain)

	var logs []models.Log

	result := data.Order("created_at ASC").Find(&logs)

	if result.Error != nil {

		return c.Status(500).JSON(fiber.Map{

			"error": result.Error.Error(),
		})

	}

	return c.JSON(logs[0])
}

func (u *AppController) GetLog(c *fiber.Ctx) error {
	// validate session id
	// get logs
	Domain := strings.Split(c.Get("Referer"), "/")[2]

	data := connection.DB(Domain)

	var logs []models.Log

	result := data.Find(&logs)

	if result.Error != nil {

		return c.Status(500).JSON(fiber.Map{

			"error": result.Error.Error(),
		})

	}

	return c.JSON(logs)
}

func (u *AppController) Subscribe(c *fiber.Ctx) error {

	Channel := strings.Split(c.Get("Referer"), "/")[2]

	c.Set("Content-Type", "text/event-stream")
	c.Set("Cache-Control", "no-cache")
	c.Set("Connection", "keep-alive")
	c.Set("Transfer-Encoding", "chunked")

	clientId := c.Context().ID()

	c.Context().SetBodyStreamWriter(fasthttp.StreamWriter(func(w *bufio.Writer) {

		fmt.Fprintf(w, "data: %s\n\n", "initialize")
		w.Flush()
		clients = append(clients, Client{clientId, Channel, w})

		for {

			fmt.Fprint(w, "event: message\n")
			err := w.Flush()
			if err != nil {
				// Refreshing page in web browser will establish a new
				// SSE connection, but only (the last) one is alive, so
				// dead connections must be closed here.

				indexToRemove := -1

				for i, client := range clients {
					if client.ID == clientId {
						indexToRemove = i
						break
					}
				}

				// Check if the object was found
				if indexToRemove != -1 {
					// Use slicing to remove the object at indexToRemove
					clients = append(clients[:indexToRemove], clients[indexToRemove+1:]...)

				}

				fmt.Printf("Error while flushing: %v. Closing http connection.\n", err)

				break
			}
			time.Sleep(2 * time.Second)
		}
	}))

	return nil
}

func (u *AppController) Sites(c *fiber.Ctx) error {
	// lists website for admi only

	data := connection.DB("portal")

	var websites []models.Website

	result := data.Find(&websites)

	if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}

	return c.JSON(websites)
}
