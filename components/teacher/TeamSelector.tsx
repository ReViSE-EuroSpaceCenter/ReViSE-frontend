"use client";

import Image from "next/image";
import clsx from "clsx";

interface TeamSelectorProps {
    activeTeamKeys: string[];
    selectedTeam: string | null;
    onSelectTeam: (teamKey: string) => void;
}

export function TeamSelector({
                                 activeTeamKeys,
                                 selectedTeam,
                                 onSelectTeam,
                             }: TeamSelectorProps) {
    return (
        <div
            className={clsx(
                "grid gap-3 sm:gap-4 place-items-center shrink-0",
                activeTeamKeys.length <= 4
                    ? "grid-cols-2 lg:grid-cols-4"
                    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
            )}
        >
            {activeTeamKeys.map((teamKey) => (
                <button
                    key={teamKey}
                    onClick={() => onSelectTeam(teamKey)}
                    className={clsx(
                        "rounded-xl border px-3 sm:px-4 py-3 transition-all cursor-pointer w-full max-w-28 sm:max-w-32 lg:max-w-36",
                        selectedTeam === teamKey
                            ? "border-purpleReViSE bg-white/10 scale-105"
                            : "border-white/10 hover:border-white/30"
                    )}
                >
                    <div className="flex flex-col items-center gap-2 sm:gap-3">
                        <Image
                            src={`/badges/${teamKey}.png`}
                            alt={teamKey}
                            width={64}
                            height={64}
                            className="object-contain w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
                        />
                        <span className="text-xs sm:text-sm font-medium text-center leading-tight">
                            {teamKey}
                        </span>
                    </div>
                </button>
            ))}
        </div>
    );
}