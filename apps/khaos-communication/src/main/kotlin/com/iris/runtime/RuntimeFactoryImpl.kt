package com.iris.runtime

import com.iris.data.task.Result
import java.io.File

class RuntimeFactoryImpl(
  override val image: String,
  override val command: String,
  override val extension: String,
) : RuntimeFactory {
  override fun run(code: String): Result {
    val tempFile = File.createTempFile("script", extension)
    tempFile.writeText(code)

    val process = ProcessBuilder(
      "docker",
      "run",
      "--rm",
      "-v", "${tempFile.absolutePath}:/app/script${extension}",
      image,
      command,
      "/app/script${extension}",
      "--network", "none",
      "--memory", "128m",
      "--cpus", "0.5",
      "--pids-limit", "64"
    ).start()

    val output = process.inputStream.bufferedReader().readText()
    val error = process.errorStream.bufferedReader().readText()

    process.waitFor()
    tempFile.delete()

    return Result(output, error)
  }
}
