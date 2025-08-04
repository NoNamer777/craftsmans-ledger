package org.eu.nl.craftsmansledger.items

import io.viascom.nanoid.NanoId
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.statements.InsertStatement
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update

fun ResultRow.toItem() = Item(
    this[ItemTable.id],
    this[ItemTable.name],
    this[ItemTable.weight],
    this[ItemTable.baseValue],
)

fun InsertStatement<Number>.toItem() = Item(
    this[ItemTable.id],
    this[ItemTable.name],
    this[ItemTable.weight],
    this[ItemTable.baseValue],
)

class ItemsRepository {
    fun findAll() = transaction { ItemTable.selectAll().map { it.toItem() }.toList() }

    fun findAllByName(name: String) = transaction {
        ItemTable.selectAll().where { ItemTable.name like name }.map { it.toItem() }.toList()
    }

    fun findOneById(itemId: String) = transaction {
        ItemTable.selectAll().where { ItemTable.id eq itemId }.map { it.toItem() }.singleOrNull()
    }

    fun findOneByName(name: String) = transaction {
        ItemTable.selectAll().where { ItemTable.name eq name }.map { it.toItem() }.singleOrNull()
    }

    fun create(data: CreateItemData) = transaction {
        ItemTable
            .insert {
                it[id] = NanoId.generate()
                it[name] = data.name
                it[weight] = data.weight
                it[baseValue] = data.baseValue
            }.toItem()
    }

    fun update(data: Item): Item {
        transaction {
            ItemTable.update({ ItemTable.id eq data.id }) {
                it[name] = data.name
                it[weight] = data.weight
                it[baseValue] = data.baseValue
            }
        }
        return this.findOneById(data.id)!!
    }

    fun remove(itemId: String) {
        transaction { ItemTable.deleteWhere { ItemTable.id eq itemId } }
    }
}

val itemsRepository = ItemsRepository()
