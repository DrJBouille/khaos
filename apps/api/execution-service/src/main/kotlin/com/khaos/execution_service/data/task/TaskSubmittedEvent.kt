package com.khaos.execution_service.data.task

import com.khaos.execution_service.data.Languages
import java.util.UUID

data class TaskSubmittedEvent (
  val id: UUID,
  val code: String,
  val language: Languages,
)
