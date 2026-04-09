package com.khaos.execution_service.service

import com.khaos.execution_service.data.sessions.Session
import com.khaos.execution_service.data.sessions.SessionRequest
import com.khaos.execution_service.repository.SessionRepository
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.stereotype.Service
import java.util.UUID
import kotlin.jvm.optionals.getOrNull

@Service
class SessionService(
  private val sessionRepository: SessionRepository,
  private val userService: KhaosUserService
) {
  fun createSession(sessionRequest: SessionRequest, jwt: Jwt): Session {
    val user = userService.getUserFromToken(jwt) ?: throw Error("User not found")

    val session = Session(code = sessionRequest.code, user = user)

    sessionRepository.save(session)
    return session
  }

  fun getSessions() = sessionRepository.findAll()

  fun getSession(id: UUID) = sessionRepository.findById(id).getOrNull()

  fun getSessionByUserToken(jwt: Jwt): Session? {
    val user = userService.getUserFromToken(jwt) ?: throw Error("User not found")
    return sessionRepository.findSessionByUser(user)
  }

  fun updateSession(id: UUID, sessionRequest: SessionRequest): Session? {
    val session = sessionRepository.findById(id).getOrNull() ?: return null

    session.code = sessionRequest.code

    sessionRepository.save(session)
    return session
  }

  fun toggleSession(jwt: Jwt, id: UUID): Session? {
    val user = userService.getUserFromToken(jwt) ?: return null
    val session = sessionRepository.findById(id).getOrNull() ?: return null

    if (session.user.id != user.id) return null

    session.isOpened = !session.isOpened
    sessionRepository.save(session)
    return session
  }

  fun deleteSession(id: UUID) = sessionRepository.deleteById(id)
}
