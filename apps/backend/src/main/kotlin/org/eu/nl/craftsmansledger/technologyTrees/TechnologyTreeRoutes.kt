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
import org.eu.nl.craftsmansledger.core.exceptions.BadRequestException
import org.eu.nl.craftsmansledger.core.exceptions.NotFoundException

fun Route.technologyTreeRoutes() {
    route("/technology-trees") {
        get {
            call.respond(technologyTreesService.getAll())
        }

        post {
            val data = call.receive<CreateTechnologyTreeData>()
            val url = call.request.uri

            val technologyTree = technologyTreesService.create(data)

            call.response.headers.append(HttpHeaders.Location, "$url/${technologyTree.id}")
            call.response.status(HttpStatusCode.Created)
            call.respond(technologyTree)
        }

        route("/{technologyTreeId}") {
            get {
                val technologyTreeIdPathParam = call.parameters["technologyTreeId"]
                val byId = technologyTreesService.getById(technologyTreeIdPathParam!!)

                if (byId == null) {
                    throw NotFoundException("Technology tree with ID \"$technologyTreeIdPathParam\" was not found")
                }
                call.respond(byId)
            }

            put {
                val technologyTreeIdPathParam = call.parameters["technologyTreeId"]
                val url = call.request.uri
                val data = call.receive<TechnologyTree>()

                if (data.id != technologyTreeIdPathParam) {
                    throw BadRequestException("It's not allowed to modify data of Technology Tree on path \"$url\" with data from Technology Tree with ID \"${data.id}\"")
                }
                call.respond(technologyTreesService.update(data))
            }

            delete {
                val technologyTreeIdPathParam = call.parameters["technologyTreeId"]
                call.respond(technologyTreesService.remove(technologyTreeIdPathParam!!))
            }
        }
    }
}
