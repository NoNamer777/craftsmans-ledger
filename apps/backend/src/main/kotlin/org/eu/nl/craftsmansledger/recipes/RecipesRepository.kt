package org.eu.nl.craftsmansledger.recipes

import io.viascom.nanoid.NanoId
import org.eu.nl.craftsmansledger.technologyTrees.TechnologyTree
import org.eu.nl.craftsmansledger.technologyTrees.technologyTreesRepository
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.statements.InsertStatement
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

fun InsertStatement<Number>.toRecipe(): Recipe {
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

    fun findOneById(recipeId: String) = transaction {
        RecipeTable.selectAll().where { RecipeTable.id eq recipeId }.map { it.toRecipe() }.singleOrNull()
    }

    fun create(data: CreateRecipeData) = transaction {
        RecipeTable
            .insert {
                it[id] = NanoId.generate()
                it[outputQuantity] = data.outputQuantity
                it[craftingTime] = data.craftingTime
                it[technologyTreeId] = data.technologyTree.id
                it[technologyPoints] = data.technologyPoints
            }
            .toRecipe()
    }
}

val recipesRepository = RecipesRepository()
