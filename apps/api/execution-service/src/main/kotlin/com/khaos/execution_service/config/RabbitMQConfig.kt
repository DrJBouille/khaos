package com.khaos.execution_service.config

import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.DirectExchange
import org.springframework.amqp.core.Queue
import org.springframework.amqp.rabbit.connection.ConnectionFactory
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class RabbitMQConfig {

  @Value("\${rabbitmq.topicExchangeName}")
  private lateinit var topicExchangeName: String

  @Value("\${rabbitmq.submittedQueueName}")
  private lateinit var submittedQueueName: String

  @Value("\${rabbitmq.executedQueueName}")
  private lateinit var executedQueueName: String

  @Bean
  fun exchange(): DirectExchange {
    return DirectExchange(topicExchangeName)
  }

  @Bean
  fun submittedQueue(): Queue {
    return Queue(submittedQueueName, true)
  }

  @Bean
  fun executedQueue(): Queue {
    return Queue(executedQueueName, true)
  }

  @Bean
  fun submittedBinding(submittedQueue: Queue, exchange: DirectExchange): Binding {
    return BindingBuilder.bind(submittedQueue).to(exchange).with(submittedQueueName)
  }

  @Bean
  fun executedBinding(executedQueue: Queue, exchange: DirectExchange): Binding {
    return BindingBuilder.bind(executedQueue).to(exchange).with(executedQueueName)
  }

  @Bean
  fun messageConverter(): Jackson2JsonMessageConverter {
    return Jackson2JsonMessageConverter()
  }

  @Bean
  fun rabbitTemplate(connectionFactory: ConnectionFactory, messageConverter: Jackson2JsonMessageConverter): RabbitTemplate {
    val template = RabbitTemplate(connectionFactory)
    template.messageConverter = messageConverter
    return template
  }
}
