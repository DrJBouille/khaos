package com.khaos.execution_service.data.sessions

import java.util.UUID

data class SessionUpdateEvent(
  val id: UUID,
  val message: String
)
