package com.iris.data.runtime

data class RuntimeConfig(
  val image: String,
  val command: String,
  val scriptPath: String,
  val volume: String
)
