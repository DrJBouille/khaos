package com.iris.data.task

import java.util.UUID

data class TaskResponseDTO(
  val id: UUID,
  var status: TaskStatus,
  var output: String,
  var error: String
)
