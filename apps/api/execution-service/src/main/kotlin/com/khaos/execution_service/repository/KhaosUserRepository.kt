package com.khaos.execution_service.repository

import com.khaos.execution_service.data.user.KhaosUser
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface KhaosUserRepository : CrudRepository<KhaosUser, UUID> {
  fun findByKeycloakId(keycloakId: String): KhaosUser?
}
