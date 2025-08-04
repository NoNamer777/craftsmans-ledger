package org.eu.nl.craftsmansledger.technologyTrees

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.charLength

object TechnologyTreeTable: Table("technology_trees") {
    val id = varchar("id", 32)
    val name = varchar("name", 128).uniqueIndex("uq_technology_tree_name").check { it.charLength().greaterEq(2) }
    val maxPoints = integer("max_points").check { it.greaterEq(0) }

    override val primaryKey = PrimaryKey(id, name = "pk_technology_tree")
}
