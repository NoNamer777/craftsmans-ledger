export const selectedRecipeItemAttributes = {
    select: {
        quantity: true,
        item: {
            select: {
                id: true,
                name: true,
                cost: true,
                weight: true,
            },
        },
    },
} as const;

export const selectedRecipeAttributes = {
    select: {
        id: true,
        craftingTime: true,
        techPoints: true,
        technologyTree: {
            select: {
                id: true,
                name: true,
                maxPoints: true,
            },
        },
        inputs: {
            ...selectedRecipeItemAttributes,
        },
        outputs: {
            ...selectedRecipeItemAttributes,
        },
    },
} as const;
