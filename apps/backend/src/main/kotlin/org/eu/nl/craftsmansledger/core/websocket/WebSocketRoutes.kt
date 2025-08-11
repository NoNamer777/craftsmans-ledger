package org.eu.nl.craftsmansledger.core.websocket

import io.ktor.server.routing.Route
import io.ktor.server.websocket.sendSerialized
import io.ktor.server.websocket.webSocket
import org.eu.nl.craftsmansledger.core.caching.cacheEvents

fun Route.webSocketRoutes() {
    webSocket("/ws") {
        cacheEvents.events.collect { data -> sendSerialized(InvalidateCacheMessage(data)) }
    }
}
