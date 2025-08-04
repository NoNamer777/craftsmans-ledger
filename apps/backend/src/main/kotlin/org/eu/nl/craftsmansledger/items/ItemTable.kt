package org.eu.nl.craftsmansledger.items

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.charLength

object ItemTable: Table("items") {
    val id = varchar("id", 32)
    val name = varchar("name", 128).uniqueIndex("uq_item_name").check { it.charLength().greaterEq(2) }
    val weight = double("weight").check { it.greaterEq(0.0) }
    val baseValue = double("base_value").check { it.greaterEq(0.0) }

    override val primaryKey = PrimaryKey(id, name = "pk_item")
}
