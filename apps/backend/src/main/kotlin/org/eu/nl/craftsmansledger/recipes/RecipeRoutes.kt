package org.eu.nl.craftsmansledger.recipes

import io.ktor.server.response.respond
import io.ktor.server.routing.get
import io.ktor.server.routing.route

fun Route.recipeRoutes() {
    route("/recipes") {
        get {
            call.respond(recipesService.getAll())
        }
    }
}
