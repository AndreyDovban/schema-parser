//go:debug x509negativeserial=1
package main

import (
	"embed"
	"fmt"
	"net/http"
	"test/configs"
	"test/connect"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
)

//go:embed public/*
var public embed.FS

func main() {
	config := configs.LoadConfig()

	// Создаем новый экземпляр Fiber
	app := fiber.New()

	app.Use("/", filesystem.New(filesystem.Config{
		Root:       http.FS(public),
		PathPrefix: "public",
		Browse:     true,
	}))

	conn, err := connect.LdapAuth(config.Server, config.Port, config.Login, config.Password)
	if err != nil {
		fmt.Println("Auth Error", err.Error())
		conn.Close()
	}

	defer conn.Close()

	// Определяем обработчик для корневого маршрута
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Привет, Fiber!")
	})

	app.Get("/schema", func(c *fiber.Ctx) error {
		schema, err := connect.GetSchema(conn, config.BaseDn)
		if err != nil {
			fmt.Println("Get Schema Error", err.Error())
			conn.Close()
		}
		return c.JSON(schema)
	})

	app.Get("/test", func(c *fiber.Ctx) error {
		return c.SendFile("./data.json")
	})

	// Запускаем сервер на порту 3000
	app.Listen(":5000")
}
