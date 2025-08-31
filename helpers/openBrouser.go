package helpers

import (
	"log"
	"os/exec"
	"strings"
)

func OpenBrowser(url string) {

	os, err := exec.Command("uname").Output()
	if err != nil {
		log.Println("FAILED GET OS: ", err)
	}

	switch strings.TrimSpace(string(os)) {
	case "Darwin": // macOS
		err = exec.Command("open", url).Start()
	case "Linux": // Linux
		err = exec.Command("xdg-open", url).Start()
	default: // Windows
		err = exec.Command("cmd", "/c", "start "+url).Start()
	}

	if err != nil {
		log.Println("FAILED OPEN BROUSER: ", err)
	}
}
