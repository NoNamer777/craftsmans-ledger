package org.eu.nl.craftsmansledger.items

import io.ktor.http.HttpStatusCode
import org.eu.nl.craftsmansledger.core.HttpException

class ItemsService {
    fun getAll() = itemsRepository.findAll()

    fun query(nameQuery: String) = itemsRepository.findAllByName(nameQuery)

    fun getById(itemId: String) = itemsRepository.findOneById(itemId)

    fun create(data: CreateItemData): Item {
        if (this.isNameTaken(data.name)) {
            throw HttpException(
                "Could not create Item. - Reason: Name \"${data.name}\" is not available",
                HttpStatusCode.BadRequest
            )
        }
        if (!this.isWeightValid(data.weight)) {
            throw HttpException(
                "Could not create Item. - Reason: Weight must be higher than or equal to zero",
                HttpStatusCode.BadRequest
            )
        }
        if (!this.isBaseValueValid(data.baseValue)) {
            throw HttpException(
                "Could not create Item. - Reason: BaseValue must be higher than or equal to zero",
                HttpStatusCode.BadRequest
            )

        }
        return itemsRepository.create(data)
    }

    fun update(data: Item): Item {
        val byId = this.getById(data.id)

        if (byId == null) {
            throw HttpException(
                "Could not Update Item with ID \"${data.id}\". - Reason: Item was not found",
                HttpStatusCode.NotFound
            )
        }
        if (this.isNameTaken(data.name, data.id)) {
            throw HttpException(
                "Could not Update Item with ID \"${data.id}\". - Reason: Name \"${data.name}\" is not available",
                HttpStatusCode.BadRequest
            )
        }
        if (!this.isWeightValid(data.weight)) {
            throw HttpException(
                "Could not Update Item with ID \"${data.id}\". - Reason: Weight must be higher than or equal to zero",
                HttpStatusCode.BadRequest
            )
        }
        if (!this.isBaseValueValid(data.baseValue)) {
            throw HttpException(
                "Could not Update Item with ID \"${data.id}\". - Reason: BaseValue must be higher than or equal to zero",
                HttpStatusCode.BadRequest
            )
        }
        return itemsRepository.update(data)
    }

    fun remove(itemId: String) {
        val byId = this.getById(itemId)

        if (byId == null) {
            throw HttpException(
                "Could not Remove Item with ID \"$itemId\". - Reason: Item was not found",
                HttpStatusCode.NotFound
            )
        }
        itemsRepository.remove(itemId)
    }

    private fun isNameTaken(itemName: String, itemId: String? = null): Boolean {
        val byName = itemsRepository.findOneByName(itemName)
        return byName != null && (itemId == null || itemId != byName.id)
    }

    private fun isWeightValid(weight: Double) = weight >= 0.0

    private fun isBaseValueValid(baseValue: Double) = baseValue >= 0.0
}

val itemsService = ItemsService()
