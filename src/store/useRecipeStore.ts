"use client";

import { create } from 'zustand';
import { useSupabaseClient } from '@/lib/supabase';
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

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
    image?: string;
    calories?: number;
    tags?: string[];
    instructions?: string[];
    description?: string;
    prepTime?: string;
    servings?: number;
};

type RecipeState = {
    recipes: Recipe[];
    loading: boolean;
    setRecipes: (recipes: Recipe[]) => void;
    addRecipe: (recipe: Omit<Recipe, 'id'>) => Promise<void>;
    updateRecipe: (id: string, recipe: Partial<Recipe>) => Promise<void>;
    deleteRecipe: (id: string) => Promise<void>;
    fetchRecipes: () => Promise<void>;
};

export const useRecipeStore = create<RecipeState>()((set, get) => ({
    recipes: [],
    loading: false,
    setRecipes: (recipes) => set({ recipes }),

    addRecipe: async (recipe) => {
        // This will be called from components with supabase client
        set((state) => ({
            recipes: [...state.recipes, { ...recipe, id: crypto.randomUUID() }],
        }));
    },

    updateRecipe: async (id, updatedRecipe) => {
        set((state) => ({
            recipes: state.recipes.map((recipe) =>
                recipe.id === id ? { ...recipe, ...updatedRecipe } : recipe
            ),
        }));
    },

    deleteRecipe: async (id) => {
        set((state) => ({
            recipes: state.recipes.filter((recipe) => recipe.id !== id),
        }));
    },

    fetchRecipes: async () => {
        set({ loading: true });
        // This will be called from components with supabase client
        set({ loading: false });
    },
}));

// Custom hook to sync recipes with Supabase
export function useRecipes() {
    const { userId } = useAuth();
    const supabase = useSupabaseClient();
    const { recipes, setRecipes, loading, addRecipe: addRecipeLocal, updateRecipe: updateRecipeLocal, deleteRecipe: deleteRecipeLocal } = useRecipeStore();

    useEffect(() => {
        if (userId) {
            fetchRecipes();
        }
    }, [userId]);

    const fetchRecipes = async () => {
        if (!userId) return;

        const { data: recipesData, error } = await supabase
            .from('recipes')
            .select('*, ingredients(*)')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching recipes:', error);
            return;
        }

        const formattedRecipes: Recipe[] = recipesData.map((recipe: any) => ({
            id: recipe.id,
            name: recipe.name,
            description: recipe.description,
            image: recipe.image,
            calories: recipe.calories,
            prepTime: recipe.prep_time,
            servings: recipe.servings,
            instructions: recipe.instructions,
            tags: recipe.tags,
            color: recipe.color,
            ingredients: recipe.ingredients.map((ing: any) => ({
                id: ing.id,
                name: ing.name,
                amount: ing.amount,
                unit: ing.unit,
            })),
        }));

        setRecipes(formattedRecipes);
    };

    const addRecipe = async (recipe: Omit<Recipe, 'id'>) => {
        if (!userId) return;

        const { data: recipeData, error: recipeError } = await supabase
            .from('recipes')
            .insert({
                user_id: userId,
                name: recipe.name,
                description: recipe.description,
                image: recipe.image,
                calories: recipe.calories,
                prep_time: recipe.prepTime,
                servings: recipe.servings,
                instructions: recipe.instructions,
                tags: recipe.tags,
                color: recipe.color,
            })
            .select()
            .single();

        if (recipeError) {
            console.error('Error adding recipe:', recipeError);
            return;
        }

        // Add ingredients
        if (recipe.ingredients.length > 0) {
            const ingredientsToInsert = recipe.ingredients.map((ing) => ({
                recipe_id: recipeData.id,
                name: ing.name,
                amount: ing.amount,
                unit: ing.unit,
            }));

            const { error: ingredientsError } = await supabase
                .from('ingredients')
                .insert(ingredientsToInsert);

            if (ingredientsError) {
                console.error('Error adding ingredients:', ingredientsError);
            }
        }

        await fetchRecipes();
    };

    const updateRecipe = async (id: string, updatedRecipe: Partial<Recipe>) => {
        if (!userId) return;

        const updateData: any = {};
        if (updatedRecipe.name !== undefined) updateData.name = updatedRecipe.name;
        if (updatedRecipe.description !== undefined) updateData.description = updatedRecipe.description;
        if (updatedRecipe.image !== undefined) updateData.image = updatedRecipe.image;
        if (updatedRecipe.calories !== undefined) updateData.calories = updatedRecipe.calories;
        if (updatedRecipe.prepTime !== undefined) updateData.prep_time = updatedRecipe.prepTime;
        if (updatedRecipe.servings !== undefined) updateData.servings = updatedRecipe.servings;
        if (updatedRecipe.instructions !== undefined) updateData.instructions = updatedRecipe.instructions;
        if (updatedRecipe.tags !== undefined) updateData.tags = updatedRecipe.tags;
        if (updatedRecipe.color !== undefined) updateData.color = updatedRecipe.color;

        const { error: recipeError } = await supabase
            .from('recipes')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', userId);

        if (recipeError) {
            console.error('Error updating recipe:', recipeError);
            return;
        }

        // Update ingredients if provided
        if (updatedRecipe.ingredients) {
            // Delete existing ingredients
            await supabase
                .from('ingredients')
                .delete()
                .eq('recipe_id', id);

            // Insert new ingredients
            if (updatedRecipe.ingredients.length > 0) {
                const ingredientsToInsert = updatedRecipe.ingredients.map((ing) => ({
                    recipe_id: id,
                    name: ing.name,
                    amount: ing.amount,
                    unit: ing.unit,
                }));

                await supabase
                    .from('ingredients')
                    .insert(ingredientsToInsert);
            }
        }

        await fetchRecipes();
    };

    const deleteRecipe = async (id: string) => {
        if (!userId) return;

        const { error } = await supabase
            .from('recipes')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            console.error('Error deleting recipe:', error);
            return;
        }

        await fetchRecipes();
    };

    return {
        recipes,
        loading,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        refreshRecipes: fetchRecipes,
    };
}
