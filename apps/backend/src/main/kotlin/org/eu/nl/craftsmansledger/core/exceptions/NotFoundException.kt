package org.eu.nl.craftsmansledger.core.exceptions

import io.ktor.http.HttpStatusCode
import kotlinx.serialization.Serializable
import org.eu.nl.craftsmansledger.core.DataAsStringSerializer
import java.util.Date

@Serializable
data class NotFoundException(
    override val message: String,
    val error: String = HttpStatusCode.NotFound.description,
    val status: Int = HttpStatusCode.NotFound.value,
    @Serializable(with = DataAsStringSerializer::class)
    val timestamp: Date = Date()
): RuntimeException()
