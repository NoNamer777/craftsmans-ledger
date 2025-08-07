package org.eu.nl.craftsmansledger.recipes

import io.ktor.http.HttpStatusCode
import org.eu.nl.craftsmansledger.core.HttpException
import org.eu.nl.craftsmansledger.items.itemsService
import org.eu.nl.craftsmansledger.technologyTrees.technologyTreesService

class RecipesService {
    fun getAll(): List<Recipe> {
        val recipes = recipesRepository.findAll()
        return recipes.toList()
    }

    fun getAllInputsOfRecipe(recipeId: String) = recipeInputsRepository.findAllByRecipe(recipeId)

    fun getById(recipeId: String) = recipesRepository.findOneById(recipeId)

    fun getInputOfRecipe(recipeId: String, itemId: String): RecipeItem? {
        if (recipesRepository.findOneById(recipeId) == null) {
            throw HttpException(
                "Could not get input of Recipe with ID \"$recipeId\" - Reason: Recipe was not found",
                HttpStatusCode.NotFound
            )
        }
        if (itemsService.getById(itemId) == null) {
            throw HttpException(
                "Could not get input of Recipe with ID \"$recipeId\" - Reason: Item with ID \"$itemId\" was not found",
                HttpStatusCode.NotFound
            )
        }
        return recipeInputsRepository.findOneByRecipeAndItem(recipeId, itemId)
    }

    fun create(dto: CreateRecipeDto): Recipe {
        val technologyTree = technologyTreesService.getById(dto.technologyTreeId)

        if (technologyTree == null) {
            throw HttpException(
                "Could not create Recipe. - Reason: Technology tree with ID \"${dto.technologyTreeId}\" was not found",
                HttpStatusCode.NotFound
            )
        }
        val data = CreateRecipeData(dto.craftingTime, technologyTree, dto.technologyPoints)

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

    fun addRecipeInput(recipeId: String, dto: RecipeItemDto): RecipeItem {
        val recipe = this.getById(recipeId) ?: throw HttpException(
            "Could not add input to Recipe with ID \"${recipeId}\" - Reason: Recipe was not found",
            HttpStatusCode.NotFound
        )
        val item = itemsService.getById(dto.itemId) ?: throw HttpException(
            "Could not add input to Recipe with ID \"${recipeId}\" - Reason: Item with ID \"${dto.itemId}\" was not found",
            HttpStatusCode.NotFound
        )

        val input = RecipeItem(item, dto.quantity)

        if (recipe.hasInputWithItem(dto.itemId)) {
            throw HttpException(
                "Could not add input to Recipe with ID \"${recipeId}\" - Reason: Another input already has Item with ID \"${dto.itemId}\"",
                HttpStatusCode.BadRequest
            )
        }
        if (!isRecipeItemQuantityValid(input.quantity)) {
            throw HttpException(
                "Could not add input to Recipe with ID \"${recipeId}\" - Reason: Quantity must be a valid positive whole number.",
                HttpStatusCode.BadRequest
            )
        }
        return recipeInputsRepository.create(recipeId, input)
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
        val data = Recipe(dto.id, dto.craftingTime, technologyTree, dto.technologyPoints)

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

    fun updateInput(recipeId: String, dto: RecipeItemDto): RecipeItem {
        val recipe = this.getById(recipeId) ?: throw HttpException(
            "Could not update input with itemID \"${dto.itemId}\" of Recipe with ID \"$recipeId\" - Reason: Recipe was not found",
            HttpStatusCode.NotFound
        )

        val item = itemsService.getById(dto.itemId) ?: throw HttpException(
            "Could not update input with itemID \"${dto.itemId}\" of Recipe with ID \"$recipeId\" - Reason: Item with ID \"${dto.itemId}\" was not found",
            HttpStatusCode.NotFound
        )

        val input = RecipeItem(item, dto.quantity)

        if (!recipe.hasInputWithItem(dto.itemId)) {
            throw HttpException(
                "Could not update input with itemID \"${dto.itemId}\" of Recipe with ID \"$recipeId\" - Reason: Recipe does not have any inputs with the same Item.",
                HttpStatusCode.BadRequest
            )
        }
        if (!isRecipeItemQuantityValid(input.quantity)) {
            throw HttpException(
                "Could not update input with itemID \"${dto.itemId}\" of Recipe with ID \"$recipeId\" - Reason: Quantity must be a valid positive whole number",
                HttpStatusCode.BadRequest
            )
        }
        return recipeInputsRepository.update(recipeId, input)
    }

    fun remove(recipeId: String) {
        val byID = this.getById(recipeId)

        if (byID == null) {
            throw HttpException(
                "Could not remove Recipe with ID \"$recipeId\". - Reason: Recipe was not found",
                HttpStatusCode.NotFound
            )
        }
        recipesRepository.remove(recipeId)
    }

    fun removeInputFromRecipe(recipeId: String, itemId: String) {
        if (recipesRepository.findOneById(recipeId) == null) {
            throw HttpException(
                "Could not remove input from Recipe with ID \"$recipeId\" - Reason: Recipe was not found",
                HttpStatusCode.NotFound
            )
        }
        if (itemsService.getById(itemId) == null) {
            throw HttpException(
                "Could not remove input from Recipe with ID \"$recipeId\" - Reason: Item with ID \"$itemId\" was not found",
                HttpStatusCode.NotFound
            )
        }
        recipeInputsRepository.remove(recipeId, itemId)
    }

    private fun isCraftingTimeValid(craftingTime: Double) = craftingTime > 0.0

    private fun isTechnologyPoints(points: Int, max: Int) = points in 0..max

    private fun isRecipeItemQuantityValid(quantity: Int) = quantity >= 1
}

val recipesService = RecipesService()
