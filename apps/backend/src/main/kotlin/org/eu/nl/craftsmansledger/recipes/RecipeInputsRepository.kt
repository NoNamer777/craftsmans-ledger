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

fun ResultRow.toRecipeItem(): RecipeItem {
    val itemId = this[RecipeInputTable.itemId]

    var item: Item? = null

    transaction {
        item = itemsRepository.findOneById(itemId)
    }
    return RecipeItem(
        item = item!!,
        quantity = this[RecipeInputTable.quantity]
    )
}

fun InsertStatement<Number>.toRecipeItem(): RecipeItem {
    val itemId = this[RecipeInputTable.itemId]

    var item: Item? = null

    transaction {
        item = itemsRepository.findOneById(itemId)
    }
    return RecipeItem(
        item = item!!,
        quantity = this[RecipeInputTable.quantity]
    )
}

class RecipeInputsRepository {
    fun findAllByRecipe(recipeId: String) = transaction {
        RecipeInputTable.selectAll()
            .where { RecipeInputTable.recipeId.eq(recipeId) }
            .map { it.toRecipeItem() }
            .toMutableList()
    }

    fun findOneByRecipeAndItem(recipeId: String, itemId: String) = transaction {
        RecipeInputTable.selectAll()
            .where { RecipeInputTable.recipeId.eq(recipeId).and { RecipeInputTable.itemId.eq(itemId) } }
            .map { it.toRecipeItem() }
            .singleOrNull()
    }

    fun create(recipeId: String, input: RecipeItem) = transaction {
        RecipeInputTable
            .insert {
                it[this.recipeId] = recipeId
                it[this.itemId] = input.item.id
                it[this.quantity] = input.quantity
            }
            .toRecipeItem()
    }

    fun update(recipeId: String, input: RecipeItem): RecipeItem {
        transaction {
            RecipeInputTable.update({
                RecipeInputTable.recipeId.eq(recipeId).and { RecipeInputTable.itemId.eq(input.item.id) }
            }) {
                it[this.quantity] = input.quantity
            }
        }
        return this.findOneByRecipeAndItem(recipeId, input.item.id)!!
    }

    fun remove(recipeId: String, itemId: String) = transaction {
        RecipeInputTable.deleteWhere { RecipeInputTable.recipeId.eq(recipeId).and { RecipeInputTable.itemId.eq(itemId) } }
    }
}

val recipeInputsRepository = RecipeInputsRepository()
