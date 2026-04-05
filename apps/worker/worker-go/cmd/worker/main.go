package main

import (
	"go-worker/internal/broker"
	"go-worker/internal/executor"
	"go-worker/internal/service"
	"log"

	"github.com/rabbitmq/amqp091-go"
)

func main() {
	conn, ch, err := broker.Connect("amqp://admin:admin@localhost:5672/")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()
	defer ch.Close()

	const maxWorkers = 10
	semaphore := make(chan struct{}, maxWorkers)

	err = ch.Qos(maxWorkers, 0, false)
	if err != nil {
		log.Fatal(err)
	}

	msgs, err := ch.Consume("code-submitted", "", false, false, false, false, nil)
	if err != nil {
		log.Fatal(err)
	}

	exec := executor.DockerExecutor{}
	worker := service.NewWorker(exec, ch)

	for msg := range msgs {
		semaphore <- struct{}{}

		go func(m amqp091.Delivery) {
			defer func() { <-semaphore }()

			worker.HandleMessage(m)
		}(msg)
	}
}
