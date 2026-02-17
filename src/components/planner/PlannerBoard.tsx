"use client";

import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    DragStartEvent,
    DragEndEvent,
    useDraggable
} from '@dnd-kit/core';
import { useRecipeStore, Recipe } from '@/store/useRecipeStore';
import { usePlanStore, PlayEntry, MealType } from '@/store/usePlanStore';
import DraggableRecipe from './DraggableRecipe';
import DroppableSlot from './DroppableSlot';
import { Trash2, GripVertical } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS: MealType[] = ['breakfast', 'lunch', 'dinner'];

const PlannerBoard = () => {
    const { recipes } = useRecipeStore();
    const { plan, addToPlan, moveInPlan, removeFromPlan } = usePlanStore();
    const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

    // Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const recipe = active.data.current?.recipe as Recipe;
        setActiveRecipe(recipe);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveRecipe(null);
            return;
        }

        const recipe = active.data.current?.recipe as Recipe;
        // Check if we dropped on a slot
        const slotData = over.data.current as { date: string; mealType: MealType } | undefined;

        if (slotData) {
            // New entry or Move
            if (!plan.find(p => p.id === active.id)) {
                // New
                addToPlan({
                    id: uuidv4(),
                    recipeId: recipe.id,
                    date: slotData.date,
                    mealType: slotData.mealType
                });
            } else {
                // Moving
                moveInPlan(active.id as string, slotData.date, slotData.mealType);
            }
        } else if (over.id === 'trash') {
            // Remove from plan
            if (plan.find(p => p.id === active.id)) {
                removeFromPlan(active.id as string);
            }
        }

        setActiveRecipe(null);
    };

    const getPlanForSlot = (date: string, mealType: MealType) => {
        return plan.filter(p => p.date === date && p.mealType === mealType);
    };

    const getRecipeById = (id: string) => recipes.find(r => r.id === id);

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-[calc(100vh-8rem)] gap-8">
                {/* Recipes Sidebar */}
                <div className="w-72 flex flex-col glass-card rounded-3xl overflow-hidden shrink-0">
                    <div className="p-6 border-b border-gray-100/50">
                        <h2 className="text-lg font-bold text-gray-800">Recipes</h2>
                        <p className="text-xs text-gray-400">Drag to your calendar</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {recipes.length === 0 ? (
                            <div className="text-center p-4 text-sm text-gray-400">
                                No recipes found. Create some first!
                            </div>
                        ) : (
                            recipes.map(recipe => (
                                <DraggableRecipe key={recipe.id} recipe={recipe} />
                            ))
                        )}
                    </div>

                    {/* Trash Drop Zone */}
                    <div className="p-4 border-t border-gray-100/50">
                        <DroppableSlot id="trash" data={{ date: 'trash', mealType: 'trash' as any }}>
                            <div className="flex items-center justify-center gap-2 text-red-300 hover:text-red-500 py-3 transition-colors">
                                <Trash2 className="w-5 h-5" />
                                <span className="text-sm font-medium">Drag here to remove</span>
                            </div>
                        </DroppableSlot>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 overflow-x-auto pb-4">
                    <div className="grid grid-cols-7 gap-4 min-w-[1200px]">
                        {DAYS.map(day => (
                            <div key={day} className="flex flex-col gap-3">
                                <div className="text-center p-3 glass-card rounded-2xl mb-2">
                                    <span className="text-sm font-bold text-gray-600 uppercase tracking-widest">{day}</span>
                                </div>
                                <div className="space-y-4">
                                    {MEALS.map(meal => (
                                        <div key={`${day}-${meal}`} className="space-y-1">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-2 mb-1">
                                                {meal}
                                            </div>
                                            <DroppableSlot
                                                id={`${day}-${meal}`}
                                                data={{ date: day, mealType: meal }}
                                            >
                                                {getPlanForSlot(day, meal).map(entry => {
                                                    const recipe = getRecipeById(entry.recipeId);
                                                    if (!recipe) return null;
                                                    return (
                                                        <DraggablePlanItem key={entry.id} entry={entry} recipe={recipe} />
                                                    );
                                                })}
                                            </DroppableSlot>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <DragOverlay>
                {activeRecipe ? (
                    <DraggableRecipe recipe={activeRecipe} isOverlay />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

// Internal component for items already on the board
const DraggablePlanItem = ({ entry, recipe }: { entry: PlayEntry, recipe: Recipe }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: entry.id, // Use the Plan Entry ID!
        data: { recipe }, // Pass recipe data
    });

    if (isDragging) {
        return (
            <div ref={setNodeRef} className="opacity-0 p-2" />
        )
    }

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 cursor-grab touch-none group relative overflow-hidden"
        >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-400" />
            <div className="pl-2">
                <div className="font-bold text-gray-700 text-sm truncate leading-tight">{recipe.name}</div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                    <GripVertical className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{recipe.calories ? `${recipe.calories} kcal` : 'No calories'}</span>
                </div>
            </div>
        </div>
    );
}

export default PlannerBoard;
