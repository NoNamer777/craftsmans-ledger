package org.eu.nl.craftsmansledger.technologyTrees

import io.viascom.nanoid.NanoId
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.statements.InsertStatement
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update

fun ResultRow.toTechnologyTree() = TechnologyTree(
    this[TechnologyTreeTable.id],
    this[TechnologyTreeTable.name],
    this[TechnologyTreeTable.maxPoints],
)

fun InsertStatement<Number>.toTechnologyTree() = TechnologyTree(
    this[TechnologyTreeTable.id],
    this[TechnologyTreeTable.name],
    this[TechnologyTreeTable.maxPoints],
)

class TechnologyTreesRepository {
    fun findAll() = transaction {
        TechnologyTreeTable.selectAll().map { it.toTechnologyTree() }.toList().sortedBy { it.name }
    }

    fun findOneById(technologyTreeId: String) = transaction {
        TechnologyTreeTable
            .selectAll()
            .where { TechnologyTreeTable.id eq technologyTreeId }
            .map { it.toTechnologyTree() }
            .singleOrNull()
    }

    fun findOneByName(name: String) = transaction {
        TechnologyTreeTable
            .selectAll()
            .where { TechnologyTreeTable.name eq name }
            .map { it.toTechnologyTree() }
            .singleOrNull()
    }

    fun create(data: CreateTechnologyTreeData) = transaction {
        TechnologyTreeTable
            .insert {
                it[id] = NanoId.generate()
                it[name] = data.name
                it[maxPoints] = data.maxPoints
            }
            .toTechnologyTree()
    }

    fun update(data: TechnologyTree): TechnologyTree {
        transaction {
            TechnologyTreeTable.update({ TechnologyTreeTable.id eq data.id }) {
                it[name] = data.name
                it[maxPoints] = data.maxPoints
            }
        }
        return this.findOneById(data.id)!!
    }

    fun remove(technologyTreeId: String) {
        transaction { TechnologyTreeTable.deleteWhere { TechnologyTreeTable.id eq technologyTreeId } }
    }
}

val technologyTreesRepository = TechnologyTreesRepository()
