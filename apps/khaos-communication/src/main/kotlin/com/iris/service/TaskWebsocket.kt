package com.iris.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.iris.data.task.TaskResponseDTO
import jakarta.inject.Inject
import jakarta.websocket.OnClose
import jakarta.websocket.OnOpen
import jakarta.websocket.Session
import jakarta.websocket.server.PathParam
import jakarta.websocket.server.ServerEndpoint

@ServerEndpoint("/task/{taskId}")
class TaskWebsocket {
  @Inject
  lateinit var mapper: ObjectMapper

  @Inject
  lateinit var taskSessionManager: TaskSessionManager

  @OnOpen
  fun onOpen(session: Session, @PathParam("taskId") taskId: String) {
    taskSessionManager.sessions
      .computeIfAbsent(taskId) { java.util.concurrent.CopyOnWriteArrayList() }
      .add(session)
  }

  @OnClose
  fun onClose(session: Session, @PathParam("taskId") taskId: String) {
    taskSessionManager.sessions[taskId]?.remove(session)
  }

  fun sendMessage(taskResponseDTO: TaskResponseDTO) {
    val taskId = taskResponseDTO.id.toString()
    val sessions = taskSessionManager.sessions[taskId] ?: return
    sessions.forEach { session -> session.asyncRemote.sendText(mapper.writeValueAsString(taskResponseDTO)) }
  }
}
