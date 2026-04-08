package com.khaos.execution_service.data.user

import com.fasterxml.jackson.annotation.JsonManagedReference
import com.khaos.execution_service.data.sessions.Session
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "khaos_users")
data class KhaosUser(
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  var id: UUID? = null,

  @Column(nullable = false, name = "keycloak_id", length = 255)
  var keycloakId: String,

  @Column(nullable = false, name = "username", length = 24)
  var username: String,

  @Column(nullable = false, name = "email", length = 255)
  var email: String,

  @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL])
  @JsonManagedReference
  var sessions: MutableList<Session> = mutableListOf(),

  @Column(name = "created_at")
  var createdAt: LocalDateTime = LocalDateTime.now()
)
