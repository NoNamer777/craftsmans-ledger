package org.eu.nl.craftsmansledger.core.exceptions

import io.ktor.http.HttpStatusCode
import kotlinx.serialization.Serializable
import org.eu.nl.craftsmansledger.core.DataAsStringSerializer
import java.util.Date

@Serializable
data class BadRequestException(
    override val message: String,
    val error: String = HttpStatusCode.BadRequest.description,
    val status: Int = HttpStatusCode.BadRequest.value,
    @Serializable(with = DataAsStringSerializer::class)
    val timestamp: Date = Date()
): RuntimeException()
