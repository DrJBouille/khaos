package executor

import (
	"fmt"
	"io"
	"os"
	"os/exec"
	"time"
)

type DockerExecutor struct{}

type Language struct {
	Extension string
	Image     string
	Command   []string
}

var languages = map[string]Language{
	"JAVASCRIPT": {
		Extension: ".js",
		Image:     "node:20-alpine",
		Command:   []string{"node", "/app/script.js"},
	},
	"PYTHON": {
		Extension: ".py",
		Image:     "python:3.11-slim",
		Command:   []string{"python", "/app/script.py"},
	},
	"JAVA": {
		Extension: ".java",
		Image:     "openjdk:21-ea-jdk-slim",
		Command: []string{
			"sh", "-c",
			"javac /app/script.java && java -cp /app script",
		},
	},
}

func (d DockerExecutor) Run(code string, lang string) (string, string, int64, error) {
	language := languages[lang]

	tmpfile, err := os.CreateTemp("", "script-*"+language.Extension)
	if err != nil {
		return "", "", 0, err
	}
	defer os.Remove(tmpfile.Name())

	tmpfile.WriteString(code)
	tmpfile.Close()

	dockerArgs := []string{
		"run",
		"--rm",
		"-v", fmt.Sprintf("%s:/app/script%s", tmpfile.Name(), language.Extension),
		"--network", "none",
		"--memory", "128m",
		"--cpus", "0.5",
		language.Image,
	}

	dockerArgs = append(dockerArgs, language.Command...)

	cmd := exec.Command("docker", dockerArgs...)

	stdout, _ := cmd.StdoutPipe()
	stderr, _ := cmd.StderrPipe()

	start := time.Now()
	cmd.Start()

	out, _ := io.ReadAll(stdout)
	errOut, _ := io.ReadAll(stderr)

	cmd.Wait()
	duration := time.Since(start).Milliseconds()

	return string(out), string(errOut), duration, nil
}
