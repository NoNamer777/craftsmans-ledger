package org.eu.nl.craftsmansledger.recipes

import kotlinx.serialization.Serializable
import org.eu.nl.craftsmansledger.technologyTrees.TechnologyTree

@Serializable
data class Recipe(
    val id: String,
    var craftingTime: Double,
    var technologyTree: TechnologyTree,
    var technologyPoints: Int,
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

@Serializable
data class UpdateRecipeDto(
    val id: String,
    var craftingTime: Double,
    var technologyTreeId: String,
    var technologyPoints: Int,
)
