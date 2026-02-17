"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChefHat, CalendarDays, ShoppingCart, Settings, Activity } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import clsx from "clsx";

const Sidebar = () => {
    const pathname = usePathname();

    const navItems = [
        { name: "Planner", href: "/", icon: CalendarDays },
        { name: "Recipes", href: "/recipes", icon: ChefHat },
        { name: "Grocery List", href: "/grocery-list", icon: ShoppingCart },
        { name: "Macros", href: "/macros", icon: Activity },
    ];

    return (
        <aside className="w-64 bg-white/50 backdrop-blur-xl border-r border-white/60 flex flex-col h-full z-20">
            <div className="p-8 pb-4">
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-200">
                        <ChefHat className="w-5 h-5" />
                    </div>
                    Bloom
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-6">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium",
                                isActive
                                    ? "bg-white shadow-lg shadow-blue-100/50 text-blue-600"
                                    : "text-gray-500 hover:bg-white/50 hover:text-gray-900"
                            )}
                        >
                            <Icon className={clsx("w-5 h-5", isActive ? "text-blue-500" : "text-gray-400")} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6">
                <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/50">
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "w-8 h-8"
                            }
                        }}
                    />
                    <span className="font-medium text-gray-600">My Account</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
