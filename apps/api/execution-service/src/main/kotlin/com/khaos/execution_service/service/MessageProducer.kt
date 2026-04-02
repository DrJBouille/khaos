package com.khaos.execution_service.service

import com.khaos.execution_service.data.task.TaskSubmittedEvent
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class MessageProducer( private val rabbitTemplate: RabbitTemplate) {
  @Value("\${rabbitmq.topicExchangeName}")
  private lateinit var topicExchangeName: String

  @Value("\${rabbitmq.submittedQueueName}")
  private lateinit var submittedQueueName: String

  @Value("\${rabbitmq.executedQueueName}")
  private lateinit var executedQueueName: String

  fun send(event: TaskSubmittedEvent) {
    rabbitTemplate.convertAndSend(
      topicExchangeName,
      submittedQueueName,
      event
    ) { message ->
      message.messageProperties.replyTo = executedQueueName
      message.messageProperties.correlationId = event.id.toString()
      message
    }
  }
}
