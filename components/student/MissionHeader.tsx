"use client";

interface TeamHeaderProps {
    teamName: string;
    color: string;
    badges: string[];
    onBack: () => void;
}

export function MissionHeader({ teamName, color, badges, onBack }: TeamHeaderProps) {
    return (
        <div className="flex items-center gap-4">
            <button
                onClick={onBack}
                className="px-4 py-2 rounded-xl bg-purpleReViSE hover:bg-purpleReViSE/80 cursor-pointer transition text-sm"
            >
                Retour
            </button>

            <div className="flex items-center gap-2">
                {badges.map((badge, index) => (
                    <img
                        key={index}
                        src={badge}
                        alt={`${teamName} badge ${index + 1}`}
                        className="w-35 h-35 object-contain"
                    />
                ))}
            </div>

            <h1 className="text-4xl font-bold text-center" style={{ color }}>
                {teamName} Missions
            </h1>
        </div>
    );
}