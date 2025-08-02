package org.eu.nl.craftsmansledger.model

interface ItemRepository {
    fun allItems(): List<Item>
    fun itemByName(name: String): Item?
    fun addItem(item: Item)
    fun removeItem(name: String): Boolean
}
