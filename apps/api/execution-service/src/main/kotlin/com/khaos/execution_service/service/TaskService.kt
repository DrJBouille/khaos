package com.khaos.execution_service.service

import com.khaos.execution_service.data.TaskStatus
import com.khaos.execution_service.data.task.Task
import com.khaos.execution_service.data.task.TaskRequest
import com.khaos.execution_service.data.task.TaskResultEvent
import com.khaos.execution_service.data.task.TaskSubmittedEvent
import com.khaos.execution_service.repository.TaskRepository
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service
import java.util.UUID
import kotlin.jvm.optionals.getOrNull

@Service
class TaskService(
  private val taskRepository: TaskRepository,
  private val messageProducer: MessageProducer,
  private val messagingTemplate: SimpMessagingTemplate,
) {
  fun createTask(taskRequest: TaskRequest): Task {
    val task = Task()
    taskRepository.save(task)

    val taskSubmittedEvent = TaskSubmittedEvent(task.id!!, taskRequest.code, taskRequest.language)
    messageProducer.send(taskSubmittedEvent)

    return task
  }

  fun getTask(id: UUID): Task? {
    return taskRepository.findById(id).getOrNull()
  }

  fun getTasks(): List<Task> {
    return taskRepository.findAll().toList()
  }

  fun updateTask(taskResultEvent: TaskResultEvent) {
    val task = getTask(UUID.fromString(taskResultEvent.id)) ?: return

    task.status = TaskStatus.valueOf(taskResultEvent.status)

    println(taskResultEvent)
    messagingTemplate.convertAndSend("/topic/tasks/${task.id}", taskResultEvent)

    taskRepository.save(task)
  }

  fun deleteTask(id: UUID) {
    taskRepository.deleteById(id)
  }
}
