import RecipeList from "@/components/RecipeList";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function RecipesPage() {
    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 mb-1">Your Recipes</h1>
                    <p className="text-gray-500">Manage your culinary collection.</p>
                </div>
                <Link href="/recipes/new" className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95">
                    <Plus className="w-5 h-5" />
                    New Recipe
                </Link>
            </div>

            <RecipeList />
        </div>
    );
}
