package org.eu.nl.craftsmansledger.model

import io.netty.util.internal.ResourcesUtil

class FakeItemRepository : ItemRepository {
    private val items = readCsv()

    fun readCsv(): MutableList<Item> {
        return this.javaClass.classLoader.getResourceAsStream("Medieval_Dynasty_Items.csv").reader().readLines()
            .filter { it.isNotBlank() }
            .map {
                val (name, weight, baseValue) = it.split(',', ignoreCase = false, limit = 3)
                Item(name = name, weight = weight.trim().toDouble(), baseValue = baseValue.trim().toDouble())
            }.toMutableList()
    }

    override fun allItems(): List<Item> = items

    override fun itemByName(name: String) = items.find {
        it.name.equals(name, ignoreCase = true)
    }

    override fun addItem(item: Item) {
        if (itemByName(item.name) != null) throw IllegalArgumentException("Item already exists")
    }

    override fun removeItem(name: String): Boolean = items.removeIf { it.name == name }
}