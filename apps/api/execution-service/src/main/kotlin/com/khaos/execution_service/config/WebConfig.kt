package com.khaos.execution_service.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter

@Configuration
class WebConfig {
  @Bean
  fun corsFilter(): CorsFilter {
    val config = CorsConfiguration()

    config.allowCredentials = true
    config.addAllowedOrigin("http://localhost:4200")

    config.allowedHeaders = mutableListOf(
        "Authorization",  // Authorization → for tokens (JWT, OAuth, etc.)
        "Cache-Control",  // Cache-Control → browser cache behavior
        "Content-Type",  // Content-Type → like application/json
        "X-Requested-With",  // X-Requested-With → for Ajax requests (especially legacy)
        "Accept",  // Accept → what response formats are acceptable (application/json, etc.)
        "Origin" // Origin → original domain of request (used internally)
    )

    config.allowedMethods = mutableListOf("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD")

    val source = UrlBasedCorsConfigurationSource()
    source.registerCorsConfiguration("/**", config)

    return CorsFilter(source)
  }
}
