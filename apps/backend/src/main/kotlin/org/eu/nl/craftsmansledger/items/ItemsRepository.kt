package org.eu.nl.craftsmansledger.items

import io.viascom.nanoid.NanoId

class ItemsRepository {
    private var items = mutableListOf<Item>()

    fun findAll() = this.items.toList()

    fun findAllByName(name: String) = this.items.filter { it.name.contains(name) }

    fun findOneById(itemId: String) = this.items.find { it.id == itemId }

    fun findOneByName(name: String) = this.items.find { it.name == name }

    fun create(data: CreateItemData): Item {
        val item = Item(NanoId.generate(), data.name, data.weight, data.baseValue)

        this.items.add(item)
        return item
    }

    fun update(data: Item): Item {
        this.items = this.items.map { item -> if (item.id == data.id) data else item }.toMutableList()

        return data
    }

    fun remove(itemId: String) {
        this.items = this.items.filter { item -> item.id != itemId }.toMutableList()
    }
}

val itemsRepository = ItemsRepository()
