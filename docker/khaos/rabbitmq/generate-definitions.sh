cat > /etc/rabbitmq/definitions.json <<EOF
{
  "users": [
    {
      "name": "${RABBITMQ_DEFAULT_USER}",
      "password": "${RABBITMQ_DEFAULT_PASS}",
      "tags": "administrator"
    }
  ],
  "permissions": [
      {
        "user": "${RABBITMQ_DEFAULT_USER}",
        "vhost": "/",
        "configure": ".*",
        "write": ".*",
        "read": ".*"
      }
    ],
  "vhosts": [
      { "name": "/" }
    ],
    "exchanges": [
      {
        "name": "code-exchange",
        "type": "direct",
        "durable": true,
        "auto_delete": false,
        "internal": false,
        "arguments": {},
        "vhost": "/"
      }
    ],
    "queues": [
      {
        "name": "code-submitted",
        "durable": true,
        "auto_delete": false,
        "arguments": {},
        "vhost": "/"
      },
      {
        "name": "code-executed",
        "durable": true,
        "auto_delete": false,
        "arguments": {},
        "vhost": "/"
      }
    ],
    "bindings": [
      {
        "source": "code-exchange",
        "destination": "code-submitted",
        "destination_type": "queue",
        "routing_key": "code-submitted",
        "arguments": {},
        "vhost": "/"
      },
      {
        "source": "code-exchange",
        "destination": "code-executed",
        "destination_type": "queue",
        "routing_key": "code-executed",
        "arguments": {},
        "vhost": "/"
      }
    ]
}
EOF
