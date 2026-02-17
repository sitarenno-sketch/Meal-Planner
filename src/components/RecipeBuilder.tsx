"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Check, Image as ImageIcon, Clock, Users, ArrowLeft } from "lucide-react";
import { useRecipeStore, Ingredient } from "@/store/useRecipeStore";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";

const RecipeBuilder = () => {
    const addRecipe = useRecipeStore((state) => state.addRecipe);

    // Core Data
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    // Stats
    const [prepTime, setPrepTime] = useState("");
    const [servings, setServings] = useState<number | "">("");
    const [macros, setMacros] = useState({ protein: "", carbs: "", fats: "" });
    const [calories, setCalories] = useState("");

    // Tags (e.g. Dinner, Vegan)
    const [activeTags, setActiveTags] = useState<string[]>([]);

    // Lists
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [instructions, setInstructions] = useState<{ id: string, text: string }[]>([]);

    // Temporary Inputs
    const [newIngredient, setNewIngredient] = useState({ name: "", amount: "", unit: "g" });
    const [newInstruction, setNewInstruction] = useState("");

    const AVAILABLE_TAGS = ["Dinner", "Lunch", "Breakfast", "Vegan", "Keto", "Quick Prep", "Gluten Free"];

    const toggleTag = (tag: string) => {
        setActiveTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleAddIngredient = () => {
        if (!newIngredient.name) return;
        setIngredients([
            ...ingredients,
            {
                id: uuidv4(),
                name: newIngredient.name,
                amount: newIngredient.amount ? parseFloat(newIngredient.amount) : 0,
                unit: newIngredient.unit,
            },
        ]);
        setNewIngredient({ name: "", amount: "", unit: "g" });
    };

    const handleAddInstruction = () => {
        if (!newInstruction.trim()) return;
        setInstructions([...instructions, { id: uuidv4(), text: newInstruction }]);
        setNewInstruction("");
    };

    const handleSave = () => {
        if (!name) return;
        addRecipe({
            name,
            description,
            prepTime,
            servings: Number(servings) || 4,
            tags: activeTags,
            ingredients,
            instructions: instructions.map(i => i.text),
            calories: Number(calories) || 0,
            macros: {
                protein: Number(macros.protein) || 0,
                carbs: Number(macros.carbs) || 0,
                fats: Number(macros.fats) || 0,
            },
            color: "bg-purple-100 text-purple-800" // Default fallback
        });

        // Reset form
        setName("");
        setDescription("");
        setPrepTime("");
        setServings("");
        setMacros({ protein: "", carbs: "", fats: "" });
        setCalories("");
        setActiveTags([]);
        setIngredients([]);
        setInstructions([]);
    };

    return (
        <div className="min-h-screen bg-transparent">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/recipes" className="p-2 hover:bg-white/50 rounded-full transition-colors text-gray-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                        Create New Recipe
                    </h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={!name}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-medium rounded-full shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                    <Save className="w-4 h-4" />
                    Save Recipe
                </button>
            </div>

            <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 items-start">

                {/* Left Column: Hero Image & Key Stats */}
                <div className="space-y-6 sticky top-8">
                    {/* Image Upload Placeholder */}
                    <div className="aspect-[4/5] bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl border-2 border-dashed border-blue-100 flex flex-col items-center justify-center text-center p-8 group cursor-pointer hover:border-blue-300 transition-all relative overflow-hidden">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            <ImageIcon className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-gray-700">Add a hero photo</h3>
                        <p className="text-sm text-gray-400 mt-2 max-w-[200px]">Drag and drop or click to upload your culinary masterpiece.</p>
                        <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-gray-300 uppercase tracking-widest">
                            Recommended size: 1200x1500px
                        </div>
                    </div>

                    {/* Quick Stats Card */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Cook Time</label>
                                <input
                                    type="text"
                                    className="block w-full text-sm font-medium text-gray-800 outline-none bg-transparent placeholder:text-gray-300"
                                    placeholder="e.g. 45 mins"
                                    value={prepTime}
                                    onChange={e => setPrepTime(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Servings</label>
                                <input
                                    type="number"
                                    className="block w-full text-sm font-medium text-gray-800 outline-none bg-transparent placeholder:text-gray-300"
                                    placeholder="4 people"
                                    value={servings}
                                    onChange={e => setServings(e.target.value === "" ? "" : Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Macros Input */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                        <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                            Nutrition per serving
                        </label>

                        {/* Calories - Full Width */}
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Calories</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className="w-full bg-gray-50 rounded-lg p-2 text-sm font-bold text-gray-700 outline-none focus:ring-2 ring-blue-100"
                                    placeholder="0"
                                    value={calories}
                                    onChange={e => setCalories(e.target.value)}
                                />
                                <span className="absolute right-2 top-2 text-xs text-gray-400">kcal</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Protein</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        className="w-full bg-gray-50 rounded-lg p-2 text-sm font-bold text-gray-700 outline-none focus:ring-2 ring-blue-100"
                                        placeholder="0"
                                        value={macros.protein}
                                        onChange={e => setMacros({ ...macros, protein: e.target.value })}
                                    />
                                    <span className="absolute right-2 top-2 text-xs text-gray-400">g</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Carbs</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        className="w-full bg-gray-50 rounded-lg p-2 text-sm font-bold text-gray-700 outline-none focus:ring-2 ring-blue-100"
                                        placeholder="0"
                                        value={macros.carbs}
                                        onChange={e => setMacros({ ...macros, carbs: e.target.value })}
                                    />
                                    <span className="absolute right-2 top-2 text-xs text-gray-400">g</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Fats</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        className="w-full bg-gray-50 rounded-lg p-2 text-sm font-bold text-gray-700 outline-none focus:ring-2 ring-blue-100"
                                        placeholder="0"
                                        value={macros.fats}
                                        onChange={e => setMacros({ ...macros, fats: e.target.value })}
                                    />
                                    <span className="absolute right-2 top-2 text-xs text-gray-400">g</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Link to Tags */}
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_TAGS.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeTags.includes(tag)
                                    ? 'bg-blue-100 text-blue-600 shadow-sm'
                                    : 'bg-white text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                {activeTags.includes(tag) && <span className="mr-1">✓</span>}
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="space-y-8 pb-20">

                    {/* Title & Description */}
                    <div>
                        <input
                            type="text"
                            placeholder="Untitled Culinary Masterpiece"
                            className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder:text-gray-200 text-gray-800"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <textarea
                            placeholder="Write a short, inspiring description about this dish..."
                            className="w-full mt-4 bg-transparent border-none outline-none text-gray-500 resize-none h-20"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Ingredients Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <div className="w-1 h-6 bg-blue-400 rounded-full" />
                                Ingredients
                            </h3>
                        </div>

                        <div className="bg-white rounded-3xl p-1 shadow-sm border border-gray-100 space-y-1">
                            {ingredients.map((ing) => (
                                <div key={ing.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl group transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 font-medium text-gray-700">{ing.name}</div>
                                    <div className="text-gray-400">{ing.amount} {ing.unit}</div>
                                    <button onClick={() => setIngredients(ingredients.filter(i => i.id !== ing.id))} className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {/* Add Ingredient Row */}
                            <div className="p-2 grid grid-cols-[80px_1fr_100px_auto] gap-2 items-center bg-gray-50/50 rounded-2xl m-2">
                                <input
                                    type="number"
                                    placeholder="Qty"
                                    className="bg-white p-2.5 rounded-xl text-sm outline-none focus:ring-2 ring-blue-100 transition-all text-center"
                                    value={newIngredient.amount}
                                    onChange={e => setNewIngredient({ ...newIngredient, amount: e.target.value })}
                                    onKeyDown={e => e.key === 'Enter' && handleAddIngredient()}
                                />
                                <input
                                    type="text"
                                    placeholder="Ingredient name (e.g. Fresh Basil)"
                                    className="bg-white p-2.5 rounded-xl text-sm outline-none focus:ring-2 ring-blue-100 transition-all"
                                    value={newIngredient.name}
                                    onChange={e => setNewIngredient({ ...newIngredient, name: e.target.value })}
                                    onKeyDown={e => e.key === 'Enter' && handleAddIngredient()}
                                />
                                <select
                                    className="bg-white p-2.5 rounded-xl text-sm outline-none focus:ring-2 ring-blue-100 transition-all text-gray-600"
                                    value={newIngredient.unit}
                                    onChange={e => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                                >
                                    <option value="g">g</option>
                                    <option value="kg">kg</option>
                                    <option value="ml">ml</option>
                                    <option value="l">l</option>
                                    <option value="pcs">pieces</option>
                                    <option value="cup">cup</option>
                                    <option value="tbsp">tbsp</option>
                                    <option value="tsp">tsp</option>
                                </select>
                                <button
                                    onClick={handleAddIngredient}
                                    disabled={!newIngredient.name}
                                    className="p-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:bg-gray-200"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Instructions Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <div className="w-1 h-6 bg-purple-400 rounded-full" />
                                Instructions
                            </h3>
                        </div>

                        <div className="space-y-4 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-100 -z-10" />

                            {instructions.map((inst, index) => (
                                <div key={inst.id} className="flex gap-6 group">
                                    <div className="w-10 h-10 rounded-full bg-white border border-gray-100 text-gray-500 font-bold flex items-center justify-center shrink-0 shadow-sm z-10 group-hover:border-blue-200 group-hover:text-blue-500 transition-colors">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 py-2">
                                        <p className="text-gray-700 leading-relaxed">{inst.text}</p>
                                    </div>
                                    <button onClick={() => setInstructions(instructions.filter(i => i.id !== inst.id))} className="self-center text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {/* Add Step */}
                            <div className="flex gap-6 items-start">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 font-bold flex items-center justify-center shrink-0 z-10">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        placeholder="Start by preheating the oven..."
                                        className="w-full bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-300 resize-none h-20 p-2 focus:bg-white/50 rounded-xl transition-all"
                                        value={newInstruction}
                                        onChange={e => setNewInstruction(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAddInstruction();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleAddInstruction}
                                        className="text-sm font-medium text-blue-500 hover:text-blue-600 px-2"
                                    >
                                        + Add step
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RecipeBuilder;
