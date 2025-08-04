
# Resources

This document will describe the resources that the API back-end will make available for the client.

```mermaid
---
title: ERD
---

erDiagram
    "Item" {
        string id           PK
        string name
        string weight
        string baseValue
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
