package com.khaos.execution_service.repository

import com.khaos.execution_service.data.task.Task
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface TaskRepository : CrudRepository<Task, UUID> {
}
