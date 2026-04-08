package com.khaos.execution_service.controller

import com.khaos.execution_service.data.user.KhaosUser
import com.khaos.execution_service.service.KhaosUserService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/users")
class KhaosUserController(
  private val khaosUserService: KhaosUserService
) {
  @GetMapping("/me")
  fun me(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<KhaosUser> {
    return ResponseEntity.ok(khaosUserService.createUserFromToken(jwt))
  }
}
