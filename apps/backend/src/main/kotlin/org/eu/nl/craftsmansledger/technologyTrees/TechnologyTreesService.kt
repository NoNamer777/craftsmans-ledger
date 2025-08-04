package org.eu.nl.craftsmansledger.technologyTrees

import io.ktor.http.HttpStatusCode
import org.eu.nl.craftsmansledger.core.HttpException

class TechnologyTreesService {
    fun getAll() = technologyTreesRepository.findAll()

    fun getById(technologyTreeId: String) = technologyTreesRepository.findOneById(technologyTreeId)

    fun create(data: CreateTechnologyTreeData): TechnologyTree {
        if (this.isNameTaken(data.name)) {
            throw HttpException(
                "Could not create Technology Tree. - Reason: Name \"${data.name}\" is not available",
                HttpStatusCode.BadRequest
            )
        }
        if (this.isMaxPointsValid(data.maxPoints)) {
            throw HttpException(
                "Could not create Technology Tree. - Reason: Maximum points must be higher than zero",
                HttpStatusCode.BadRequest
            )
        }
        return technologyTreesRepository.create(data)
    }

    fun update(data: TechnologyTree): TechnologyTree {
        val byId = this.getById(data.id)

        if (byId == null) {
            throw HttpException(
                "Could not update Technology Tree with ID \"${data.id}\". - Reason: Technology tree was not found",
                HttpStatusCode.NotFound
            )
        }
        if (this.isNameTaken(data.name)) {
            throw HttpException(
                "Could not update Technology Tree with ID \"${data.id}\". - Reason: Name \"${data.name}\" is not available",
                HttpStatusCode.BadRequest
            )
        }
        if (this.isMaxPointsValid(data.maxPoints)) {
            throw HttpException(
                "Could not update Technology Tree with ID \"${data.id}\". - Reason: Maximum points must be higher than zero",
                HttpStatusCode.BadRequest
            )
        }
        return technologyTreesRepository.update(data)
    }

    fun remove(technologyTreeId: String) {
        val byId = this.getById(technologyTreeId)

        if (byId == null) {
            throw HttpException(
                "Could not remove Technology Tree with ID \"$technologyTreeId\". - Reason: Technology tree was not found",
                HttpStatusCode.NotFound
            )
        }
        technologyTreesRepository.remove(technologyTreeId)
    }

    private fun getByName(name: String) = technologyTreesRepository.findOneByName(name)

    private fun isNameTaken(name: String, technologyTreeId: String? = null): Boolean {
        val byName = this.getByName(name)
        return byName != null && (technologyTreeId == null || technologyTreeId != byName.id)
    }

    private fun isMaxPointsValid(maxPoints: Int) = maxPoints > 0
}

val technologyTreesService = TechnologyTreesService()
