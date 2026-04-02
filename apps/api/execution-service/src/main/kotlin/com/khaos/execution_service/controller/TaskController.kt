package com.khaos.execution_service.controller

import com.khaos.execution_service.data.task.Task
import com.khaos.execution_service.data.task.TaskRequest
import com.khaos.execution_service.service.TaskService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/tasks")
class TaskController {
  @Autowired
  private lateinit var taskService: TaskService

  @PostMapping
  fun createTask(@RequestBody taskRequest: TaskRequest): ResponseEntity<Task> {
    return ResponseEntity.ok(taskService.createTask(taskRequest))
  }

  @GetMapping("/{id}")
  fun getTask(@PathVariable id: UUID): ResponseEntity<Task> {
    val task = taskService.getTask(id) ?: return ResponseEntity.notFound().build()
    return ResponseEntity.ok(task)
  }

  @GetMapping
  fun listTasks(): ResponseEntity<List<Task>> {
    return ResponseEntity.ok(taskService.getTasks())
  }
}
