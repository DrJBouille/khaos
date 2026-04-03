package main

import (
	"go-worker/internal/broker"
	"go-worker/internal/executor"
	"go-worker/internal/service"
	"log"
)

func main() {
	conn, ch, err := broker.Connect("amqp://admin:admin@localhost:5672/")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()
	defer ch.Close()

	msgs, err := ch.Consume("code-submitted", "", true, false, false, false, nil)
	if err != nil {
		log.Fatal(err)
	}

	exec := executor.DockerExecutor{}
	worker := service.NewWorker(exec, ch)

	for msg := range msgs {
		go worker.HandleMessage(msg)
	}
}
