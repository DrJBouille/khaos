package com.khaos.execution_service.service

import com.khaos.execution_service.data.task.TaskResultEvent
import com.khaos.execution_service.repository.TaskRepository
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Service

@Service
class ResultListener(private val taskService: TaskService,) {
  @RabbitListener(queues = ["\${rabbitmq.executedQueueName}"])
  fun handle(event: TaskResultEvent) {
    taskService.updateTask(event)
  }
}
