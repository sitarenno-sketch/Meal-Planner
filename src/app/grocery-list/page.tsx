"use client";

import { useMealPlan } from "@/store/usePlanStore";
import { useRecipes } from "@/store/useRecipeStore";
import { ShoppingCart, Printer, Check, Share2 } from "lucide-react";
import { useMemo } from "react";

type AggregatedIngredient = {
    name: string;
    amount: number;
    unit: string;
    recipes: string[];
};

export default function GroceryListPage() {
    const { plan } = useMealPlan();
    const { recipes } = useRecipes();

    const groceryList = useMemo(() => {
        const list: Record<string, AggregatedIngredient> = {};

        plan.forEach((entry) => {
            const recipe = recipes.find((r) => r.id === entry.recipeId);
            if (!recipe) return;

            recipe.ingredients.forEach((ing) => {
                const key = `${ing.name.toLowerCase()}-${ing.unit.toLowerCase()}`;

                if (!list[key]) {
                    list[key] = {
                        name: ing.name,
                        amount: 0,
                        unit: ing.unit,
                        recipes: [],
                    };
                }

                list[key].amount += ing.amount;
                if (!list[key].recipes.includes(recipe.name)) {
                    list[key].recipes.push(recipe.name);
                }
            });
        });

        return Object.values(list).sort((a, b) => a.name.localeCompare(b.name));
    }, [plan, recipes]);

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 mb-1 flex items-center gap-3">
                        Grocery List
                        <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                            {groceryList.length} items
                        </div>
                    </h1>
                    <p className="text-gray-500">Automatically generated from your meal plan.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl shadow-sm border border-gray-200 transition-colors"
                    >
                        <Share2 className="w-4 h-4" />
                        Export
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-xl shadow-lg shadow-gray-200 transition-colors print:hidden"
                    >
                        <Printer className="w-4 h-4" />
                        Print List
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
                {/* Main List */}
                <div className="space-y-6">
                    {groceryList.length === 0 ? (
                        <div className="text-center py-20 glass-card rounded-3xl border-dashed border-2 border-white/40">
                            <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-300 shadow-inner">
                                <ShoppingCart className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-700">Your basket is empty</h3>
                            <p className="text-gray-400 mt-2">Plan some meals to see ingredients here.</p>
                        </div>
                    ) : (
                        <div className="glass-card rounded-3xl overflow-hidden p-6 shadow-xl">
                            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                Produce & Pantry
                            </h2>
                            <div className="space-y-2">
                                {groceryList.map((item, index) => (
                                    <div key={index} className="group flex items-center gap-4 p-4 hover:bg-white/50 rounded-2xl transition-all cursor-pointer select-none">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                className="peer w-6 h-6 rounded-lg border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer appearance-none"
                                            />
                                            <Check className="absolute top-1 left-1 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                                        </div>

                                        <div className="flex-1">
                                            <span className="font-semibold text-gray-700 text-lg peer-checked:line-through peer-checked:text-gray-400 transition-colors">
                                                {item.name}
                                            </span>
                                        </div>

                                        <div className="text-right">
                                            <span className="text-lg font-bold text-blue-500">{item.amount}</span>
                                            <span className="text-sm font-medium text-gray-400 ml-1">{item.unit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Summary (Optional) */}
                <div className="space-y-6">
                    <div className="glass-card rounded-3xl p-6">
                        <h3 className="font-bold text-gray-700 mb-4">Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Total Items</span>
                                <span className="font-bold text-gray-800">{groceryList.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Est. Cost</span>
                                <span className="font-bold text-gray-800">-</span>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-xs text-center text-gray-400">
                                Based on your meal plan for this week.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
