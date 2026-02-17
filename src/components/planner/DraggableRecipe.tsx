"use client";

import { useDraggable } from '@dnd-kit/core';
import { ChefHat, Maximize2 } from 'lucide-react';
import { Recipe } from '@/store/useRecipeStore';

type Props = {
    recipe: Recipe;
    isOverlay?: boolean;
};

const DraggableRecipe = ({ recipe, isOverlay }: Props) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: recipe.id,
        data: { recipe },
    });

    const style = isOverlay ? {
        cursor: 'grabbing',
        opacity: 0.9,
        transform: 'scale(1.05) rotate(3deg)',
        zIndex: 50,
    } : {
        opacity: isDragging ? 0.3 : 1,
        cursor: 'grab',
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className={`
                bg-white p-3 rounded-2xl shadow-sm border border-gray-100 
                flex items-center gap-3 select-none touch-none
                group transition-all duration-200
                ${isOverlay ? 'shadow-2xl border-blue-200' : 'hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5'}
            `}
        >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center shrink-0 shadow-inner`}>
                {recipe.image ? (
                    <img src={recipe.image} className="w-full h-full object-cover rounded-xl" alt="" />
                ) : (
                    <ChefHat className="w-5 h-5 text-blue-400" />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-gray-700 truncate group-hover:text-blue-600 transition-colors">{recipe.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                    {recipe.calories && (
                        <span className="text-[10px] bg-orange-50 text-orange-400 px-1.5 py-0.5 rounded-md font-medium">
                            {recipe.calories} kcal
                        </span>
                    )}
                </div>
            </div>

            <div className="text-gray-300">
                <Maximize2 className="w-4 h-4" />
            </div>
        </div>
    );
};

export default DraggableRecipe;
