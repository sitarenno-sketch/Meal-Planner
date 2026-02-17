"use client";

import { create } from 'zustand';
import { useSupabaseClient } from '@/lib/supabase';
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export type PlayEntry = {
    id: string;
    recipeId: string;
    date: string;
    mealType: MealType;
};

type PlanState = {
    plan: PlayEntry[];
    loading: boolean;
    setPlan: (plan: PlayEntry[]) => void;
    addToPlan: (entry: PlayEntry) => Promise<void>;
    removeFromPlan: (id: string) => Promise<void>;
    moveInPlan: (id: string, newDate: string, newMealType: MealType) => Promise<void>;
    fetchPlan: () => Promise<void>;
};

export const usePlanStore = create<PlanState>()((set, get) => ({
    plan: [],
    loading: false,
    setPlan: (plan) => set({ plan }),

    addToPlan: async (entry) => {
        set((state) => ({
            plan: [...state.plan, entry],
        }));
    },

    removeFromPlan: async (id) => {
        set((state) => ({
            plan: state.plan.filter((entry) => entry.id !== id),
        }));
    },

    moveInPlan: async (id, newDate, newMealType) => {
        set((state) => ({
            plan: state.plan.map((entry) =>
                entry.id === id
                    ? { ...entry, date: newDate, mealType: newMealType }
                    : entry
            ),
        }));
    },

    fetchPlan: async () => {
        set({ loading: true });
        set({ loading: false });
    },
}));

// Custom hook to sync meal plan with Supabase
export function useMealPlan() {
    const { userId } = useAuth();
    const supabase = useSupabaseClient();
    const { plan, setPlan, loading } = usePlanStore();

    useEffect(() => {
        if (userId) {
            fetchPlan();
        }
    }, [userId]);

    const fetchPlan = async () => {
        if (!userId) return;

        const { data, error } = await supabase
            .from('meal_plans')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching meal plan:', error);
            return;
        }

        const formattedPlan: PlayEntry[] = data.map((entry: any) => ({
            id: entry.id,
            recipeId: entry.recipe_id,
            date: entry.date,
            mealType: entry.meal_type,
        }));

        setPlan(formattedPlan);
    };

    const addToPlan = async (entry: PlayEntry) => {
        if (!userId) return;

        const { data, error } = await supabase
            .from('meal_plans')
            .insert({
                id: entry.id,
                user_id: userId,
                recipe_id: entry.recipeId,
                date: entry.date,
                meal_type: entry.mealType,
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding to plan:', error);
            return;
        }

        await fetchPlan();
    };

    const removeFromPlan = async (id: string) => {
        if (!userId) return;

        const { error } = await supabase
            .from('meal_plans')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            console.error('Error removing from plan:', error);
            return;
        }

        await fetchPlan();
    };

    const moveInPlan = async (id: string, newDate: string, newMealType: MealType) => {
        if (!userId) return;

        const { error } = await supabase
            .from('meal_plans')
            .update({
                date: newDate,
                meal_type: newMealType,
            })
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            console.error('Error moving in plan:', error);
            return;
        }

        await fetchPlan();
    };

    return {
        plan,
        loading,
        addToPlan,
        removeFromPlan,
        moveInPlan,
        refreshPlan: fetchPlan,
    };
}
