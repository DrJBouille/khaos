package com.iris.runtime

import com.iris.data.task.Result

interface RuntimeFactory {
  val image: String
  val command: String
  val extension: String
  fun run(code: String): Result
}
