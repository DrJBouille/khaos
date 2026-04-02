package com.khaos.execution_service

import org.springframework.amqp.rabbit.annotation.EnableRabbit
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@EnableRabbit
@SpringBootApplication
class ExecutionServiceApplication

fun main(args: Array<String>) {
	runApplication<ExecutionServiceApplication>(*args)
}
