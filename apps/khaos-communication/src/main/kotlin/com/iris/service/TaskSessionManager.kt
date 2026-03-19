package com.iris.service

import jakarta.enterprise.context.ApplicationScoped
import jakarta.websocket.Session
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CopyOnWriteArrayList

@ApplicationScoped
class TaskSessionManager {
  val sessions = ConcurrentHashMap<String, CopyOnWriteArrayList<Session>>()
}
