package broker

import "github.com/rabbitmq/amqp091-go"

func Connect(url string) (*amqp091.Connection, *amqp091.Channel, error) {
	conn, err := amqp091.Dial(url)
	if err != nil {
		return nil, nil, err
	}

	ch, err := conn.Channel()
	return conn, ch, err
}
