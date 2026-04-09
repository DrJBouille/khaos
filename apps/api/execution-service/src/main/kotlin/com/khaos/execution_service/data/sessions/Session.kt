package com.khaos.execution_service.data.sessions

import com.fasterxml.jackson.annotation.JsonBackReference
import com.khaos.execution_service.data.user.KhaosUser
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "sessions")
data class Session (
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  var id: UUID? = null,

  var code: String = "",

  @Column(name = "is_opened")
  var isOpened: Boolean = false,

  @ManyToOne
  @JoinColumn(name = "user_id")
  @JsonBackReference
  val user: KhaosUser
)
