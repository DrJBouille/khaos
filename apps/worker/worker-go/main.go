package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"

	"github.com/rabbitmq/amqp091-go"
)

type TaskStatus string

type TaskResponseEvent struct {
	Id     string     `json:"id"`
	Status TaskStatus `json:"status"`
	Output string     `json:"output"`
	Error  string     `json:"error"`
}

type TaskSubmittedEvent struct {
	Id       string `json:"id"`
	Code     string `json:"code"`
	Language string `json:"language"`
}

type Language struct {
	extension string
	image     string
	command   string
}

var Languages = map[string]Language{
	"JAVASCRIPT": Language{extension: ".js", image: "node:20-alpine", command: "node"},
	"PYTHON":     Language{extension: ".py", image: "python:3.11-slim", command: "python"},
}

const (
	NotStarted TaskStatus = "NOT_STARTED"
	Pending    TaskStatus = "PENDING"
	Running    TaskStatus = "RUNNING"
	Finished   TaskStatus = "FINISHED"
	Failed     TaskStatus = "FAILED"
	Cancelled  TaskStatus = "CANCELLED"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func sendResponse(d amqp091.Delivery, ch *amqp091.Channel, taskResponseEvent *TaskResponseEvent) {
	responseBody, err := json.Marshal(taskResponseEvent)
	if err != nil {
		log.Printf("Error JSON Marshal: %v", err)
		return
	}

	if d.ReplyTo != "" {
		err = ch.Publish(
			"",
			d.ReplyTo,
			false,
			false,
			amqp091.Publishing{
				ContentType:   "application/json",
				CorrelationId: d.CorrelationId,
				Body:          responseBody,
			},
		)
		failOnError(err, "Failed to publish a response")
	}
}

func run(event TaskSubmittedEvent) (string, string, error) {
	languageDetails := Languages[event.Language]
	tmpfile, err := os.CreateTemp("", "script-*"+languageDetails.extension)
	if err != nil {
		return "", "", err
	}
	defer os.Remove(tmpfile.Name())

	_, err = tmpfile.WriteString(event.Code)
	if err != nil {
		return "", "", err
	}
	tmpfile.Close()

	cmd := exec.Command(
		"docker", "run",
		"--rm",
		"-v", fmt.Sprintf("%s:/app/script%s", tmpfile.Name(), languageDetails.extension),
		"--network", "none",
		"--memory", "128m",
		"--cpus", "0.5",
		"--pids-limit", "64",
		languageDetails.image,
		languageDetails.command,
		fmt.Sprintf("/app/script%s", languageDetails.extension),
	)

	stdout, _ := cmd.StdoutPipe()
	stderr, _ := cmd.StderrPipe()

	err = cmd.Start()
	if err != nil {
		return "", "", err
	}

	outBytes, _ := io.ReadAll(stdout)
	errBytes, _ := io.ReadAll(stderr)

	return string(outBytes), string(errBytes), nil
}

func main() {
	conn, err := amqp091.Dial("amqp://admin:admin@localhost:5672/")
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	queueName := "code-submitted"

	msgs, err := ch.Consume(
		queueName,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Failed to register a consumer")

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			log.Printf("Received a message: %s", d.Body)

			var event TaskSubmittedEvent
			err := json.Unmarshal(d.Body, &event)
			if err != nil {
				log.Printf("Erreur JSON: %v", err)
				return
			}

			var taskResponseEvent = new(TaskResponseEvent)
			taskResponseEvent.Id = event.Id
			taskResponseEvent.Status = Running
			taskResponseEvent.Output = ""
			taskResponseEvent.Error = ""

			sendResponse(d, ch, taskResponseEvent)

			output, error, err := run(event)

			if err != nil {
				taskResponseEvent.Status = Failed
				sendResponse(d, ch, taskResponseEvent)
				return
			}

			taskResponseEvent.Output = output
			taskResponseEvent.Error = error
			taskResponseEvent.Status = Finished

			sendResponse(d, ch, taskResponseEvent)
		}
	}()

	log.Printf("Worker is waiting for messages. To exit press CTRL+C")
	<-forever
}
