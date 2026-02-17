"use client";

import { useRecipes } from "@/store/useRecipeStore";
import { Trash2, ChefHat, Clock, Flame, Image as ImageIcon } from "lucide-react";

const RecipeList = () => {
    const { recipes, deleteRecipe } = useRecipes();

    if (recipes.length === 0) {
        return (
            <div className="text-center py-20 glass-card rounded-3xl border-dashed border-2 border-white/40">
                <div className="w-20 h-20 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-300 shadow-inner">
                    <ChefHat className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-700">Your cookbook is empty</h3>
                <p className="text-gray-400 mt-2">Create your first culinary masterpiece!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recipes.map((recipe) => (
                <div key={recipe.id} className="glass-card rounded-3xl p-4 transition-all hover:scale-[1.02] hover:shadow-2xl group flex flex-col relative overflow-hidden">
                    {/* Hero Image / Placeholder */}
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-4 relative overflow-hidden">
                        {recipe.image ? (
                            <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-blue-200">
                                <ImageIcon className="w-12 h-12" />
                            </div>
                        )}

                        {/* Tags Overlay */}
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                            {recipe.tags?.slice(0, 3).map(tag => (
                                <span key={tag} className="px-2 py-1 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-gray-600 rounded-lg shadow-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteRecipe(recipe.id);
                            }}
                            className="absolute top-2 right-2 p-2 bg-white/80 rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-red-500 shadow-sm"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">{recipe.name}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">
                            {recipe.description || "No description provided."}
                        </p>

                        {/* Stats Footer */}
                        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 bg-white/50 p-2 rounded-xl">
                            {recipe.prepTime && (
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                                    {recipe.prepTime}
                                </div>
                            )}
                            {recipe.calories && (
                                <div className="flex items-center gap-1.5">
                                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                                    {recipe.calories} kcal
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 ml-auto">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                {recipe.ingredients.length} ingr.
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecipeList;
