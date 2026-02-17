"use client";

import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';

type Props = {
    id: string; // e.g., "Monday-lunch"
    data: { date: string; mealType: string };
    children?: ReactNode;
    isOver?: boolean;
};

const DroppableSlot = ({ id, data, children }: Props) => {
    const { setNodeRef, isOver } = useDroppable({
        id,
        data,
    });

    return (
        <div
            ref={setNodeRef}
            className={`
                min-h-[80px] rounded-2xl border-2 border-dashed transition-all duration-200 p-2 space-y-2
                ${isOver
                    ? 'border-blue-400 bg-blue-50/50 scale-[1.02]'
                    : children
                        ? 'border-transparent bg-white/40'
                        : 'border-gray-200 bg-white/20 hover:border-blue-200'
                }
            `}
        >
            {children}
            {/* Placeholder if empty and not hovering */}
            {!children && !isOver && (
                <div className="h-full flex items-center justify-center text-gray-300 text-xs font-medium">
                    + Add Meal
                </div>
            )}
        </div>
    );
};

export default DroppableSlot;
