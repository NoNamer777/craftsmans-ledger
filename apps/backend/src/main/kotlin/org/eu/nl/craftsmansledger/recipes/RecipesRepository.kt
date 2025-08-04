package org.eu.nl.craftsmansledger.recipes

import org.eu.nl.craftsmansledger.technologyTrees.TechnologyTree
import org.eu.nl.craftsmansledger.technologyTrees.technologyTreesRepository
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction

fun ResultRow.toRecipe(): Recipe {
    val technologyTreeId = this[RecipeTable.technologyTreeId]
    var technologyTree: TechnologyTree? = null

    transaction {
        technologyTree = technologyTreesRepository.findOneById(technologyTreeId)
    }
    return Recipe(
        this[RecipeTable.id],
        this[RecipeTable.outputQuantity],
        this[RecipeTable.craftingTime],
        technologyTree!!,
        this[RecipeTable.technologyPoints]
    )
}

class RecipesRepository {
    fun findAll() = transaction {
        RecipeTable.selectAll().map { it.toRecipe() }.toList()
    }
}

val recipesRepository = RecipesRepository()
