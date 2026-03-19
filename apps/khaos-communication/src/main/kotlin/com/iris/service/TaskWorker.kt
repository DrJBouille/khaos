package com.iris.service

import com.iris.data.task.Languages
import com.iris.data.task.TaskDTO
import com.iris.data.task.TaskResponseDTO
import com.iris.data.task.TaskStatus
import com.iris.repository.TaskRepository
import com.iris.runtime.RuntimeFactory
import com.iris.runtime.RuntimeFactoryImpl
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import java.util.UUID

@ApplicationScoped
class TaskWorker {
  @Inject
  lateinit var taskRepository: TaskRepository

  @Inject
  lateinit var taskWebsocket: TaskWebsocket


  fun execute(id: UUID, taskDto: TaskDTO) {
    val runtime = getRuntimeFactory(taskDto.language)
    val taskResponseDTO = TaskResponseDTO(id, TaskStatus.RUNNING, "", "")

    updateStatus(id, TaskStatus.RUNNING)
    taskWebsocket.sendMessage(taskResponseDTO)

    val result = runtime.run(taskDto.code)

    taskResponseDTO.output = result.output
    taskResponseDTO.error = result.error

    val finalStatus = if (result.error != "") TaskStatus.FAILED else TaskStatus.FINISHED

    updateStatus(id, finalStatus)

    taskResponseDTO.status = finalStatus
    taskWebsocket.sendMessage(taskResponseDTO)
  }

  @Transactional
  fun updateStatus(id: UUID, status: TaskStatus) {
    val task = taskRepository.findById(id) ?: return
    task.status = status
    taskRepository.persist(task)
  }

  private fun getRuntimeFactory(language: Languages): RuntimeFactory {
    return when (language) {
      Languages.JAVASCRIPT -> JAVASCRIPT_RUNTIME_FACTORY
      Languages.PYTHON -> PYTHON_RUNTIME_FACTORY
    }
  }

  companion object {
    val JAVASCRIPT_RUNTIME_FACTORY = RuntimeFactoryImpl("node:20-alpine", "node", ".js")
    val PYTHON_RUNTIME_FACTORY = RuntimeFactoryImpl("python:3.11-slim", "python", ".py")
  }
}
