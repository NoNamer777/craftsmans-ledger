package org.eu.nl.craftsmansledger.recipes

import io.viascom.nanoid.NanoId
import org.eu.nl.craftsmansledger.technologyTrees.TechnologyTree
import org.eu.nl.craftsmansledger.technologyTrees.technologyTreesRepository
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.statements.InsertStatement
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update

fun ResultRow.toRecipe(): Recipe {
    val technologyTreeId = this[RecipeTable.technologyTreeId]
    val recipeId = this[RecipeTable.id]
    var technologyTree: TechnologyTree? = null
    var inputs = mutableListOf<RecipeItem>()

    transaction {
        technologyTree = technologyTreesRepository.findOneById(technologyTreeId)
    }
    transaction {
        inputs = recipeInputsRepository.findAllByRecipe(recipeId)
    }
    return Recipe(
        id = this[RecipeTable.id],
        craftingTime = this[RecipeTable.craftingTime],
        technologyTree = technologyTree!!,
        technologyPoints = this[RecipeTable.technologyPoints],
        inputs = inputs,
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
                it[craftingTime] = data.craftingTime
                it[technologyTreeId] = data.technologyTree.id
                it[technologyPoints] = data.technologyPoints
            }
            .toRecipe()
    }

    fun update(data: Recipe): Recipe {
        transaction {
            RecipeTable.update({ RecipeTable.id eq data.id }) {
                it[craftingTime] = data.craftingTime
                it[technologyTreeId] = data.technologyTree.id
                it[technologyPoints] = data.technologyPoints
            }
        }
        return this.findOneById(data.id)!!
    }

    fun remove(recipeId: String) {
        transaction { RecipeTable.deleteWhere { RecipeTable.id eq recipeId } }
    }
}

val recipesRepository = RecipesRepository()
