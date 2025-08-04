package org.eu.nl.craftsmansledger.core

import io.ktor.http.HttpStatusCode
import kotlinx.serialization.Serializable
import kotlinx.serialization.Transient
import java.util.Date

@Serializable
class HttpException(
    override val message: String,

    @Transient
    val httpStatusCode: HttpStatusCode = HttpStatusCode.InternalServerError,
): RuntimeException(message) {
    val status = httpStatusCode.value
    val error = httpStatusCode.description

    @Serializable(with = DataAsStringSerializer::class)
    val timestamp = Date()
}
