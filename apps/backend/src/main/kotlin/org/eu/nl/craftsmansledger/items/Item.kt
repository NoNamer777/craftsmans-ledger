package org.eu.nl.craftsmansledger.items

import kotlinx.serialization.Serializable

@Serializable
data class Item(
    val id: String,
    var name: String,
    var weight: Double,
    var baseValue: Double,
)

@Serializable
data class CreateItemData(
    var name: String,
    var weight: Double,
    var baseValue: Double,
)
