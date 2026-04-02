package com.khaos.execution_service.data.task

import com.khaos.execution_service.data.Languages

data class TaskRequest(
  val language: Languages,
  val code: String,
)
