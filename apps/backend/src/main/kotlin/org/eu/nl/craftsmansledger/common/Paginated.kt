package org.eu.nl.craftsmansledger.common

import kotlinx.serialization.Serializable

@Serializable
data class Paginated<T>(
    val count: Int,
    val page: Int,
    val lastPage: Int,
    val data: List<T>,
)

enum class SortOrder(val value: String) {
    ASC("asc"),
    DESC("desc")
}
