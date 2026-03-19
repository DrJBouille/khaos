package com.iris.service

import com.iris.data.task.Task
import com.iris.data.task.TaskDTO
import com.iris.data.task.TaskResponseDTO
import com.iris.repository.TaskRepository
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.transaction.Transactional
import org.eclipse.microprofile.context.ManagedExecutor
import java.util.UUID

@ApplicationScoped
class TaskService {
  @Inject
  lateinit var taskRepository: TaskRepository

  @Inject
  lateinit var taskWorker: TaskWorker

  @Inject
  lateinit var executor: ManagedExecutor

  fun runTask(taskDTO: TaskDTO): Task {
    val task = createTask()
    executor.runAsync { taskWorker.execute(task.id!!, taskDTO) }
    return task
  }

  @Transactional
  fun createTask(): Task {
    val task = Task()
    taskRepository.persist(task)
    return task
  }

  fun getTaskById(id: UUID): TaskResponseDTO? {
    val task = taskRepository.findById(id) ?: return null

    return TaskResponseDTO(task.id!!, task.status, "", "")
  }
}
