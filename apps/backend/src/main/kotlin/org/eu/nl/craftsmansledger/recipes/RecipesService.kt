package org.eu.nl.craftsmansledger.recipes

import io.ktor.http.HttpStatusCode
import org.eu.nl.craftsmansledger.core.HttpException
import org.eu.nl.craftsmansledger.technologyTrees.technologyTreesService

class RecipesService {
    fun getAll(): List<Recipe> {
        val recipes = recipesRepository.findAll()
        return recipes.toList()
    }

    fun getById(recipeId: String): Recipe? {
        val byId = recipesRepository.findOneById(recipeId)

        if (byId == null) return null
        return byId
    }

    fun create(dto: CreateRecipeDto): Recipe {
        val technologyTree = technologyTreesService.getById(dto.technologyTreeId)

        if (technologyTree == null) {
            throw HttpException(
                "Could not create Recipe. - Reason: Technology tree with ID \"${dto.technologyTreeId}\" was not found",
                HttpStatusCode.NotFound
            )
        }
        val data = CreateRecipeData(dto.outputQuantity, dto.craftingTime, technologyTree, dto.technologyPoints)

        if (!this.isOutputQuantityValid(data.outputQuantity)) {
            throw HttpException(
                "Could not create Recipe. - Reason: Output quantity should be a valid whole number higher than zero",
                HttpStatusCode.BadRequest
            )
        }
        if (!this.isCraftingTimeValid(data.craftingTime)) {
            throw HttpException(
                "Could not create Recipe. - Reason: Crafting time should be a valid number higher than zero",
                HttpStatusCode.BadRequest
            )
        }
        if (!this.isTechnologyPoints(data.technologyPoints, technologyTree.maxPoints)) {
            throw HttpException(
                "Could not create Recipe. - Reason: Technology points should be a valid whole number higher than or equal to zero but lower or equal to ${technologyTree.maxPoints}",
                HttpStatusCode.BadRequest
            )
        }
        return recipesRepository.create(data)
    }

    fun update(dto: UpdateRecipeDto): Recipe {
        val byId = this.getById(dto.id)

        if (byId == null) {
            throw HttpException(
                "Could not update Recipe with ID \"${dto.id}\". - Reason: Recipe was not found",
                HttpStatusCode.NotFound
            )
        }
        val technologyTree = technologyTreesService.getById(dto.technologyTreeId)

        if (technologyTree == null) {
            throw HttpException(
                "Could not update Recipe with ID \"${dto.id}\". - Reason: Technology tree with ID \"${dto.technologyTreeId}\" was not found",
                HttpStatusCode.NotFound
            )
        }
        val data = Recipe(dto.id, dto.outputQuantity, dto.craftingTime, technologyTree, dto.technologyPoints)

        if (!this.isOutputQuantityValid(data.outputQuantity)) {
            throw HttpException(
                "Could not update Recipe with ID \"${dto.id}\". - Reason: Output quantity should be a valid whole number higher than zero",
                HttpStatusCode.BadRequest
            )
        }
        if (!this.isCraftingTimeValid(data.craftingTime)) {
            throw HttpException(
                "Could not update Recipe with ID \"${dto.id}\". - Reason: Crafting time should be a valid number higher than zero",
                HttpStatusCode.BadRequest
            )
        }
        if (!this.isTechnologyPoints(data.technologyPoints, technologyTree.maxPoints)) {
            throw HttpException(
                "Could not update Recipe with ID \"${dto.id}\". - Reason: Technology points should be a valid whole number higher than or equal to zero but lower or equal to ${technologyTree.maxPoints}",
                HttpStatusCode.BadRequest
            )
        }
        return recipesRepository.update(data)
    }

    private fun isOutputQuantityValid(outputQuantity: Int) = outputQuantity > 0

    private fun isCraftingTimeValid(craftingTime: Double) = craftingTime > 0.0

    private fun isTechnologyPoints(points: Int, max: Int) = points >= 0 && points <= max
}

val recipesService = RecipesService()
