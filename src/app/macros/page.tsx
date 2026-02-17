"use client";

import { usePlanStore } from "@/store/usePlanStore";
import { useRecipeStore } from "@/store/useRecipeStore";
import { useMemo, useState } from "react";
import { Activity, Flame, Wheat, Beef, Droplets, ChevronLeft, ChevronRight } from "lucide-react";

export default function MacrosPage() {
    const { plan } = usePlanStore();
    const { recipes } = useRecipeStore();

    // Simple state to toggle between daily views or show a weekly summary? 
    // For now, let's show all planned days sorted by date/day
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [selectedDay, setSelectedDay] = useState("Monday");

    const dailyMacros = useMemo(() => {
        const dayPlan = plan.filter(p => p.date === selectedDay);

        let protein = 0;
        let carbs = 0;
        let fats = 0;
        let calories = 0;

        dayPlan.forEach(entry => {
            const recipe = recipes.find(r => r.id === entry.recipeId);
            if (recipe && recipe.macros) {
                protein += recipe.macros.protein || 0;
                carbs += recipe.macros.carbs || 0;
                fats += recipe.macros.fats || 0;
                calories += recipe.calories || 0; // Using base calories if available, or we could estimate
            } else if (recipe && recipe.calories) {
                calories += recipe.calories;
            }
        });

        return { protein, carbs, fats, calories };
    }, [plan, recipes, selectedDay]);

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-black text-gray-800 mb-2 flex items-center gap-3">
                    <Activity className="w-8 h-8 text-blue-500" />
                    Macro Dashboard
                </h1>
                <p className="text-gray-500">Track your nutrition goals.</p>
            </div>

            {/* Day Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4">
                {DAYS.map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-5 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${selectedDay === day
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-200'
                                : 'bg-white text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Calories Card */}
                <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50" />
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                                <Flame className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-400 uppercase tracking-wider text-xs">Calories</h3>
                        </div>
                        <div className="text-4xl font-black text-gray-800 mb-1">
                            {dailyMacros.calories}
                            <span className="text-base font-medium text-gray-400 ml-1">kcal</span>
                        </div>
                    </div>
                </div>

                {/* Protein Card */}
                <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50" />
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                <Beef className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-400 uppercase tracking-wider text-xs">Protein</h3>
                        </div>
                        <div className="text-4xl font-black text-gray-800 mb-1">
                            {dailyMacros.protein}
                            <span className="text-base font-medium text-gray-400 ml-1">g</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min((dailyMacros.protein / 150) * 100, 100)}%` }} />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Target: 150g (Demo)</p>
                    </div>
                </div>

                {/* Carbs Card */}
                <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50" />
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                                <Wheat className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-400 uppercase tracking-wider text-xs">Carbs</h3>
                        </div>
                        <div className="text-4xl font-black text-gray-800 mb-1">
                            {dailyMacros.carbs}
                            <span className="text-base font-medium text-gray-400 ml-1">g</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
                            <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min((dailyMacros.carbs / 250) * 100, 100)}%` }} />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Target: 250g (Demo)</p>
                    </div>
                </div>

                {/* Fats Card */}
                <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full blur-3xl -mr-10 -mt-10 opacity-50" />
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-500 flex items-center justify-center">
                                <Droplets className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-400 uppercase tracking-wider text-xs">Fats</h3>
                        </div>
                        <div className="text-4xl font-black text-gray-800 mb-1">
                            {dailyMacros.fats}
                            <span className="text-base font-medium text-gray-400 ml-1">g</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
                            <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${Math.min((dailyMacros.fats / 70) * 100, 100)}%` }} />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Target: 70g (Demo)</p>
                    </div>
                </div>
            </div>

            {/* Meal Breakdown Table? Optional - keeping it simple for now as per dashboard request */}
            <div className="glass-card rounded-3xl p-6 mt-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Meals for {selectedDay}</h2>
                {plan.filter(p => p.date === selectedDay).length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        No nutrition data. Plan some meals for this day!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {plan.filter(p => p.date === selectedDay).map(entry => {
                            const recipe = recipes.find(r => r.id === entry.recipeId);
                            if (!recipe) return null;
                            return (
                                <div key={entry.id} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl hover:bg-white transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 w-20">
                                            {entry.mealType}
                                        </div>
                                        <div className="font-bold text-gray-700">{recipe.name}</div>
                                    </div>
                                    <div className="flex gap-6 text-sm font-medium text-gray-500">
                                        <span>{recipe.macros?.protein || 0}p</span>
                                        <span>{recipe.macros?.carbs || 0}c</span>
                                        <span>{recipe.macros?.fats || 0}f</span>
                                        <span className="text-gray-800 font-bold">{recipe.calories} kcal</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
