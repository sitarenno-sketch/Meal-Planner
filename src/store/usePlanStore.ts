import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Recipe } from './useRecipeStore';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export type PlayEntry = {
    id: string; // Unique ID for the instance on the board (allows same recipe multiple times)
    recipeId: string;
    date: string; // "Monday", "Tuesday" etc for simplicity, or ISO date
    mealType: MealType;
};

type PlanState = {
    plan: PlayEntry[];
    addToPlan: (entry: PlayEntry) => void;
    removeFromPlan: (id: string) => void;
    moveInPlan: (id: string, newDate: string, newMealType: MealType) => void;
};

export const usePlanStore = create<PlanState>()(
    persist(
        (set) => ({
            plan: [],
            addToPlan: (entry) =>
                set((state) => ({
                    plan: [...state.plan, entry],
                })),
            removeFromPlan: (id) =>
                set((state) => ({
                    plan: state.plan.filter((entry) => entry.id !== id),
                })),
            moveInPlan: (id, newDate, newMealType) =>
                set((state) => ({
                    plan: state.plan.map((entry) =>
                        entry.id === id
                            ? { ...entry, date: newDate, mealType: newMealType }
                            : entry
                    ),
                })),
        }),
        {
            name: 'plan-storage',
        }
    )
);
