package com.iris.repository

import com.iris.data.task.Task
import io.quarkus.hibernate.orm.panache.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import java.util.UUID

@ApplicationScoped
class TaskRepository : PanacheRepository<Task> {
  fun findById(id: UUID): Task? = find("id", id).firstResult()
}
