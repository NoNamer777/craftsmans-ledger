package org.eu.nl.craftsmansledger.core

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json
import org.eu.nl.craftsmansledger.items.itemRoutes
import org.eu.nl.craftsmansledger.technologyTrees.technologyTreeRoutes

fun Application.appRoutes() {
    val allowedDevOrigins = "https://localhost.admin.craftsmans-ledger.net:7100,https://localhost.www.craftsmans-ledger.net:7000,https://admin-dev.craftsmans-ledger.nl.eu.org,https://www-dev.craftsmans-ledger.nl.eu.org"

    val ktorEnv = System.getenv("KTOR_ENV")
    val allowedOrigins = System.getenv("CORS_ALLOWED_ORIGINS") ?: if (ktorEnv == "production") "" else allowedDevOrigins

    install(ContentNegotiation) {
        json(Json {
            isLenient = false
            prettyPrint = true
            allowStructuredMapKeys = false
        })
    }
    install(CORS) {
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowOrigins { it -> if (allowedOrigins == "*") true else allowedOrigins.split(",").contains(it)  }
    }

    routing {
        staticResources("/assets", "assets")

        install(StatusPages) {
            exception<Throwable> { call, cause ->
                val exception = InternalServerErrorException(cause.message ?: "An unexpected error occurred")

                call.response.status(HttpStatusCode.fromValue(exception.status))
                call.respond(exception)
            }
            exception<HttpException> { call, cause ->
                call.response.status(HttpStatusCode.fromValue(cause.status))
                call.respond(cause)
            }
        }

        get("/") {
            call.respondText("Hello World!")
        }

        technologyTreeRoutes()
        itemRoutes()
    }
}
