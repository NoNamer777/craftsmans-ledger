package org.eu.nl.craftsmansledger.recipes

import kotlinx.serialization.Serializable
import org.eu.nl.craftsmansledger.items.Item
import org.eu.nl.craftsmansledger.technologyTrees.TechnologyTree

@Serializable
data class RecipeItem(
    val item: Item,
    val quantity: Int,
)

@Serializable
data class RecipeItemDto(
    val itemId: String,
    val quantity: Int,
)

@Serializable
data class Recipe(
    val id: String,
    var craftingTime: Double,
    var technologyTree: TechnologyTree,
    var technologyPoints: Int,
    var inputs: List<RecipeItem> = mutableListOf(),
    var outputs: List<RecipeItem> = mutableListOf(),
) {
    fun hasInputWithItem(itemId: String) = inputs.find { it.item.id == itemId } != null

    fun hasOutputWithItem(itemId: String) = outputs.find { it.item.id == itemId } != null
}

@Serializable
data class UpdateRecipeDto(
    val id: String,
    val craftingTime: Double,
    val technologyTreeId: String,
    val technologyPoints: Int,
)

data class CreateRecipeData(
    var craftingTime: Double,
    var technologyTree: TechnologyTree,
    var technologyPoints: Int,
)

@Serializable
data class CreateRecipeDto(
    var craftingTime: Double,
    var technologyTreeId: String,
    var technologyPoints: Int,
)
