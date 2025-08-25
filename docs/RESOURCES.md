
# Resources

This document will describe the resources that the API back-end will make available for the client.

## Entity Relationship Diagram

```mermaid
---
title: ERD
---

erDiagram
    "Item" {
        string id           PK
        string name
        string weight
        string cost
    }
    
    "Technology_Tree" {
        string id       PK
        string name
        int max_points
    }
    
    "Recipe" {
        string id               PK
        double crafting_time
        int technology_points

        string technology_tree_id  FK
    }
    
    "Recipe_Resource" {
        string item_id      PK,FK
        string recipe_id    PK,FK
        int quantity
    }
    
    "Recipe_Output" {
        string item_id      PK,FK
        string recipe_id    PK,FK
        int quantity
    }
    
    "Recipe_Resource" o{--|| "Item" : "Required by"
    "Recipe_Resource" |{--|| "Recipe" : "Requires"
    "Recipe_Output" o{--|| "Item" : "Required by"
    "Recipe_Output" |{--|| "Recipe" : "Requires"
    "Recipe" ||--|{ "Technology_Tree" : "Requires"
```

## Managing RecipeItems

Recipes have the following JSON structure:

```json
{
    "id": "string",
    "craftingTime": 1.0,
    "technologyTree": {
        "id": "string",
        "name": "technology tree name",
        "maxPoints": 5000
    },
    "technologyPoints": 250,
    "inputs": [
        {
            "item": {
                "id": "string",
                "name": "item name",
                "weight": 1.0,
                "baseValue": 1.0
            },
            "quantity": 1
        }
    ],
    "outputs": [
        {
            "item": {
                "id": "string",
                "name": "item name",
                "weight": 1.0,
                "baseValue": 1.0
            },
            "quantity": 1
        }
    ]
}
```

As shown above Recipes have `inputs` and `outputs` which can have one or more RecipeItems. The following end-points are available to view and manage these relations:

```text
GET     /recipes/:recipeId/inputs           # To get all inputs of a particular Recipe
POST    /recipes/:recipeId/inputs           # To create a new Recipe input
GET     /recipes/:recipeId/inputs/:itemId   # To view a particular input of a particular Recipe
PUT     /recipes/:recipeId/inputs/:itemId   # To update a particular input of a particular Recipe
DELETE  /recipes/:recipeId/inputs/:itemId   # To remove a particular input from a particular Recipe
```

Note that this only shows the inputs of a Recipe. The outputs however are practically the same.

To create a new input for a Recipe the client will need to send the following data:

```json
{
    "itemId": "string",
    "quantity": 1
}
```

This same data format can be sent in the PUT request to update a particular input of a particular Recipe. Below you'll find sequence diagrams on how to create or remove an input from a Recipe.

```mermaid
---
title: Creating an input for a particular Recipe
---

sequenceDiagram
    actor User
    participant Client
    participant API as API Backend
    participant DB as Database
    
    User->>Client: Clicks "New input" button.
    Client->>User: Adds new input and select field for the RecipeItem input.
    User->>Client: Selects Item for newly added RecipeItem input.
    User->>Client: Inputs quantity for newly added RecipeItem input.
    User->>Client: Clicks "Save" button.
    Client->>API: Send POST to create Recipe `POST /recipes`.
    API->>API: Validate crafting time.
    API->>DB: Validate Technology Tree exists with provided ID.
    DB->>API: Returns existing Technology Tree.
    API->>API: Validate technology points with maximum of Technology Tree and minimum of zero.
    API->>DB: Store Recipe on database.
    DB->>API: Return created Recipe with generated ID.
    API->>Client: Returns updated Recipe.
    Client->>API: Send POST for the Recipe's input `POST /recipes/:recipeId/inputs`.
    API->>DB: Validate that Recipe with `recipeId` exists.
    DB->>API: Recipe with `recipeId` does exist.
    API->>API: Validate quantity is above zero
    API->>DB: Validate that Item with `itemId` exists
    DB->>API: Item with `itemId` does exist.
    API->>API: Validate that Recipe doesn't already have an input with the provide `itemId`.
    API->>DB: Store RecipeItem as input for Recipe with `recipeId` and with `itemId`.
    DB->>API: Return stored RecipeItem
    API->>Client: Return stored RecipeItem
    Client->>User: Notify User storing RecipeItem was successful
    
```

```mermaid
---
title: Removing an input from a particular Recipe
---

sequenceDiagram
    actor User
    participant Client
    participant API as API Backend
    participant DB as Database
    
    User->>Client: Clicks on the "Delete" button next to the RecipeItem.
    Client->>API: Requests RecipeItem to be removed from Recipe with ID.
    API->>API: Validate Recipe exists.
    API->>API: Validate Recipe has a input with itemId.
    API->>DB: Remove RecipeItem with itemId.
    DB->>API: RecipeItem Removed.
    API->>Client: RecipeItem Removed.
    Client->>User: Notify User that RecipeItem was removed successfully.
```
