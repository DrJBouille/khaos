package com.iris.controller

import com.iris.data.task.TaskDTO
import com.iris.service.TaskService
import jakarta.inject.Inject
import jakarta.ws.rs.GET
import jakarta.ws.rs.POST
import jakarta.ws.rs.Path
import jakarta.ws.rs.PathParam
import jakarta.ws.rs.core.Response
import java.util.UUID

@Path("/api/tasks")
class TaskController {
  @Inject
  lateinit var taskService: TaskService

  @POST
  fun run(taskDTO: TaskDTO): Response {
    val response = taskService.runTask(taskDTO)
    return Response.ok(response).build()
  }

  @GET
  @Path("/{id}")
  fun getTaskById(@PathParam("id") id: UUID): Response {
    val task = taskService.getTaskById(id)
    return if (task != null) Response.ok(taskService.getTaskById(id)).build()
    else Response.status(404).build()
  }
}
