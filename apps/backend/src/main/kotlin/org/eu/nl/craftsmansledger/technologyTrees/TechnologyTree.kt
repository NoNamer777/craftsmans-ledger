package org.eu.nl.craftsmansledger.technologyTrees

import kotlinx.serialization.Serializable

@Serializable
data class TechnologyTree(
    val id: String,
    var name: String,
    var maxPoints: Int
)

@Serializable
data class CreateTechnologyTreeData(
    var name: String,
    var maxPoints: Int
)
