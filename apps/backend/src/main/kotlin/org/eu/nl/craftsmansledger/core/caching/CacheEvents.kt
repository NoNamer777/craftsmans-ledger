package org.eu.nl.craftsmansledger.core.caching

import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import org.eu.nl.craftsmansledger.core.websocket.InvalidateCacheData

enum class ResourceType(val resourceType: String) {
    ITEMS("Items"),
    RECIPES("Recipes"),
    TECHNOLOGY_TREES("TechnologyTrees"),
}

class CacheEvents {
    private val _events = MutableSharedFlow<InvalidateCacheData>()

    val events = _events.asSharedFlow()

    suspend fun invalidateCacheForResource(resourceType: ResourceType) {
        _events.emit(InvalidateCacheData(resourceType.resourceType))
    }
}

val cacheEvents = CacheEvents()
