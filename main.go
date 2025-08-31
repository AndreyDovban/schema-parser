//go:debug x509negativeserial=1
package main

import (
	"embed"
	"fmt"
	"log"
	"schema-parser/helpers"

	// "fmt"
	"net/http"
	// "schema-parser/configs"
	// "schema-parser/connect"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
)

//go:embed dist/*
var dist embed.FS

func main() {
	// config := configs.LoadConfig()

	// Создаем новый экземпляр Fiber
	app := fiber.New()

	app.Use("/", filesystem.New(filesystem.Config{
		Root:       http.FS(dist),
		PathPrefix: "dist",
		Browse:     true,
	}))

	go helpers.OpenBrowser("http://localhost:5000")

	// conn, err := connect.LdapAuth(config.Server, config.Port, config.Login, config.Password)
	// if err != nil {
	// 	fmt.Println("Auth Error", err.Error())
	// 	conn.Close()
	// }

	// defer conn.Close()

	// Определяем обработчик для корневого маршрута
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Привет, Fiber!")
	})

	// app.Get("/api/schema", func(c *fiber.Ctx) error {
	// 	schema, err := connect.GetSchema(conn, store.BaseDn)
	// 	if err != nil {
	// 		fmt.Println("Get Schema Error", err.Error())
	// 		conn.Close()
	// 	}

	// 	return c.Status(fiber.StatusOK).JSON(schema)
	// })

	// app.Get("/api/subschema", func(c *fiber.Ctx) error {
	// 	schema, err := connect.GetSubSchemaDn(conn, "")
	// 	if err != nil {
	// 		fmt.Println("Get SubSchema Dn Error", err.Error())
	// 		conn.Close()
	// 	}

	// 	return c.Status(fiber.StatusOK).JSON(schema)
	// })

	app.Get("/api/test", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).SendFile("./data.json")
	})

	app.Get("/api/work", func(c *fiber.Ctx) error {
		fmt.Println("WORK")
		return c.SendStatus(fiber.StatusOK)
	})

	app.Get("/api/close", func(c *fiber.Ctx) error {
		log.Fatal("CLOSED")
		return c.SendStatus(fiber.StatusOK)
	})

	// Запускаем сервер на порту 5000
	log.Fatal(app.Listen(":5000"))
}
