package com.khaos.execution_service.service

import com.khaos.execution_service.data.user.KhaosUser
import com.khaos.execution_service.repository.KhaosUserRepository
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.stereotype.Service

@Service
class KhaosUserService(
  private val khaosUserRepository: KhaosUserRepository
) {
  fun createUserFromToken(jwt: Jwt): KhaosUser {
    val keycloakId = jwt.subject

    val existingUser = khaosUserRepository.findByKeycloakId(keycloakId)
    if (existingUser != null) return existingUser

    val username = jwt.getClaimAsString("preferred_username")
    val email = jwt.getClaimAsString("email")

    val user = KhaosUser(
      keycloakId = keycloakId,
      username = username,
      email = email,
    )

    return khaosUserRepository.save(user)
  }
}
