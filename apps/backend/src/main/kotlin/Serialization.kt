package org.eu.nl

import io.ktor.http.*
import io.ktor.serialization.JsonConvertException
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.eu.nl.model.Item
import org.eu.nl.model.ItemRepository
import org.jetbrains.exposed.sql.*
import java.lang.IllegalArgumentException

fun Application.configureSerialization(
    repository: ItemRepository
) {
    install(ContentNegotiation) {
        json()
    }
    routing {
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

