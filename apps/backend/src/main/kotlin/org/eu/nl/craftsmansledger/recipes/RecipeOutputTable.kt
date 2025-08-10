package org.eu.nl.craftsmansledger.recipes

import org.eu.nl.craftsmansledger.items.ItemTable
import org.jetbrains.exposed.dao.id.CompositeIdTable
import org.jetbrains.exposed.sql.ReferenceOption

object RecipeOutputTable: CompositeIdTable("recipe_outputs") {
    val recipeId = reference(
        name = "recipe_id",
        refColumn = RecipeTable.id,
        fkName = "fk_recipe_output",
        onDelete = ReferenceOption.CASCADE
    )

    val itemId = reference(
        name = "item_id",
        refColumn = ItemTable.id,
        fkName = "fk_item_output",
        onDelete = ReferenceOption.CASCADE
    )

    val quantity = integer("quantity").check("ck_valid_output_quantity") { it.greaterEq(1) }

    override val primaryKey = PrimaryKey(recipeId, itemId, name = "pk_recipe_output")
}
