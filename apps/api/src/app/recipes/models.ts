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
    },
} as const;
