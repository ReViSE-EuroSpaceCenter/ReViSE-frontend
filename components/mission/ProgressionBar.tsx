"use client";

type ProgressionBarProps = {
    completed: number;
    totalMission: number;
    color: string;
}

export function ProgressionBar({ completed, totalMission, color }: Readonly<ProgressionBarProps>) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-sm text-right whitespace-nowrap">{completed} / {totalMission}</span>
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            data-testid="progress-bar"
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(completed / totalMission) * 100}%`, backgroundColor: color }}
          />
        </div>
      </div>
    );
}