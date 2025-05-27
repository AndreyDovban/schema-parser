package configs

import (
	"fmt"

	"github.com/joho/godotenv"
)

type Config struct {
	Server   string
	Port     string
	Login    string
	Password string
	BaseDn   string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file? using default config")
	}
	return &Config{}
}
