package org.eu.nl.craftsmansledger.recipes

class RecipesService {
    fun getAll(): List<Recipe> {
        val recipes = recipesRepository.findAll()
        return recipes.toList()
    }
}

val recipesService = RecipesService()
