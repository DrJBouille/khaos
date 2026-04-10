package com.khaos.execution_service.controller

import com.khaos.execution_service.data.sessions.Session
import com.khaos.execution_service.data.sessions.SessionRequest
import com.khaos.execution_service.data.sessions.SessionUpdateEvent
import com.khaos.execution_service.service.SessionService
import org.springframework.http.ResponseEntity
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/sessions")
class SessionController(
  private val sessionService: SessionService,
  private val messagingTemplate: SimpMessagingTemplate,
) {
  @GetMapping("/me")
  fun getSessions(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<Session> {
    try {
      val session = sessionService.getSessionByUserToken(jwt) ?: return ResponseEntity.notFound().build()
      return ResponseEntity.ok(session)
    } catch (e: Exception) {
      return ResponseEntity.notFound().build()
    }
  }

  @GetMapping("/{id}")
  fun getSession(@PathVariable id: UUID): ResponseEntity<Session> {
    val session = sessionService.getSession(id) ?: return ResponseEntity.notFound().build()
    if (session.isOpened) return ResponseEntity.ok(session)
    return ResponseEntity.badRequest().build()
  }

  @PostMapping
  fun createSession(@AuthenticationPrincipal jwt: Jwt, @RequestBody sessionRequest: SessionRequest): ResponseEntity<Session> {
    if (sessionService.getSessionByUserToken(jwt) != null) return ResponseEntity.badRequest().build()
    try {
      val session = sessionService.createSession(sessionRequest, jwt)
      return ResponseEntity.ok(session)
    } catch (e: Exception) {
      return ResponseEntity.notFound().build()
    }
  }

  @PutMapping("/{sessionId}")
  fun updateSession(@RequestBody sessionRequest: SessionRequest, @PathVariable sessionId: UUID): ResponseEntity<Session> {
    val session = sessionService.updateSession(sessionId, sessionRequest) ?: return ResponseEntity.notFound().build()
    return ResponseEntity.ok(session)
  }

  @PutMapping("/toggle/{sessionId}")
  fun toggleSession(@AuthenticationPrincipal jwt: Jwt, @PathVariable sessionId: UUID): ResponseEntity<Session> {
    val session = sessionService.toggleSession(jwt, sessionId) ?: return ResponseEntity.notFound().build()
    return ResponseEntity.ok(session)
  }

  @MessageMapping("/sessions/{sessionId}")
  fun sendUpdate(
    @DestinationVariable sessionId: String,
    @Payload sessionUpdateEvent: SessionUpdateEvent
  ) {
    messagingTemplate.convertAndSend("/topic/sessions/$sessionId", sessionUpdateEvent)
  }
}
