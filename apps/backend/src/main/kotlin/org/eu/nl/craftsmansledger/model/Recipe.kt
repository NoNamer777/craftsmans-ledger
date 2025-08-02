package org.eu.nl.craftsmansledger.model

import io.viascom.nanoid.NanoId
import kotlinx.serialization.Serializable

@Serializable
data class Recipe(
    val id: String = NanoId.generate(),
    val quantity: Int,
    val craftingTime: Int,
)
