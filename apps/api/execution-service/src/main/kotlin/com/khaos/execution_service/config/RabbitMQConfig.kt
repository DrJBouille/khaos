package com.khaos.execution_service.config

import org.springframework.amqp.rabbit.connection.ConnectionFactory
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class RabbitMQConfig {
  @Bean
  fun messageConverter() = Jackson2JsonMessageConverter()

  @Bean
  fun rabbitTemplate(connectionFactory: ConnectionFactory, messageConverter: Jackson2JsonMessageConverter): RabbitTemplate {
    val template = RabbitTemplate(connectionFactory)
    template.messageConverter = messageConverter
    return template
  }
}
