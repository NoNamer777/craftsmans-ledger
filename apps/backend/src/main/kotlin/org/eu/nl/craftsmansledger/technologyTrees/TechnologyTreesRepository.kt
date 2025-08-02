package org.eu.nl.craftsmansledger.technologyTrees

import io.viascom.nanoid.NanoId

class TechnologyTreesRepository {
    private var technologyTrees = mutableListOf<TechnologyTree>()

    fun findAll() = this.technologyTrees.toList()

    fun findOneById(technologyTreeId: String) = this.technologyTrees.find { it.id == technologyTreeId }

    fun findOneByName(name: String) = this.technologyTrees.find { it.name == name }

    fun create(data: CreateTechnologyTreeData): TechnologyTree {
        val technologyTree = TechnologyTree(NanoId.generate(), name = data.name, maxPoints = data.maxPoints)

        this.technologyTrees.add(technologyTree)
        return technologyTree
    }

    fun update(data: TechnologyTree): TechnologyTree {
        this.technologyTrees = this.technologyTrees.map { it -> if (it.id == data.id) data else it }.toMutableList()
        return data
    }

    fun remove(technologyTreeId: String) {
        this.technologyTrees = this.technologyTrees.filter { it.id == technologyTreeId }.toMutableList()
    }
}

val technologyTreesRepository = TechnologyTreesRepository()
