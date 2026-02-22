"use client";

interface ProgressionBarProps {
    progression: number;
    completed: number;
    totalMission: number;
    color: string;
}

export function ProgressionBar({ progression, completed, totalMission, color }: ProgressionBarProps) {
    return (
        <div className="flex flex-col gap-1 w-full lg:w-80">
            <div className="flex justify-between text-sm">
                <span>Progression</span>
                <span>{completed} / {totalMission}</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progression}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}