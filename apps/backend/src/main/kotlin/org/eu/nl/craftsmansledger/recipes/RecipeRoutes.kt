package org.eu.nl.craftsmansledger.recipes

import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receive
import io.ktor.server.request.uri
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.put
import io.ktor.server.routing.route
import org.eu.nl.craftsmansledger.core.HttpException

fun Route.recipeRoutes() {
    route("/recipes") {
        get {
            call.respond(recipesService.getAll())
        }

        post {
            val dto = call.receive<CreateRecipeDto>()
            val url = call.request.uri

            val recipe = recipesService.create(dto)

            call.response.headers.append(HttpHeaders.Location, "$url/${recipe.id}")
            call.respond(HttpStatusCode.Created, recipe)
        }

        route("/{recipeId}") {
            get {
                val recipeIdParam = call.parameters["recipeId"]
                val byId = recipesService.getById(recipeIdParam!!)

                if (byId == null) {
                    throw HttpException(
                        "Recipe with ID \"$recipeIdParam\" was not found",
                        HttpStatusCode.NotFound
                    )
                }
                call.respond(byId)
            }

            put {
                val recipeIdParam = call.parameters["recipeId"]
                val url = call.request.uri
                val dto = call.receive<UpdateRecipeDto>()

                if (dto.id != recipeIdParam!!) {
                    throw HttpException(
                        "It's not allowed to modify data of Recipe on path \"$url\" with data from Recipe with ID \"${dto.id}\"",
                        HttpStatusCode.BadRequest
                    )
                }
                call.respond(recipesService.update(dto))
            }
        }
    }
}
