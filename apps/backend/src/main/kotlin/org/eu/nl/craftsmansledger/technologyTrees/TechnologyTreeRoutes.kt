package org.eu.nl.craftsmansledger.technologyTrees

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

fun Route.technologyTreeRoutes() {
    route("/technology-trees") {
        get {
            call.respond(technologyTreesService.getAll())
        }

        post {
            val data = call.receive<CreateTechnologyTreeData>()
            val url = call.request.uri

            val technologyTree = technologyTreesService.create(data)
            cacheEvents.invalidateCacheForResource(ResourceType.TECHNOLOGY_TREES)

            call.response.headers.append(HttpHeaders.Location, "$url/${technologyTree.id}")
            call.respond(HttpStatusCode.Created, technologyTree)
        }

        route("/{technologyTreeId}") {
            get {
                val technologyTreeIdPathParam = call.parameters["technologyTreeId"]!!

                val byId = technologyTreesService.getById(technologyTreeIdPathParam) ?: throw HttpException(
                    "Technology tree with ID \"$technologyTreeIdPathParam\" was not found",
                    HttpStatusCode.NotFound
                )
                call.respond(byId)
            }

            put {
                val technologyTreeIdPathParam = call.parameters["technologyTreeId"]!!
                val url = call.request.uri
                val data = call.receive<TechnologyTree>()

                if (data.id != technologyTreeIdPathParam) {
                    throw HttpException(
                        "It's not allowed to modify data of Technology Tree on path \"$url\" with data from Technology Tree with ID \"${data.id}\"",
                        HttpStatusCode.BadRequest
                    )
                }
                val updatedTechnologyTree = technologyTreesService.update(data)
                cacheEvents.invalidateCacheForResource(ResourceType.TECHNOLOGY_TREES)

                call.respond(updatedTechnologyTree)
            }

            delete {
                val technologyTreeIdPathParam = call.parameters["technologyTreeId"]!!

                technologyTreesService.remove(technologyTreeIdPathParam)
                cacheEvents.invalidateCacheForResource(ResourceType.TECHNOLOGY_TREES)

                call.respond(HttpStatusCode.NoContent)
            }
        }
    }
}
