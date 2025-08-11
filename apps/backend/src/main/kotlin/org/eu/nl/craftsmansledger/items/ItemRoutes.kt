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
import org.eu.nl.craftsmansledger.core.HttpException
import org.eu.nl.craftsmansledger.core.caching.ResourceType
import org.eu.nl.craftsmansledger.core.caching.cacheEvents

fun Route.itemRoutes() {
    route("/items") {
        get {
            call.respond(itemsService.getAll())
        }

        get("/query") {
            val nameQuery = call.request.queryParameters["nameQuery"]
                ?: throw HttpException("Query parameter \"nameQuery\" is required", HttpStatusCode.BadRequest)

            call.respond(itemsService.query(nameQuery))
        }

        post {
            val data = call.receive<CreateItemData>()
            val url = call.request.uri

            val item = itemsService.create(data)
            cacheEvents.invalidateCacheForResource(ResourceType.ITEMS)

            call.response.headers.append(HttpHeaders.Location, "$url/${item.id}")
            call.respond(HttpStatusCode.Created, item)
        }

        route("/{itemId}") {
            get {
                val itemIdPathParam = call.parameters["itemId"]!!
                val byId = itemsService.getById(itemId = itemIdPathParam) ?: throw HttpException(
                    "Item with ID \"$itemIdPathParam\" was not found",
                    HttpStatusCode.NotFound
                )
                call.respond(byId)
            }

            put {
                val itemIdPathParam = call.parameters["itemId"]!!
                val url = call.request.uri
                val data = call.receive<Item>()

                if (data.id != itemIdPathParam) {
                    throw HttpException(
                        "It's not allowed to modify data of Item on path \"$url\" with data from Item with ID \"${data.id}\"",
                        HttpStatusCode.BadRequest
                    )
                }
                val updatedItem = itemsService.update(data)
                cacheEvents.invalidateCacheForResource(ResourceType.ITEMS)

                call.respond(updatedItem)
            }

            delete {
                val itemIdPathParam = call.parameters["itemId"]!!

                itemsService.remove(itemIdPathParam)
                cacheEvents.invalidateCacheForResource(ResourceType.ITEMS)

                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}
