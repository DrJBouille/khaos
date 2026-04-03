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
	Command   string
}

var languages = map[string]Language{
	"JAVASCRIPT": {".js", "node:20-alpine", "node"},
	"PYTHON":     {".py", "python:3.11-slim", "python"},
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

	cmd := exec.Command(
		"docker", "run",
		"--rm",
		"-v", fmt.Sprintf("%s:/app/script%s", tmpfile.Name(), language.Extension),
		"--network", "none",
		"--memory", "128m",
		"--cpus", "0.5",
		language.Image,
		language.Command,
		fmt.Sprintf("/app/script%s", language.Extension),
	)

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
