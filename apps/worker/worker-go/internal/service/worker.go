package service

import (
	"encoding/json"
	"log"

	"github.com/rabbitmq/amqp091-go"

	"go-worker/internal/executor"
	"go-worker/internal/model"
)

type Worker struct {
	executor executor.Executor
	channel  *amqp091.Channel
}

func NewWorker(exec executor.Executor, ch *amqp091.Channel) *Worker {
	return &Worker{executor: exec, channel: ch}
}

func (worker *Worker) HandleMessage(d amqp091.Delivery) {
	defer d.Ack(false)
	var event model.TaskSubmittedEvent

	if err := json.Unmarshal(d.Body, &event); err != nil {
		log.Println("JSON error:", err)
		return
	}

	response := model.TaskResponseEvent{
		Id:     event.Id,
		Status: model.Running,
	}

	worker.sendResponse(d, &response)

	out, errOut, duration, err := worker.executor.Run(event.Code, event.Language)

	if err != nil {
		response.Status = model.Failed
		worker.sendResponse(d, &response)
		return
	}

	response.Output = out
	response.Error = errOut
	response.Duration = &duration
	response.Status = model.Finished

	worker.sendResponse(d, &response)
}

func (worker *Worker) sendResponse(d amqp091.Delivery, response *model.TaskResponseEvent) {
	body, err := json.Marshal(response)
	if err != nil {
		log.Println("JSON marshal error:", err)
		return
	}

	if d.ReplyTo == "" {
		return
	}

	err = worker.channel.Publish(
		"",
		d.ReplyTo,
		false,
		false,
		amqp091.Publishing{
			ContentType:   "application/json",
			CorrelationId: d.CorrelationId,
			Body:          body,
		},
	)

	if err != nil {
		log.Println("Publish error:", err)
	}
}
