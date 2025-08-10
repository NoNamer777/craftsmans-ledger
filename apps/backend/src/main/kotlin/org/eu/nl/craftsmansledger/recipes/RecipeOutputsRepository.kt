package org.eu.nl.craftsmansledger.recipes

import org.eu.nl.craftsmansledger.items.Item
import org.eu.nl.craftsmansledger.items.itemsRepository
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.statements.InsertStatement
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update

fun ResultRow.toRecipeOutput(): RecipeItem {
    val itemId = this[RecipeOutputTable.itemId]

    var item: Item? = null

    transaction {
        item = itemsRepository.findOneById(itemId)
    }
    return RecipeItem(
        item = item!!,
        quantity = this[RecipeOutputTable.quantity]
    )
}

fun InsertStatement<Number>.toRecipeOutput(): RecipeItem {
    val itemId = this[RecipeOutputTable.itemId]

    var item: Item? = null

    transaction {
        item = itemsRepository.findOneById(itemId)
    }
    return RecipeItem(
        item = item!!,
        quantity = this[RecipeOutputTable.quantity]
    )
}

class RecipeOutputsRepository {
    fun findAllByRecipe(recipeId: String) = transaction {
        RecipeOutputTable.selectAll()
            .where { RecipeOutputTable.recipeId.eq(recipeId) }
            .map { it.toRecipeOutput() }
            .toMutableList()
    }

    fun findOneByRecipeAndItem(recipeId: String, itemId: String) = transaction {
        RecipeOutputTable.selectAll()
            .where { RecipeOutputTable.recipeId.eq(recipeId).and { RecipeOutputTable.itemId.eq(itemId) } }
            .map { it.toRecipeOutput() }
            .singleOrNull()
    }

    fun create(recipeId: String, output: RecipeItem) = transaction {
        RecipeOutputTable
            .insert {
                it[this.recipeId] = recipeId
                it[this.itemId] = output.item.id
                it[this.quantity] = output.quantity
            }
            .toRecipeOutput()
    }

    fun update(recipeId: String, output: RecipeItem): RecipeItem {
        transaction {
            RecipeOutputTable.update({
                RecipeOutputTable.recipeId.eq(recipeId).and { RecipeOutputTable.itemId.eq(output.item.id) }
            }) {
                it[this.quantity] = output.quantity
            }
        }
        return this.findOneByRecipeAndItem(recipeId, output.item.id)!!
    }

    fun remove(recipeId: String, itemId: String) = transaction {
        RecipeOutputTable.deleteWhere { RecipeOutputTable.recipeId.eq(recipeId).and { RecipeOutputTable.itemId.eq(itemId) } }
    }
}

val recipeOutputsRepository = RecipeOutputsRepository()
