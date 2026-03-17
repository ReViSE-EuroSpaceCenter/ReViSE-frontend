"use client";

type ProgressionBarProps = {
    completed: number;
    totalMission: number;
    color: string;
}

export function ProgressionBar({ completed, totalMission, color }: Readonly<ProgressionBarProps>) {
    return (
        <div className="flex flex-col gap-1">
            <div className="text-sm text-right">
                <span className="whitespace-nowrap">{completed} / {totalMission}</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(completed/totalMission)*100}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}