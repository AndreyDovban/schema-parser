//go:debug x509negativeserial=1
package main

import (
	"embed"
	"fmt"
	"log"
	"schema-parser/connect"
	"schema-parser/store"

	// "fmt"
	"net/http"
	// "schema-parser/configs"

	"github.com/go-ldap/ldap/v3"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
)

//go:embed dist/*
var dist embed.FS

type IAuth struct {
	Address  string `json:"address"`
	Port     string `json:"port"`
	Login    string `json:"login"`
	Password string `json:"password"`
}

type Entity struct {
	BaseDn string `json:"baseDn"`
}

func main() {
	// config := configs.LoadConfig()

	var conn *ldap.Conn
	var err error
	defer conn.Close()

	// Создаем новый экземпляр Fiber
	app := fiber.New()

	app.Use("/", filesystem.New(filesystem.Config{
		Root:       http.FS(dist),
		PathPrefix: "dist",
		Browse:     true,
	}))

	// go helpers.OpenBrowser("http://localhost:5000")

	// Определяем обработчик для корневого маршрута
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Привет, Fiber!")
	})

	app.Post("/api/auth", func(c *fiber.Ctx) error {
		var user IAuth
		c.BodyParser(&user)
		fmt.Println(user)

		conn, err = connect.LdapAuth(user.Address, user.Port, user.Login, user.Password)
		if err != nil {
			fmt.Println("Auth Error", err.Error())
			return c.Status(401).SendString("Ошибка авторизаци!")
		}
		return c.Status(200).JSON(user)
	})

	app.Get("/api/schema", func(c *fiber.Ctx) error {
		_, err := connect.GetSubSchemaDn(conn, "")
		if err != nil {
			fmt.Println("Get SubSchema Dn Error", err.Error())
			conn.Close()
		}
		schema, err := connect.GetSchema(conn, store.BaseDn)
		if err != nil {
			fmt.Println("Get Schema Error", err.Error())
			conn.Close()
		}

		return c.Status(fiber.StatusOK).JSON(schema)
	})

	app.Get("/api/subschema", func(c *fiber.Ctx) error {
		schema, err := connect.GetSubSchemaDn(conn, "")
		if err != nil {
			fmt.Println("Get SubSchema Dn Error", err.Error())
			conn.Close()
		}

		return c.Status(fiber.StatusOK).JSON(schema)
	})

	app.Get("/api/test", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).SendFile("./data.json")
	})

	app.Post("/api/search", func(c *fiber.Ctx) error {
		var dn Entity
		c.BodyParser(&dn)
		objectClasses, err := connect.GetEntityByDn(conn, dn.BaseDn)
		if err != nil {
			fmt.Println("Get Entity By Dn Error", err.Error())
		}

		return c.Status(fiber.StatusOK).JSON(objectClasses)
	})

	app.Post("/api/get_aci_for_entity", func(c *fiber.Ctx) error {
		var dn Entity
		c.BodyParser(&dn)
		aci, err := connect.GetAciEntityByDn(conn, dn.BaseDn)
		if err != nil {
			fmt.Println("Get Aci For Entity Error", err.Error())
		}

		return c.Status(fiber.StatusOK).JSON(aci)
	})

	app.Post("/api/get_list_permissions", func(c *fiber.Ctx) error {
		var dn Entity
		c.BodyParser(&dn)
		aci, err := connect.GetListPermissions(conn, dn.BaseDn)
		if err != nil {
			fmt.Println("Get List Permissions Error", err.Error())
		}

		return c.Status(fiber.StatusOK).JSON(aci)
	})

	// app.Get("/api/close", func(c *fiber.Ctx) error {
	// 	log.Fatal("CLOSED")
	// 	return c.SendStatus(fiber.StatusOK)
	// })

	// Запускаем сервер на порту 5000
	log.Fatal(app.Listen(":5000"))
}
