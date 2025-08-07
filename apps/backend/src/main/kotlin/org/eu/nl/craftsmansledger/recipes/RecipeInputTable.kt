package org.eu.nl.craftsmansledger.recipes

import org.eu.nl.craftsmansledger.items.ItemTable
import org.jetbrains.exposed.dao.id.CompositeIdTable
import org.jetbrains.exposed.sql.ReferenceOption

object RecipeInputTable: CompositeIdTable("recipe_inputs") {
    val recipeId = reference(
        name = "recipe_id",
        refColumn = RecipeTable.id,
        fkName = "fk_recipe_input",
        onDelete = ReferenceOption.CASCADE
    ).entityId()
    val itemId = reference(
        name = "item_id",
        refColumn = ItemTable.id,
        fkName = "fk_item_input",
        onDelete = ReferenceOption.CASCADE
    ).entityId()
    val quantity = integer("quantity").check { it.greaterEq(1) }

    override val primaryKey = PrimaryKey(recipeId, itemId, name = "pk_recipe_input")
}