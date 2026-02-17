import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type Ingredient = {
    id: string;
    name: string;
    amount: number;
    unit: string;
};

export type Recipe = {
    id: string;
    name: string;
    ingredients: Ingredient[];
    color?: string;
    // New fields for Bloom redesign
    image?: string;
    calories?: number;
    tags?: string[];
    instructions?: string[];
    description?: string;
    prepTime?: string;
    servings?: number;
    macros?: {
        protein: number;
        carbs: number;
        fats: number;
    };
};

type RecipeState = {
    recipes: Recipe[];
    addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
    updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
    deleteRecipe: (id: string) => void;
};

export const useRecipeStore = create<RecipeState>()(
    persist(
        (set) => ({
            recipes: [],
            addRecipe: (recipe) =>
                set((state) => ({
                    recipes: [...state.recipes, { ...recipe, id: uuidv4() }],
                })),
            updateRecipe: (id, updatedRecipe) =>
                set((state) => ({
                    recipes: state.recipes.map((recipe) =>
                        recipe.id === id ? { ...recipe, ...updatedRecipe } : recipe
                    ),
                })),
            deleteRecipe: (id) =>
                set((state) => ({
                    recipes: state.recipes.filter((recipe) => recipe.id !== id),
                })),
        }),
        {
            name: 'recipe-storage',
        }
    )
);
