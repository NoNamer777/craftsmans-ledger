package org.eu.nl.craftsmansledger.recipes

import org.eu.nl.craftsmansledger.technologyTrees.TechnologyTreeTable
import org.jetbrains.exposed.sql.Table

object RecipeTable: Table("recipes") {
    val id = varchar("id", 32)
    val outputQuantity = integer("output_quantity").check { it.greaterEq(1) }
    val craftingTime = double("crafting_time").check { it.greaterEq(0.0) }
    val technologyTreeId = reference(
        name = "technology_tree_id",
        refColumn = TechnologyTreeTable.id,
        fkName = "fk_recipe_technology_tree"
    )
    val technologyPoints = integer("technology_points").check { it.greaterEq(0) }

    override val primaryKey = PrimaryKey(id, name = "pk_recipe")
}
