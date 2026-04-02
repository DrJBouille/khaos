package com.khaos.execution_service.data.task

data class TaskResultEvent (
  val id: String = "",
  val status: String = "",
  val output: String = "",
  val error: String = "",
  val duration: Int? = null,
)
