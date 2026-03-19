package com.iris.data.task

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "tasks")
data class Task (
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  var id: UUID? = null,

  @Column(name = "docker_process_id", nullable = false)
  var dockerProcessId: String = "",

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  var status: TaskStatus = TaskStatus.PENDING,

  @Column(name = "created_at")
  var createdAt: LocalDateTime = LocalDateTime.now()
)
