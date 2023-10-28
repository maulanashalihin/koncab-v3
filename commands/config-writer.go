package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: go run your_program.go <domain>")
		os.Exit(1)
	}

	domain := os.Args[1]
	filePath := "/etc/caddy/koncab-sites/" + domain

	content := []byte(fmt.Sprintf("%s {\n\troot * /home/koncab/koncab-v3/build\n\ttry_files {path}.html\n\tfile_server\n}\n", domain))

	err := os.WriteFile(filePath, content, 0644)
	if err != nil {
		fmt.Printf("Error writing to file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("File '%s' has been created with the provided content.\n", filePath)
}
