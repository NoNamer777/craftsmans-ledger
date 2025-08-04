package org.eu.nl.craftsmansledger.items

import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.request.uri
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.put
import io.ktor.server.routing.route
import org.eu.nl.craftsmansledger.core.exceptions.BadRequestException
import org.eu.nl.craftsmansledger.core.exceptions.NotFoundException

fun Route.itemRoutes() {
    route("/items") {
        get {
            call.respond(itemsService.getAll())
        }

        get("/query") {
            val nameQuery = call.request.queryParameters["nameQuery"]

            if (nameQuery == null) {
                throw BadRequestException("Query parameter \"nameQuery\" is required")
            }
            call.respond(itemsService.query(nameQuery))
        }

        post {
            val data = call.receive<CreateItemData>()
            val url = call.request.uri

            val item = itemsService.create(data)

            call.response.headers.append(HttpHeaders.Location, "$url/${item.id}")
            call.response.status(HttpStatusCode.Created)
            call.respond(item)
        }

        route("/{itemId}") {
            get {
                val itemIdPathParam = call.parameters["itemId"]
                val byId = itemsService.getById(itemId = itemIdPathParam!!)

                if (byId == null) {
                    throw NotFoundException("Item with ID \"$itemIdPathParam\" was not found")
                }
                call.respond(byId)
            }

            put {
                val itemIdPathParam = call.parameters["itemId"]
                val url = call.request.uri
                val data = call.receive<Item>()

                if (data.id != itemIdPathParam!!) {
                    throw BadRequestException("It's not allowed to modify data of Item on path \"$url\" with data from Item with ID \"${data.id}\"")
                }
                call.respond(itemsService.update(data))
            }

            delete {
                val itemIdPathParam = call.parameters["itemId"]
                call.respond(itemsService.remove(itemIdPathParam!!))
            }
        }
    }
}
