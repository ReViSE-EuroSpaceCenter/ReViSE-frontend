"use client";

import Image from "next/image";

interface TeamHeaderProps {
    teamName: string;
    color: string;
    badges: string[];
}

export function MissionHeader({ teamName, color, badges }: Readonly<TeamHeaderProps>) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                {badges.map((badge) => (
                    <Image
                        key={badge}
                        src={badge}
                        alt={`${teamName} badge`}
                        width={140}
                        height={140}
                        className="w-10 h-10 object-contain"
                    />
                ))}
            </div>

            <h1 className="hidden md:block text-3xl font-bold text-center" style={{ color }}>
                {teamName}
            </h1>
        </div>
    );
}