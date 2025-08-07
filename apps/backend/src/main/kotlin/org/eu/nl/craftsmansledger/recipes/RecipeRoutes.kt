package org.eu.nl.craftsmansledger.recipes

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
                val recipeIdParam = call.parameters["recipeId"]!!

                val byId = recipesService.getById(recipeIdParam) ?: throw HttpException(
                    "Recipe with ID \"$recipeIdParam\" was not found",
                    HttpStatusCode.NotFound
                )
                call.respond(byId)
            }

            put {
                val recipeIdParam = call.parameters["recipeId"]!!
                val url = call.request.uri
                val dto = call.receive<UpdateRecipeDto>()

                if (dto.id != recipeIdParam) {
                    throw HttpException(
                        "It's not allowed to modify data of Recipe on path \"$url\" with data from Recipe with ID \"${dto.id}\"",
                        HttpStatusCode.BadRequest
                    )
                }
                call.respond(recipesService.update(dto))
            }

            delete {
                val recipeIdParam = call.parameters["recipeId"]
                call.respond(recipesService.remove(recipeIdParam!!))
            }

            route("/inputs") {
                get {
                    val recipeIdParam = call.parameters["recipeId"]!!
                    call.respond(recipesService.getAllInputsOfRecipe(recipeIdParam))
                }

                post {
                    val recipeIdParam = call.parameters["recipeId"]!!
                    val dto = call.receive<RecipeItemDto>()
                    val url = call.request.uri

                    val input = recipesService.addRecipeInput(recipeIdParam, dto)

                    call.response.headers.append(HttpHeaders.Location, "$url/${input.item.id}")
                    call.respond(HttpStatusCode.Created, input)
                }

                route("/{itemId}") {
                    get {
                        val recipeIdParam = call.parameters["recipeId"]!!
                        val itemIdParam = call.parameters["itemId"]!!

                        val input = recipesService.getInputOfRecipe(recipeIdParam, itemIdParam) ?: throw HttpException(
                            "Recipe with ID \"$recipeIdParam\" does not have an input with Item with ID \"${itemIdParam}\"",
                            HttpStatusCode.NotFound
                        )
                        call.respond(input)
                    }
                }
            }
        }
    }
}
