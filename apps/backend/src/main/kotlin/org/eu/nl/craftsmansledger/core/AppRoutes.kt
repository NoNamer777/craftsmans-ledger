package org.eu.nl.craftsmansledger.core

import io.ktor.http.*
import io.ktor.serialization.JsonConvertException
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.request.receive
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json
import org.eu.nl.craftsmansledger.model.Item
import org.eu.nl.craftsmansledger.model.ItemRepository

fun Application.appRoutes(repository: ItemRepository) {
    install(ContentNegotiation) {
        json(Json {
            isLenient = false
            prettyPrint = true
            allowStructuredMapKeys = false
        })
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

        // TODO: Extract routes for Items
        route("/items") {
            get {
                val items = repository.allItems()
                call.respond(items)
            }

            get("/query") {
                // TODO: Filter items depending on the query parameters

                val name = call.queryParameters["name"]
                if (name == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@get
                }

                val item = repository.itemByName(name)
                if (item == null) {
                    call.respond(HttpStatusCode.NotFound)
                    return@get
                }

                call.respond(item)
            }

            post {
                try {
                    val item = call.receive<Item>()
                    repository.addItem(item)
                    call.respond(HttpStatusCode.NoContent)
                } catch (ex: IllegalArgumentException) {
                    call.respond(HttpStatusCode.BadRequest)
                } catch (ex: JsonConvertException) {
                    call.respond(HttpStatusCode.BadRequest)
                }
            }

            delete("/{itemName}") {
                val name = call.parameters["itemName"]
                if (name == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@delete
                }

                if (repository.removeItem(name)) {
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }
        }
    }
}
