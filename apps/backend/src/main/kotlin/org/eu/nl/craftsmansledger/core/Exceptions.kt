package org.eu.nl.craftsmansledger.core

import io.ktor.http.HttpStatusCode
import java.util.Date

open class HttpException(
    override val message: String,
    val error: String,
    val status: Int,
    val timestamp: Date = Date()
): RuntimeException()

data class NotFoundException(
    override val message: String,
): HttpException(
    message = message,
    HttpStatusCode.NotFound.description,
    HttpStatusCode.NotFound.value
)

data class BadRequestException(
    override val message: String,
): HttpException(
    message = message,
    HttpStatusCode.NotFound.description,
    HttpStatusCode.NotFound.value,
)

data class InternalServerErrorException(
    override val message: String,
): HttpException(
    message = message,
    HttpStatusCode.InternalServerError.description,
    HttpStatusCode.InternalServerError.value,
)
