package org.eu.nl.craftsmansledger.model

import io.viascom.nanoid.NanoId
import kotlinx.serialization.Serializable

@Serializable
data class Item(
    val id: String = NanoId.generate(),
    val name: String,
    val weight: Double,
    val baseValue: Double,
)
