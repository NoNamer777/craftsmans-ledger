package org.eu.nl.craftsmansledger.core.websocket

import kotlinx.serialization.Serializable

enum class WebSocketMessageType(val value: String) {
    INVALIDATE_CACHE("invalidate-cache")
}

@Serializable
sealed class WebSocketMessage {
    abstract val type: String
}

@Serializable
data class InvalidateCacheData(val resourceType: String)

@Serializable
data class InvalidateCacheMessage(
    val data: InvalidateCacheData,

    override val type: String = WebSocketMessageType.INVALIDATE_CACHE.value
): WebSocketMessage()
